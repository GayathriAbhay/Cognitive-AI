from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Preference, ChatSession, db
from dotenv import load_dotenv
import os
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/process', methods=['POST'])
@jwt_required()
def process_ai():
    student_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
        
    input_text = data['text']
    history = data.get('history', [])  # conversation history from frontend
    print(f"DEBUG: Processing AI request for text: '{input_text}'")
    
    # Fetch student preferences
    prefs = Preference.query.filter_by(student_id=student_id).first()
    
    # Build message list: system prompt + history + current user message
    messages = [
        {
            "role": "system",
            "content": (
                "You are CogniLearn, a friendly AI learning assistant for students. "
                "Always use simple, clear English. "
                "When explaining step by step, format EVERY step exactly like this: "
                "**Step 1: Step Title** Description of the step. "
                "**Step 2: Step Title** Description of the step. "
                "Use * bullet points for lists (e.g., * Item one). "
                "Use **bold** for key terms. "
                "When asked to simplify a lesson, look at the conversation history and simplify that content. "
                "Keep responses concise and student-friendly."
            )
        }
    ]

    # Inject conversation history (last 10 turns max)
    for turn in history[-10:]:
        role = turn.get('role', 'user')
        content = turn.get('content', '')
        if role in ('user', 'assistant') and content:
            messages.append({"role": role, "content": content})

    # Append the current user message
    messages.append({"role": "user", "content": input_text})
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages
        )

        answer = completion.choices[0].message.content
        print("🔥 RESPONSE:", answer)

        result = {
            "simplified": answer
        }
        
        # Save interaction to session history
        new_session = ChatSession(
            student_id=student_id,
            query=input_text,
            response=str(result['simplified'])
        )
        db.session.add(new_session)
        db.session.commit()
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"ERROR in process_ai: {e}")
        return jsonify({"error": str(e)}), 500

import io
from PyPDF2 import PdfReader

@ai_bp.route('/upload-pdf', methods=['POST'])
@jwt_required()
def upload_pdf():
    student_id = int(get_jwt_identity())
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file and file.filename.endswith('.pdf'):
        try:
            pdf_data = file.read()
            pdf_reader = PdfReader(io.BytesIO(pdf_data))
            
            # Decrypt if necessary (common for permissions-only encryption)
            if pdf_reader.is_encrypted:
                try:
                    pdf_reader.decrypt("")
                except:
                    pass
                    
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            
            if not text.strip():
                return jsonify({"error": "This PDF appears to be a scanned image or doesn't have readable text. I can only read text-based documents!"}), 400

            # Process with AI
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "Explain clearly for a student. Avoid repetition and circular definitions."
                    },
                    {
                        "role": "user",
                        "content": text[:1000]
                    }
                ]
            )

            answer = completion.choices[0].message.content
            result = {
                "simplified": answer
            }

            # Save interaction to session history
            new_session = ChatSession(
                student_id=student_id,
                query=f"Uploaded document: {file.filename}",
                response=answer
            )
            db.session.add(new_session)
            db.session.commit()
            
            return jsonify(result), 200
        except Exception as e:
            error_msg = str(e)
            if "PyCryptodome" in error_msg or "password" in error_msg.lower():
                error_msg = "This PDF is encrypted or password-protected and cannot be read. Please upload an unprotected copy!"
            elif "extract text" in error_msg.lower() or "stream" in error_msg.lower():
                error_msg = "The PDF format seems corrupted or unreadable. Please check the file and try again."
            
            print(f"ERROR in upload_pdf: {e}")
            return jsonify({"error": error_msg}), 500
            
    return jsonify({"error": "Invalid file type"}), 400
