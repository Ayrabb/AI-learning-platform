from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}})

# API Keys and Configuration
YOUTUBE_API_KEY = "AIzaSyCvWGCKf1MSpBwdIndMNh2kyCk4aAfmaMI"
GOOGLE_CUSTOM_SEARCH_API_KEY = "AIzaSyCV5_9wI9EjuFvUVRSg0_V13dsiLp2GJ_Y"
GOOGLE_CUSTOM_SEARCH_ENGINE_ID = "d6d97114dca8345f7"
UNSPLASH_ACCESS_KEY = "-Gc3nNsvL0SQDW6E1kI6JEZwI4NdUeshL4xT6C6ya1M"

@app.route('/generate-lesson', methods=['POST'])
def generate_lesson():
    data = request.json
    topic = data.get("topic", "Default Topic")

    # Wikipedia
    wikipedia_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{topic}"
    try:
        wiki_response = requests.get(wikipedia_url)
        wiki_response.raise_for_status()
        wiki_data = wiki_response.json()
        lesson_text = wiki_data.get("extract", "No text content available for this topic.")
    except requests.exceptions.RequestException as e:
        lesson_text = f"Error fetching data from Wikipedia: {str(e)}"

    # Google Snippets
    google_search_url = "https://www.googleapis.com/customsearch/v1"
    google_params = {
        "key": GOOGLE_CUSTOM_SEARCH_API_KEY,
        "cx": GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
        "q": topic,
        "num": 3
    }
    try:
        google_response = requests.get(google_search_url, params=google_params)
        google_response.raise_for_status()
        google_data = google_response.json()
        google_snippets = [item.get("snippet", "No snippet available") for item in google_data.get("items", [])]
    except requests.exceptions.RequestException as e:
        google_snippets = [f"Error fetching data from Google Custom Search: {str(e)}"]

    # Unsplash Images
    unsplash_url = "https://api.unsplash.com/search/photos"
    unsplash_params = {
        "query": topic,
        "client_id": UNSPLASH_ACCESS_KEY,
        "per_page": 3
    }
    try:
        unsplash_response = requests.get(unsplash_url, params=unsplash_params)
        unsplash_response.raise_for_status()
        unsplash_data = unsplash_response.json()
        image_urls = [item["urls"]["regular"] for item in unsplash_data.get("results", [])]
    except requests.exceptions.RequestException as e:
        image_urls = [f"Error fetching images from Unsplash: {str(e)}"]

    # YouTube Videos
