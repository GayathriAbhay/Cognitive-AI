from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///assistant.db'
    app.config['JWT_SECRET_KEY'] = 'this-is-a-very-secure-secret-key-12345'
    
    db.init_app(app)
    JWTManager(app)
    
    # ✅ ADD THIS
    @app.route('/')
    def home():
        return {"message": "API is running"}
    
    # Register Blueprints
    from .routes.auth import auth_bp
    from .routes.student import student_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(student_bp, url_prefix='/student')
    
    with app.app_context():
        db.create_all()
        
    return app