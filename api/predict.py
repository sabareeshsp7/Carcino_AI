# backend/api/predict.py

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO
from PIL import Image

app = FastAPI()
model = load_model("model.h5")  # ensure model input shape is (224, 224, 3)

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(BytesIO(contents)).convert("RGB")
        img = img.resize((224, 224))  # resize to model input
        img_array = image.img_to_array(img) / 255.0  # normalize
        img_array = np.expand_dims(img_array, axis=0)  # shape: (1, 224, 224, 3)

        # Predict
        predictions = model.predict(img_array)  # no flattening
        prediction_index = np.argmax(predictions[0])
        prediction_confidence = float(np.max(predictions[0]))

        class_names = ["Benign", "Carcinoma"]
        class_probabilities = {class_names[i]: float(prob) for i, prob in enumerate(predictions[0])}

        # Optional: generate dummy heatmap if applicable
        heatmap_image = ""  # base64 image string of heatmap if generated

        return {
            "prediction": class_names[prediction_index],
            "confidence": prediction_confidence,
            "class_probabilities": class_probabilities,
            "heatmap_image": heatmap_image
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
