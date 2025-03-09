import cv2
import numpy as np
from sklearn.cluster import KMeans
import dlib

# Yuzni aniqlash uchun model
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")  # Yuqoridan yuklab oling

def extract_dominant_colors(image, k=4):
    """ Rasmdan k ta asosiy rangni ajratib oladi. """
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    pixels = image.reshape((-1, 3))
    
    kmeans = KMeans(n_clusters=k, n_init=10)
    kmeans.fit(pixels)
    colors = kmeans.cluster_centers_.astype(int)

    return [tuple(map(int, color)) for color in colors]

def detect_face_shape(landmarks):
    """ Yuz shaklini aniqlaydi. """
    jaw = landmarks[0:17]  # Yuz shakli uchun jag' chizig'ini olamiz

    # Yuz eni va bo'yi
    width = np.linalg.norm(jaw[0] - jaw[-1])
    height = np.linalg.norm(landmarks[8] - landmarks[27])

    ratio = width / height

    if ratio < 0.8:
        return "Oval"
    elif 0.8 <= ratio < 1.1:
        return "Round"
    elif 1.1 <= ratio < 1.3:
        return "Square"
    else:
        return "Rectangle"

def analyze_face(image_path):
    """ Rasmdagi yuzdan asosiy ranglarni va shaklni aniqlaydi. """
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = detector(gray)

    if len(faces) == 0:
        return {"error": "Yuz topilmadi"}, None

    for face in faces:
        landmarks = predictor(gray, face)
        landmarks = np.array([[p.x, p.y] for p in landmarks.parts()])

        # Teri rangini ajratish uchun yuz markazidan 50x50 piksel maydonni olish
        x, y, w, h = face.left(), face.top(), face.width(), face.height()
        skin_sample = image[y + h//4 : y + 3*h//4, x + w//4 : x + 3*w//4]

        # Asosiy ranglarni aniqlash
        dominant_colors = extract_dominant_colors(skin_sample, k=4)

        # Yuz shaklini aniqlash
        face_shape = detect_face_shape(landmarks)

        return dominant_colors, face_shape

    return None, None
