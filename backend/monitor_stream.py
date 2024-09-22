import chromadb
from PIL import Image
import time
import pandas as pd

from embeddings import get_embedding, get_text_embedding
from ask_gpt import gpt

# Initialize the persistent client, specifying a folder path for storage
client = chromadb.PersistentClient(path="./chroma_storage")

# Check if the collection exists in client.list_collections()
existing_collections = [col.name for col in client.list_collections()]

# Create or get a collection (stored on disk now)
if "my_persistent_collection" in existing_collections:
    client.delete_collection(name="my_persistent_collection")

collection = client.create_collection(name="my_persistent_collection")


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

def parse_embedding(embedding):
    return [float(i) for i in np.array(embedding).squeeze()]


def monitor(camera_num = 0):
    while True:
        time.sleep(1)
        # Get an image from the webcam
        image = get_webcam_image()

        # Get the image embedding and probabilities
        probs, image_embedding = get_embedding(image, texts=["a normal school scene", "violent threat"])

        print(probs)

        # convert image to numpy array
        # emb = np.array(image_embedding)
        # # remove wrapping dims
        # emb = [float(i) for i in emb.squeeze()]
        # print(type(emb))
        # Add the embeddings to the collection
        # print(np.array(image).tolist())
        collection.add(
            embeddings=[image_embedding],
            ids=[str(time.time())],
            metadatas=[{"normal": probs[0], "threat": probs[1], "camera_num": camera_num}],
            # documents=[np.array(image).tolist()]
            documents=[str(time.time())]
        )

        if probs[1] > 0.8:
            print("THREAT DETECTED")
            res = gpt("Is this person's face covered? Is this person holding something that can be used as a weapon? Answer like this ['Yes', 'No'] :", [image])
            print(res)

            try:
                old_df = pd.read_csv("threats.csv")
            except:
                old_df = pd.DataFrame(columns=["Timestamp", "Confidence", "GPT Response"])

            new_df = pd.DataFrame([[time.time(), probs[1], res, camera_num]], columns=["Timestamp", "Confidence", "GPT Response", "Camera Number"])
            
            old_df = old_df._append(new_df)
            old_df.to_csv("threats.csv", index=False)

        
if __name__ == "__main__":
    monitor()

            

    # old_df = pd.read_csv("threats.csv")




# Query the collection (data is stored on disk)
# results = collection.query(
#     query_embeddings=[get_text_embedding(texts=["threatening face"])],
#     n_results=2
# )

# show the image document from the result
# print(results) 
# for result in results:
#     # Image(result[0]).show()
#     print(result)