from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Preference, History, db

student_bp = Blueprint('student', __name__)

@student_bp.route('/preferences', methods=['GET', 'PUT'])
@jwt_required()
def manage_preferences():
    # Convert JWT identity to integer
    student_id = int(get_jwt_identity())
    prefs = Preference.query.filter_by(student_id=student_id).first()

    if request.method == 'PUT':
        data = request.get_json()
        if not prefs:
            prefs = Preference(student_id=student_id)
            db.session.add(prefs)
        
        # Security & Profile Management logic
        prefs.font_size = data.get('font_size', prefs.font_size)
        prefs.contrast_mode = data.get('contrast_mode', prefs.contrast_mode)
        # FR-5: Learning style (visual vs verbal)
        prefs.input_mode = data.get('input_mode', prefs.input_mode)
        
        db.session.commit()
        return jsonify({"message": "Preferences updated"}), 200

    # Rule-based adaptation logic (Section 4.2)
    adaptation_hint = "Standard"
    if prefs and prefs.input_mode == "visual":
        adaptation_hint = "Provide image descriptions and bullet points"
    elif prefs and prefs.input_mode == "verbal":
        adaptation_hint = "Provide detailed text explanations"

    return jsonify({
        "font_size": prefs.font_size if prefs else "medium",
        "input_mode": prefs.input_mode if prefs else "text",
        "difficulty_level": prefs.difficulty_level if prefs else "beginner",
        "adaptation_logic_hint": adaptation_hint
    }), 200

@student_bp.route('/progress', methods=['POST'])
@jwt_required()
def add_progress():
    student_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or 'topic' not in data or 'score' not in data:
        return jsonify({"error": "Missing topic or score"}), 400
        
    prefs = Preference.query.filter_by(student_id=student_id).first()
    if not prefs:
        prefs = Preference(student_id=student_id)
        db.session.add(prefs)
        
    new_history = History(
        student_id=student_id,
        topic=data['topic'],
        score=data['score'],
        difficulty_level=prefs.difficulty_level
    )
    db.session.add(new_history)
    
    # Rule-based Difficulty Adjustment Logic
    levels = ['beginner', 'intermediate', 'advanced']
    current_idx = levels.index(prefs.difficulty_level) if prefs.difficulty_level in levels else 0
    
    adjustment_message = "Difficulty remains the same."
    if data['score'] >= 80 and current_idx < 2:
        prefs.difficulty_level = levels[current_idx + 1]
        adjustment_message = f"Score is high. Difficulty automatically increased to {prefs.difficulty_level}."
    elif data['score'] <= 40 and current_idx > 0:
        prefs.difficulty_level = levels[current_idx - 1]
        adjustment_message = f"Score is low. Difficulty automatically decreased to {prefs.difficulty_level}."
        
    db.session.commit()
    
    return jsonify({
        "message": "Progress saved successfully",
        "adaptation_logic": adjustment_message,
        "new_difficulty": prefs.difficulty_level
    }), 201