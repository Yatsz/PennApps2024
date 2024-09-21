from PIL import Image
import requests
from transformers import CLIPProcessor, CLIPModel
import torch
import time

# Load the CLIP model and processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Function to get image embedding and probabilities
def get_embedding(image, texts=["a photo of a cat", "a photo of a dog"]):
    # Preprocess the image and texts
    inputs = processor(text=texts, images=image, return_tensors="pt", padding=True)

    # Get model outputs
    with torch.no_grad():
        outputs = model(**inputs)

    # Get image-text similarity scores
    logits_per_image = outputs.logits_per_image

    # Calculate probabilities
    probs = logits_per_image.softmax(dim=1)

    # Extract the raw image embedding (image vector)
    image_embedding = outputs.image_embeds

    return probs, image_embedding


import cv2
import numpy as np

cap = cv2.VideoCapture(0)

# get a picture from the webcam
def get_webcam_image():
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Convert the frame to RGB
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Convert the frame to PIL Image
    image = Image.fromarray(frame_rgb)

    return image



for i in range(1000):
    time.sleep(0.1)
    image = get_webcam_image()

    # classify using classes ["empty room", "college kid"]
    texts=["empty room", "regular person", "potential threat"]
    probs, image_embedding = get_embedding(get_webcam_image(), texts)
    # print the probabilities with the classes in a nice string
    print("\n".join([f"{text}: {prob:.2f}" for text, prob in zip(texts, probs[0])]))
