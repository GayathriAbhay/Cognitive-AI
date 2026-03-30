from . import db
from datetime import datetime

class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    
    # New Onboarding Fields
    age = db.Column(db.Integer)
    grade = db.Column(db.String(50))
    interests = db.Column(db.Text)
    is_onboarded = db.Column(db.Boolean, default=False)
    
    # Links to Preferences (Section 4.4)
    preferences = db.relationship('Preference', backref='student', uselist=False)
    sessions = db.relationship('ChatSession', backref='student')
    history = db.relationship('History', backref='student')

class Preference(db.Model):
    __tablename__ = 'preferences'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'))
    font_size = db.Column(db.String(20), default='medium') # [cite: 117]
    contrast_mode = db.Column(db.String(20), default='standard') # [cite: 117]
    input_mode = db.Column(db.String(20), default='text') # [cite: 117]
    difficulty_level = db.Column(db.String(20), default='beginner')

class ChatSession(db.Model):
    __tablename__ = 'sessions'
    session_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'))
    query = db.Column(db.Text) # [cite: 117]
    response = db.Column(db.Text) # [cite: 117]
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class History(db.Model):
    __tablename__ = 'history'
    history_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'))
    topic = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    difficulty_level = db.Column(db.String(20), default='beginner')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)