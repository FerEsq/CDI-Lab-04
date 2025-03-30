from flask import Blueprint, request, jsonify, send_file, current_app
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from config.database import get_db
from utils.auth import token_required
from utils.crypto import sign_file, verify_signature
from cryptography.hazmat.primitives import serialization
from bson import ObjectId
import uuid

files_bp = Blueprint('files', __name__)

@files_bp.route('/', methods=['GET'])
@token_required
def get_files(current_user):
    db = get_db()
    files = list(db.files.find({'owner_id': current_user['_id']}, {'path': 0}))
    
    # Convert ObjectId to string for JSON serialization
    for file in files:
        file['_id'] = str(file['_id'])
        file['owner_id'] = str(file['owner_id'])
    
    return jsonify(files), 200

@files_bp.route('/upload', methods=['POST'])
@token_required
def save_file(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    filename = secure_filename(file.filename)
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    db = get_db()
    file_doc = {
        'filename': filename,
        'original_name': file.filename,
        'path': file_path,
        'size': os.path.getsize(file_path),
        'mime_type': file.content_type,
        'is_signed': False,
        'signature': None,
        'owner_id': current_user['_id'],
        'created_at': datetime.utcnow()
    }
    
    # Check if file should be signed
    should_sign = request.form.get('sign', 'false').lower() == 'true'
    if should_sign:
        # Get user's private key from PEM format
        private_key = serialization.load_pem_private_key(
            current_user['private_key'].encode('utf-8'),
            password=None
        )
        
        # Sign the file
        signature = sign_file(file_path, private_key)
        
        # Update file document with signature
        file_doc.update({
            'is_signed': True,
            'signature': signature,
            'signed_at': datetime.utcnow()
        })
    
    result = db.files.insert_one(file_doc)
    file_doc['_id'] = str(result.inserted_id)
    file_doc['owner_id'] = str(file_doc['owner_id'])
    
    return jsonify(file_doc), 201

@files_bp.route('/<file_id>/download', methods=['GET'])
@token_required
def download_file(current_user, file_id):
    db = get_db()
    file_doc = db.files.find_one({'_id': ObjectId(file_id)})
    
    if not file_doc:
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(
        file_doc['path'],
        as_attachment=True,
        download_name=file_doc['original_name']
    )

@files_bp.route('/<file_id>/info', methods=['GET'])
@token_required
def get_file_data(current_user, file_id):
    db = get_db()
    # exclude path
    file_doc = db.files.find_one({'_id': ObjectId(file_id)}, {'path': 0})
    
    if not file_doc:
        return jsonify({'error': 'File not found'}), 404
    
    # exclude _id
    file_doc['_id'] = str(file_doc['_id'])
    file_doc['owner_id'] = str(file_doc['owner_id'])
    return jsonify(file_doc), 200
    
@files_bp.route('/verify', methods=['POST'])
@token_required
def verify_signature_endpoint(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'Missing required fields'}), 400
    
    user_public_key = current_user['public_key']
    
    # Load public key from PEM format
    public_key = serialization.load_pem_public_key(
        user_public_key.encode('utf-8')
    )

    # get file from request
    file = request.files['file']
    signature = request.form.get('signature')

    # save file in a temp folder
    file_path = os.path.join(current_app.config['TEMP_FOLDER'], uuid.uuid4().hex)
    file.save(file_path)
    
    # Verify signature
    is_valid = verify_signature(
        file_path,
        signature,
        public_key
    )

    # delete file from temp folder
    os.remove(file_path)
    
    return jsonify({
        'is_valid': is_valid,
        'message': 'Signature is valid' if is_valid else 'Signature is invalid'
    }), 200 