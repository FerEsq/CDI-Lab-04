from flask import Blueprint, request, jsonify, send_file, current_app
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from config.database import get_db
from utils.auth import token_required

files_bp = Blueprint('files', __name__)

@files_bp.route('/', methods=['GET'])
@token_required
def get_files(current_user):
    db = get_db()
    files = list(db.files.find({'owner_id': current_user['_id']}))
    
    # Convert ObjectId to string for JSON serialization
    for file in files:
        file['_id'] = str(file['_id'])
        file['owner_id'] = str(file['owner_id'])
    
    return jsonify(files), 200

@files_bp.route('/guardar', methods=['POST'])
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
    
    result = db.files.insert_one(file_doc)
    file_doc['_id'] = str(result.inserted_id)
    file_doc['owner_id'] = str(file_doc['owner_id'])
    
    return jsonify(file_doc), 201

@files_bp.route('/<file_id>/descargar', methods=['GET'])
@token_required
def download_file(current_user, file_id):
    db = get_db()
    file_doc = db.files.find_one({'_id': file_id})
    
    if not file_doc:
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(
        file_doc['path'],
        as_attachment=True,
        download_name=file_doc['original_name']
    )

@files_bp.route('/verificar', methods=['POST'])
@token_required
def verify_signature(current_user):
    data = request.get_json()
    if not data or 'file_id' not in data or 'public_key' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    db = get_db()
    file_doc = db.files.find_one({'_id': data['file_id']})
    
    if not file_doc:
        return jsonify({'error': 'File not found'}), 404
    
    # TODO: Implement signature verification logic
    return jsonify({'message': 'Signature verification endpoint'}), 200 