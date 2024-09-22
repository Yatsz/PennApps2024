from PIL import Image
import requests
from transformers import CLIPProcessor, CLIPModel
import torch
import time
import numpy as np

# Check if MPS is available, otherwise default to CPU
device = torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")

# Load the CLIP model and processor, then move the model to the appropriate device
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")


def tensor_to_list(embedding):
    return [float(i) for i in np.array(embedding).squeeze()]


# Function to get image embedding and probabilities
def get_embedding(image, texts):
    # Preprocess the image and texts
    inputs = processor(text=texts, images=image, return_tensors="pt", padding=True).to(device)

    # Get model outputs
    with torch.no_grad():
        outputs = model(**inputs)

    # Get image-text similarity scores
    logits_per_image = outputs.logits_per_image

    # Calculate probabilities
    probs = np.array(logits_per_image.softmax(dim=1).cpu()).squeeze()
    probs = [float(prob) for prob in probs]

    # Extract the raw image embedding (image vector)
    image_embedding = outputs.image_embeds.cpu()

    return tensor_to_list(probs), tensor_to_list(image_embedding)


# Function to get the text embedding
def get_text_embedding(texts):
    # Preprocess the text
    inputs = processor(text=texts, return_tensors="pt", padding=True).to(device)

    # Get text embedding
    with torch.no_grad():
        text_embeddings = model.get_text_features(**inputs).cpu()

    return tensor_to_list(text_embeddings)