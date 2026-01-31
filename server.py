from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)

# =========================================
# Load Model
# =========================================
MODEL_PATH = r"D:\Harsali proj\plant_disease_model_tf19.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# IMPORTANT: Number of classes must match training
CLASS_NAMES = [
    "Apple___Black_rot",
    "Apple___Healthy",
    "Corn___Common_rust",
    "Corn___Healthy",
    "Grape___Leaf_blight",
    "Grape___Healthy",
    "Peach___Bacterial_spot",
    "Peach___Healthy",
    "Pepper___Bacterial_spot",
    "Pepper___Healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Healthy"
]

IMG_SIZE = (224, 224)

# =========================================
# Preprocessing Function
# =========================================
def preprocess(img):
    img = img.resize(IMG_SIZE)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# =========================================
# Prediction API
# =========================================
@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    img = Image.open(file).convert("RGB")

    processed = preprocess(img)
    preds = model.predict(processed)

    idx = np.argmax(preds)
    confidence = float(np.max(preds))

    return jsonify({
        "prediction": CLASS_NAMES[idx],
        "confidence": round(confidence, 4)
    })

# =========================================
# Run Server
# =========================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
