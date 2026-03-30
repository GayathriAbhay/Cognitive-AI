from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Student, Preference, History, ChatSession, db

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
        "contrast_mode": prefs.contrast_mode if prefs else "standard",
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

@student_bp.route('/onboarding', methods=['POST'])
@jwt_required()
def student_onboarding():
    student_id = int(get_jwt_identity())
    data = request.get_json()
    student = Student.query.get(student_id)
    
    if not student:
        return jsonify({"error": "Student not found"}), 404
    
    # Update Student Basic Info
    student.age = data.get('age', student.age)
    student.grade = data.get('grade', student.grade)
    student.interests = data.get('interests', student.interests)
    student.is_onboarded = True
    
    # Update Preferences if provided
    prefs = Preference.query.filter_by(student_id=student_id).first()
    if not prefs:
        prefs = Preference(student_id=student_id)
        db.session.add(prefs)
    
    prefs.contrast_mode = data.get('contrast_mode', prefs.contrast_mode)
    prefs.input_mode = data.get('input_mode', prefs.input_mode)
    
    db.session.commit()
    return jsonify({"message": "Onboarding complete!"}), 200

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    student_id = int(get_jwt_identity())
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    
    prefs = Preference.query.filter_by(student_id=student_id).first()
    
    return jsonify({
        "name": student.name,
        "email": student.email,
        "age": student.age,
        "grade": student.grade,
        "interests": student.interests,
        "is_onboarded": student.is_onboarded,
        "preferences": {
            "font_size": prefs.font_size if prefs else "medium",
            "contrast_mode": prefs.contrast_mode if prefs else "standard",
            "input_mode": prefs.input_mode if prefs else "text",
            "difficulty_level": prefs.difficulty_level if prefs else "beginner"
        }
    }), 200

@student_bp.route('/progress-report', methods=['GET'])
@jwt_required()
def progress_report():
    from datetime import datetime, timedelta
    student_id = int(get_jwt_identity())

    sessions = db.session.query(ChatSession).filter_by(student_id=student_id)\
        .order_by(ChatSession.timestamp.desc()).all()
    
    print(f"DEBUG progress_report: student_id={student_id}, found {len(sessions)} sessions")

    total_sessions = len(sessions)

    # Streak: count consecutive days with at least one session
    streak = 0
    if sessions:
        today = datetime.utcnow().date()
        day_check = today
        session_dates = set(s.timestamp.date() for s in sessions)
        while day_check in session_dates:
            streak += 1
            day_check -= timedelta(days=1)

    # Recent topics: include full data for resumption
    recent = []
    for s in sessions[:5]:
        q = s.query or ''
        label = q[:55] + '…' if len(q) > 55 else q

        ts_str = s.timestamp.strftime('%d %b, %I:%M %p') if s.timestamp else 'Just now'
        
        recent.append({
            "id": s.session_id,
            "topic": label,
            "full_query": q,
            "response": s.response or '',
            "timestamp": ts_str
        })

    # Sessions by day for last 7 days
    activity = []
    for i in range(6, -1, -1):
        day = datetime.utcnow().date() - timedelta(days=i)
        count = sum(1 for s in sessions if s.timestamp.date() == day)
        activity.append({"day": day.strftime('%a'), "count": count})

    return jsonify({
        "total_sessions": total_sessions,
        "streak_days": streak,
        "recent_topics": recent,
        "weekly_activity": activity
    }), 200