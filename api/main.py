from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import cv2
import io
import base64
from PIL import Image
import uvicorn
import os
from typing import Dict, Any, List

app = FastAPI(title="Carcino AI API", description="API for carcinoma cell detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-production-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

def load_model():
    global model, expected_input_shape
    model_path = "model/carcinoma_model.h5"
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)
        print("Model loaded successfully!")
        model.summary()
        expected_input_shape = model.input_shape[1:3]  # (height, width)
    else:
        expected_input_shape = (224, 224)
        model = tf.keras.Sequential([
            tf.keras.layers.InputLayer(input_shape=(224, 224, 3)),
            tf.keras.layers.Conv2D(16, 3, activation='relu'),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(2, activation='softmax')
        ])
        print("Warning: Using placeholder model for testing")

class_names = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]

class_details = {
    "akiec": {"name": "Actinic Keratoses", "risk": "High", "emoji": "🚫", "info": "Precancerous; can become squamous cell carcinoma.", "action": "Consult a dermatologist soon."},
    "bcc":   {"name": "Basal Cell Carcinoma", "risk": "High", "emoji": "⚠️", "info": "Common skin cancer; requires medical treatment.", "action": "Seek medical advice."},
    "bkl":   {"name": "Benign Keratosis", "risk": "Low", "emoji": "✅", "info": "Non-cancerous growth; often harmless.", "action": "Monitor if changes occur."},
    "df":    {"name": "Dermatofibroma", "risk": "Low", "emoji": "🌿", "info": "Benign skin lesion; usually not serious.", "action": "No urgent action needed."},
    "mel":   {"name": "Melanoma", "risk": "Very High", "emoji": "🚑", "info": "Most dangerous form of skin cancer.", "action": "Immediate medical consultation required."},
    "nv":    {"name": "Melanocytic Nevus", "risk": "Low", "emoji": "💚", "info": "Common mole; generally benign.", "action": "Routine monitoring is fine."},
    "vasc":  {"name": "Vascular Lesion", "risk": "Medium", "emoji": "🩸", "info": "Blood vessel-related lesion; usually harmless.", "action": "Dermatologist check-up recommended."},
}

class PredictionResult(BaseModel):
    prediction: str
    confidence: float
    class_probabilities: Dict[str, float]
    heatmap_image: str

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"message": "Carcino AI API is running", "status": "healthy"}

def preprocess_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # ✅ Match training input size
        expected_input_size = (64, 64)
        image = image.resize(expected_input_size, Image.LANCZOS)

        image_array = np.array(image)
        if image_array.shape != (64, 64, 3):
            raise ValueError(f"Unexpected image shape after resizing: {image_array.shape}")

        image_array = image_array.astype(np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        print(f"Preprocessed image shape: {image_array.shape}")
        return image_array
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        raise


def generate_heatmap(image_array, predictions):
    try:
        conv_layers = [layer.name for layer in model.layers if 'conv' in layer.name.lower()]
        if not conv_layers:
            raise Exception("No convolutional layers found for heatmap.")

        last_conv_layer = conv_layers[-1]
        grad_model = tf.keras.models.Model(
            inputs=[model.inputs],
            outputs=[model.output, model.get_layer(last_conv_layer).output]
        )

        with tf.GradientTape() as tape:
            preds, conv_outputs = grad_model(image_array)
            top_pred_index = tf.argmax(preds[0])
            top_class_channel = preds[:, top_pred_index]

        grads = tape.gradient(top_class_channel, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)

        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        heatmap = cv2.resize(heatmap.numpy(), (64, 64))  # match input shape
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        original_img = (image_array[0] * 255).astype(np.uint8)
        superimposed_img = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
        _, buffer = cv2.imencode('.png', superimposed_img)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
        return heatmap_base64

    except Exception as e:
        print(f"[Heatmap] {str(e)}")
        blank = np.zeros((64, 64, 3), dtype=np.uint8)
        _, buffer = cv2.imencode('.png', blank)
        return base64.b64encode(buffer).decode('utf-8')


@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    valid_extensions = ['.jpg', '.jpeg', '.png']
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in valid_extensions:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Supported types: {', '.join(valid_extensions)}")
    contents = await file.read()
    try:
        image_array = preprocess_image(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    try:
        print(f"Input shape before prediction: {image_array.shape}")
        predictions = model.predict(image_array)
        print(f"Prediction output shape: {predictions.shape}")
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index])
        class_probs = {class_names[i]: float(predictions[0][i]) for i in range(len(class_names))}
        heatmap_base64 = generate_heatmap(image_array, predictions)
        return {
            "prediction": predicted_class,
            "confidence": confidence,
            "class_probabilities": class_probs,
            "heatmap_image": heatmap_base64
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during prediction. Please check the model input or model structure.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
