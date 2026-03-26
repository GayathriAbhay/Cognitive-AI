from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app) 
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///assistant.db'
    app.config['JWT_SECRET_KEY'] = 'this-is-a-very-secure-secret-key-12345'
    
    db.init_app(app)
    JWTManager(app)

    @app.route('/')
    def home():
        return {"status": "success", "message": "CogniLearn Backend is running"}, 200

    
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