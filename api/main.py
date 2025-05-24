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
    global model
    model_path = "model/carcinoma_model.h5"
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)
        print("Model loaded successfully!")
        model.summary()
    else:
        print(f"Model file not found at {model_path}")
        model = tf.keras.Sequential([
            tf.keras.layers.InputLayer(input_shape=(224, 224, 3)),
            tf.keras.layers.Conv2D(16, 3, activation='relu'),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(2, activation='softmax')
        ])
        print("Warning: Using placeholder model for testing")

class_names = ["Normal", "Carcinoma"]

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
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != "RGB":
            image = image.convert("RGB")
        image = image.resize((224, 224), Image.LANCZOS)
        image_array = np.array(image)
        if image_array.shape != (224, 224, 3):
            raise ValueError(f"Unexpected image shape: {image_array.shape}, expected (224, 224, 3)")
        image_array = image_array.astype(np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        print(f"Preprocessed image shape: {image_array.shape}")
        return image_array
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        raise

def generate_heatmap(image_array, predictions):
    try:
        model_layers = [layer.name for layer in model.layers]
        print(f"Model layers: {model_layers}")
        conv_layers = [layer.name for layer in model.layers if 'conv' in layer.name.lower()]
        if not conv_layers:
            original_img = (image_array[0] * 255).astype(np.uint8)
            confidence = np.max(predictions[0])
            heatmap = np.zeros((224, 224), dtype=np.float32)
            heatmap.fill(confidence)
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            superimposed_img = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
        else:
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
            heatmap = heatmap.numpy()
            heatmap = cv2.resize(heatmap, (224, 224))
            heatmap = np.uint8(255 * heatmap)
            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            original_img = (image_array[0] * 255).astype(np.uint8)
            superimposed_img = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
        _, buffer = cv2.imencode('.png', superimposed_img)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
        return heatmap_base64
    except Exception as e:
        print(f"Error generating heatmap: {str(e)}")
        blank_image = np.zeros((224, 224, 3), dtype=np.uint8)
        _, buffer = cv2.imencode('.png', blank_image)
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
