from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from ..models import Student, db, Preference

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    existing = Student.query.filter_by(email=data['email']).first()
    if existing:
      return jsonify({"error": "User already exists"}), 409
    hashed_pw = generate_password_hash(data['password'])
    new_student = Student(name=data['name'], email=data['email'], password_hash=hashed_pw)
    db.session.add(new_student)
    db.session.commit()

    # create default preferences
    pref = Preference(student_id=new_student.student_id)
    db.session.add(pref)
    db.session.commit()
    return jsonify({"message": "Student registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    student = Student.query.filter_by(email=data['email']).first()
    if student and check_password_hash(student.password_hash, data['password']):
        token = create_access_token(identity=str(student.student_id))
        return jsonify(access_token=token), 200
    return jsonify({"error": "Invalid email or password"}), 401