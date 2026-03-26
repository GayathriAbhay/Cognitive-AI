from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

db = SQLAlchemy()
# Global model storage to save memory
shared_model = None
shared_tokenizer = None

def create_app():
    global shared_model, shared_tokenizer
    app = Flask(__name__)
    CORS(app) 
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///assistant.db'
    app.config['JWT_SECRET_KEY'] = 'this-is-a-very-secure-secret-key-12345'
    
    db.init_app(app)
    JWTManager(app)

    @app.route('/')
    def home():
        return {"status": "success", "message": "CogniLearn Backend is running"}, 200

    # 🚀 Optimization: Load model ONCE for the whole app
    if shared_model is None:
        print("🚀 Loading Shared AI Model (Flan-T5-Small)...")
        shared_tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
        shared_model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
        print("✅ AI Model Loaded Successfully!")
    
    # Register Blueprints
    from .routes.auth import auth_bp
    from .routes.student import student_bp
    from .routes.ai import ai_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(student_bp, url_prefix='/student')
    app.register_blueprint(ai_bp, url_prefix='/ai')
    
    with app.app_context():
        db.create_all()
        
    return app