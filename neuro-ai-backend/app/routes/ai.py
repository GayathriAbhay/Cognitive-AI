from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Preference, Session, db
from ..ai_engine.pipeline import ai_pipeline

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/process', methods=['POST'])
@jwt_required()
def process_ai():
    student_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
        
    input_text = data['text']
    
    # Fetch student preferences
    prefs = Preference.query.filter_by(student_id=student_id).first()
    
    # Map backend preferences to AI profile
    # user_profile expects {'type': 'ADHD' | 'ASD' | 'Dyslexia' | 'default'}
    # We can use contrast_mode or a mapping from input_mode/difficulty
    
    user_type = "default"
    if prefs:
        if prefs.contrast_mode == 'high':
            user_type = "ADHD"
        elif prefs.input_mode == 'visual':
            user_type = "ASD"
        elif prefs.input_mode == 'verbal':
            user_type = "Dyslexia"
            
    user_profile = {"type": user_type}
    
    try:
        result = ai_pipeline(input_text, user_profile)
        
        # Save interaction to session history
        new_session = Session(
            student_id=student_id,
            query=input_text,
            response=str(result['simplified']) # Store simplified version
        )
        db.session.add(new_session)
        db.session.commit()
        
        return jsonify(result), 200
        
    except Exception as e:
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
            pdf_reader = PdfReader(io.BytesIO(file.read()))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            if not text.strip():
                return jsonify({"error": "Failed to extract text from PDF"}), 400

            # Process with AI
            prefs = Preference.query.filter_by(student_id=student_id).first()
            user_type = "default"
            if prefs:
                if prefs.contrast_mode == 'high': user_type = "ADHD"
                elif prefs.input_mode == 'visual': user_type = "ASD"
                elif prefs.input_mode == 'verbal': user_type = "Dyslexia"
            
            # Limit text to first 1000 chars for the small model
            result = ai_pipeline(text[:1000], {"type": user_type})
            
            return jsonify(result), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    return jsonify({"error": "Invalid file type"}), 400
