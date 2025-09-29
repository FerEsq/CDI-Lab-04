from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
import os

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)  # Enable credentials for cookies

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET')
    app.config['MONGODB_URI'] = os.getenv('MONGODB_URI')
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_DIR')
    app.config['TEMP_FOLDER'] = os.getenv('TEMP_FOLDER')
    app.config['REFRESH_TOKEN_EXPIRATION_TIME'] = os.getenv('REFRESH_TOKEN_EXPIRATION_TIME')
    app.config['ACCESS_TOKEN_EXPIRATION_TIME'] = os.getenv('ACCESS_TOKEN_EXPIRATION_TIME')
    
    # Cookie security configuration
    app.config.update(
        SESSION_COOKIE_SECURE=True,      # Only send cookies over HTTPS
        SESSION_COOKIE_HTTPONLY=True,    # Prevent access from JavaScript
        SESSION_COOKIE_SAMESITE='Strict', # CSRF protection
        PERMANENT_SESSION_LIFETIME=timedelta(hours=1)
    )

    if not os.path.exists(app.config['TEMP_FOLDER']):
        os.makedirs(app.config['TEMP_FOLDER'])
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Ensure upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.files import files_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(files_bp, url_prefix='/api/files')

    return app

if __name__ == '__main__':
    app = create_app()
    # if is production, set debug to False
    if os.getenv('ENV') == 'production':
        app.run(debug=False, port=int(os.getenv('PORT', 3000)))
    else:
        app.run(debug=True, port=int(os.getenv('PORT', 3000)))