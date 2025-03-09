import requests
import os

# Amazon API kalitlari (bularni o'zingizning API kalitlaringiz bilan almashtiring)
AMAZON_ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
AMAZON_SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
AMAZON_ASSOCIATE_TAG = os.getenv("AMAZON_ASSOCIATE_TAG")
AMAZON_API_URL = "https://api.amazon.com/product/search"

def search_amazon_products(face_shape, skin_tones):
    """
    Yuz shakli va teri rangiga mos keladigan kiyimlarni Amazon'dan topish.
    """
    if not AMAZON_ACCESS_KEY or not AMAZON_SECRET_KEY:
        return {"error": "Amazon API kalitlari topilmadi"}

    # Mos keladigan kiyimlarni topish uchun so‘zlarni yaratamiz
    shape_keywords = {
        "Oval": "slim fit clothing",
        "Round": "V-neck shirt",
        "Square": "loose fit clothing",
        "Rectangle": "layered outfit"
    }
    
    color_keywords = [f"{r},{g},{b}" for (r, g, b) in skin_tones]

    query = f"{shape_keywords.get(face_shape, 'casual wear')} {color_keywords[0]} outfit"

    params = {
        "keywords": query,
        "searchIndex": "Fashion",
        "itemCount": 5,  # Top 5 ta mahsulotni olish
        "accessKey": AMAZON_ACCESS_KEY,
        "secretKey": AMAZON_SECRET_KEY,
        "associateTag": AMAZON_ASSOCIATE_TAG
    }

    response = requests.get(AMAZON_API_URL, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Amazon API bilan bog‘lanishda xatolik yuz berdi"}

