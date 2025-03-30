from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from config.database import get_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    db = get_db()
    if db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    user = {
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'public_key': None,
        'created_at': datetime.utcnow()
    }
    db.users.insert_one(user)
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    db = get_db()
    
    user = db.users.find_one({'email': data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = jwt.encode(
        {
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(days=1)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    
    return jsonify({'token': token}), 200 