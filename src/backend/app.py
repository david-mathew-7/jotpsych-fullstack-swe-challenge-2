from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import random
import os
from cryptography.fernet import Fernet
key=Fernet.generate_key()
fernet = Fernet(key)

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SECRET_KEY'] = 'secret123'
    app.config['JWT_SECRET_KEY'] = 'secret1234'

    CORS(
        app,
        resources={r"*": {"origins": ["*"]}},
        allow_headers=["Authorization", "Content-Type" , "app-version"],
        methods=["GET", "POST", "OPTIONS"],
        max_age=86400
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return jsonify({'status': 200})

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(
            data['password']).decode('utf-8')
        new_user = User(username=data['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(
                identity={'username': user.username})
            return jsonify({'token': access_token}), 200
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/user', methods=['GET'])
    @jwt_required()
    def user():
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user['username']).first()
        if (user.motto):
            decrypted_motto = fernet.decrypt(user.motto).decode()
        else:
            decrypted_motto = user.motto
        return { 'username': user.username, 'motto': decrypted_motto}

    @app.route('/upload', methods=['POST'])
    @jwt_required()
    def upload_audio():
        current_user = get_jwt_identity()
        transcription_time = random.randint(5, 15)
        time.sleep(transcription_time)
        transcription_text = f"{random.choice(['Hello world!', 'This is a test.', 'oo bar baz.'])}"
        user = User.query.filter_by(username=current_user['username']).first()
        encrypted_motto = fernet.encrypt(transcription_text.encode())
        user.motto = encrypted_motto
        db.session.commit()
        return jsonify({'motto': transcription_text})
    return app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    motto = db.Column(db.String(150), nullable=True)


if __name__ == '__main__':
    app = create_app()
    app.run(port=3002, debug=True)
