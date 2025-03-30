from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization
import base64

def generate_key_pair():
    # generate a private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    # generate a public key
    public_key = private_key.public_key()
    return private_key, public_key

def get_public_key_pem(public_key):
    # convert the public key to PEM format
    return public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

def get_private_key_pem(private_key):
    # convert the private key to PEM format
    return private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

def sign_file(file_path, private_key):
    # sign a file using RSA
    with open(file_path, 'rb') as f:
        file_content = f.read()
    
    # sign the file
    signature = private_key.sign(
        file_content,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    
    # return the signature
    return base64.b64encode(signature).decode('utf-8')

def verify_signature(file_path, signature, public_key):
    # verify a file signature
    with open(file_path, 'rb') as f:
        file_content = f.read()
    
    try:
        # decode the signature
        signature_bytes = base64.b64decode(signature)
        # verify the signature
        public_key.verify(
            signature_bytes,
            file_content,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        # return true if the signature is valid
        return True
    except:
        # return false if the signature is invalid
        return False 