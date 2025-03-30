from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from config.database import get_db
from utils.crypto import generate_key_pair, get_public_key_pem, get_private_key_pem

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    db = get_db()
    if db.users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    # Generate RSA key pair for the user
    private_key, public_key = generate_key_pair()
    private_key_pem = get_private_key_pem(private_key).decode('utf-8')
    public_key_pem = get_public_key_pem(public_key).decode('utf-8')
    
    user = {
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'private_key': private_key_pem,
        'public_key': public_key_pem,
        'created_at': datetime.utcnow()
    }
    
    db.users.insert_one(user)
    token = jwt.encode(
        {
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(hours=1)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    
    user.pop('private_key', None)
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
    }), 201
    
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
            'exp': datetime.utcnow() + timedelta(hours=1)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    
    return jsonify({'token': token}), 200 
