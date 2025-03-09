from flask import Flask, request, jsonify, render_template
from face_recognition import analyze_face
from amazon_api import search_amazon_products
import cv2
import numpy as np
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'error': 'Hech qanday rasm yuklanmadi'})

    image_file = request.files['image']
    filename = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
    image_file.save(filename)

    npimg = np.frombuffer(image_file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Yuz shakli va teri rangini aniqlash
    face_shape, skin_tone = analyze_face(img)

    # Amazon API orqali mos kiyimlarni qidirish
    recommended_clothes = search_amazon_products(face_shape, skin_tone)

    return jsonify({
        'face_shape': face_shape,
        'skin_tone': skin_tone,
        'recommended_clothes': recommended_clothes,
        'image_url': filename
    })

if __name__ == '__main__':
    app.run(debug=True)
