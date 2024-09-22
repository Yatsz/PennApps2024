import cv2
import numpy as np
from transformers import CLIPProcessor, CLIPModel
import torch
import chromadb
from PIL import Image
import time
import pandas as pd
import os
import threading

from ask_gpt import gpt

class AICamera:
    def __init__(self, camera_num, vector_store, model, processor, device):
        print(camera_num)
        self.camera_num = camera_num
        self.cap = cv2.VideoCapture(camera_num)
        self.collection = None

        self.device = device
        self.model = model
        self.processor = processor

        self.vector_store = vector_store

    # utils
    def tensor_to_list(self, embedding):
        return [float(i) for i in np.array(embedding).squeeze()]
    
    def get_webcam_image(self):
        # Capture frame-by-frame
        ret, frame = self.cap.read(self.camera_num)

        # Convert the frame to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Convert the frame to PIL Image
        image = Image.fromarray(frame_rgb)

        return image
    
    # main fns
    def get_embedding(self, image, texts):
        # Preprocess the image and texts
        inputs = self.processor(text=texts, images=image, return_tensors="pt", padding=True).to(self.device)

        # Get model outputs
        with torch.no_grad():
            outputs = self.model(**inputs)

        # Get image-text similarity scores
        logits_per_image = outputs.logits_per_image

        # Calculate probabilities
        probs = np.array(logits_per_image.softmax(dim=1).cpu()).squeeze()
        probs = [float(prob) for prob in probs]

        # Extract the raw image embedding (image vector)
        image_embedding = outputs.image_embeds.cpu()
        return self.tensor_to_list(probs), self.tensor_to_list(image_embedding)
    
    def monitor(self):
        threading.Thread(target=self.monitor_thread).start()

    def monitor_thread(self):
        camera_num = self.camera_num
        while True:
            time.sleep(1)
            # Get an image from the webcam
            image = self.get_webcam_image()

            # Get the image embedding and probabilities
            probs, image_embedding = self.get_embedding(image, texts=["a normal school scene", "violent threat"])

            print(probs)

            # convert image to numpy array
            # emb = np.array(image_embedding)
            # # remove wrapping dims
            # emb = [float(i) for i in emb.squeeze()]
            # print(type(emb))
            # Add the embeddings to the collection
            # print(np.array(image).tolist())
            self.vector_store.add(
                embeddings=[image_embedding],
                ids=[str(time.time())],
                metadatas=[{"normal": probs[0], "threat": probs[1], "camera_num": camera_num}],
                # documents=[np.array(image).tolist()]
                documents=[str(camera_num)]
            )

            if probs[1] > 0.6:
                print(f"THREAT DETECTED IN CAMERA {camera_num}")
                res = gpt("Is this person's face covered? Is this person holding something that can be used as a weapon? Answer like this ['Yes', 'No'] :", [image])
                print(res)

                try:
                    old_df = pd.read_csv("threats.csv")
                except:
                    old_df = pd.DataFrame(columns=["Timestamp", "Confidence", "GPT Response"])

                new_df = pd.DataFrame([[time.time(), probs[1], res, camera_num]], columns=["Timestamp", "Confidence", "GPT Response", "Camera Number"])
                
                old_df = old_df._append(new_df)
                old_df.to_csv("threats.csv", index=False)

    def record_webcam(self):
        threading.Thread(target=self.record_webcam_thread).start()

    def record_webcam_thread(self, show=False):
        try:
            # Create directory if it doesn't exist
            output_dir = "vids"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)            

            # Open the webcam (usually the first camera is index 0)
            cap = cv2.VideoCapture(self.camera_num)

            # Check if the webcam opened correctly
            if not cap.isOpened():
                print("Error: Could not open webcam.")
                return

            # Set frame rate and chunk settings
            fps = 25
            chunk_duration = 10  # seconds
            chunk_frames = int(chunk_duration * fps)

            # Frame dimensions
            frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            # Infinite loop to continuously record video chunks
            while True:
                start_time = int(time.time())
                video_path = os.path.join(output_dir, f'{self.camera_num}_{start_time}.mp4')
                out = cv2.VideoWriter(
                    video_path,
                    cv2.VideoWriter_fourcc(*'mp4v'),
                    fps,
                    (frame_width, frame_height)
                )

                # Loop to capture frames for the duration of the chunk
                for _ in range(chunk_frames):
                    ret, frame = cap.read()
                    if not ret:
                        print("Error: Failed to grab frame.")
                        break

                    # Write the frame to the video file
                    out.write(frame)

                    if show:
                        # Display the frame
                        cv2.imshow('Webcam', frame)

                        # Exit if 'q' is pressed
                        if cv2.waitKey(1) & 0xFF == ord('q'):
                            break
                    else:
                        # No display or key capture needed
                        pass

                out.release()

                if show:
                    # Exit if 'q' is pressed after each chunk
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break

        except KeyboardInterrupt:
            print("Recording stopped by user.")
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            pass


