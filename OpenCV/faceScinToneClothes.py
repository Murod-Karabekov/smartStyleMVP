import cv2
import numpy as np
import requests
from sklearn.cluster import KMeans

def detect_face_and_skin(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    
    if len(faces) == 0:
        print("Yuz topilmadi!")
        return None, None
    
    x, y, w, h = faces[0]
    face_roi = image[y:y+h, x:x+w]
    
    return face_roi

def extract_skin_tone(image):
    reshaped_image = image.reshape((-1, 3))
    kmeans = KMeans(n_clusters=4)
    kmeans.fit(reshaped_image)
    dominant_colors = kmeans.cluster_centers_
    
    return [tuple(map(int, color)) for color in dominant_colors]

def find_matching_clothes(colors):
    amazon_url = "https://api.example.com/amazon/search"
    headers = {"Authorization": "Bearer YOUR_AMAZON_API_KEY"}
    
    matching_clothes = []
    for color in colors:
        query = f"clothing {color}"
        response = requests.get(amazon_url, headers=headers, params={"q": query})
        if response.status_code == 200:
            matching_clothes.append(response.json())
    
    return matching_clothes

if __name__ == "__main__":
    image_path = "your_face_image.jpg"
    face_image = detect_face_and_skin(image_path)
    
    if face_image is not None:
        colors = extract_skin_tone(face_image)
        print("Teri rangi (asosiy 4 ta rang):", colors)
        clothes = find_matching_clothes(colors)
        print("Amazon dagi mos kiyimlar:", clothes)
