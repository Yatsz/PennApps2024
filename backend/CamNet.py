from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import chromadb
import torch
from transformers import CLIPProcessor, CLIPModel
import numpy as np
import time
import cv2
import os

from AICamera import AICamera



class CamNet:
    #
    def __init__(self, num_cams):
        self.num_cams = num_cams
        assert get_camera_count() >= num_cams

        self.client = chromadb.PersistentClient(path="./chroma_storage")
        existing_collections = [col.name for col in self.client.list_collections()]
        if "my_persistent_collection" in existing_collections:
            self.client.delete_collection(name="my_persistent_collection")

        self.vector_store = self.client.create_collection(name="my_persistent_collection")
        self.device = torch.device("mps") if torch.backends.mps.is_available() else torch.device("cpu")
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

        self.output_dir = "vids"
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
        for vid in os.listdir(self.output_dir):
            os.remove(os.path.join(self.output_dir, vid))

        if not os.path.exists("frames"):
            os.makedirs("frames")
        for frame in os.listdir("frames"):
            os.remove(os.path.join("frames", frame))

        self.cams = [AICamera(i, self.vector_store, self.model, self.processor, self.device) for i in range(self.num_cams)]

        # print("exiting", self.num_cams)
        # exit()

    def get_camera_count(self):
        max_tested_cameras = 10
        camera_count = 0

        for i in range(max_tested_cameras):
            try:
                cap = cv2.VideoCapture(i)
                if cap.isOpened():
                    camera_count += 1
                    cap.release()  # Release the camera
                else:
                    break  # Stop the loop if no camera is found
            except Exception as e:
                print(f"Error accessing camera {i}: {e}")
                break  # Stop checking further cameras if an error occurs
        print(f"Found {camera_count} cameras")
        return camera_count


        # cams indivisually write to threats.csv
    def thread_record_and_monitor(self):
        for cam in self.cams:
            cam.monitor()
            cam.record_webcam()
        # self.cams[0].monitor()
        # self.cams[0].record_webcam()

    def tensor_to_list(self, embedding):
        return [float(i) for i in np.array(embedding).squeeze()]

    def get_text_embedding(self, texts):
        # Preprocess the text
        inputs = self.processor(text=texts, return_tensors="pt", padding=True).to(self.device)

        # Get text embedding
        with torch.no_grad():
            text_embeddings = self.model.get_text_features(**inputs).cpu()

        return self.tensor_to_list(text_embeddings)

    def query(self, query_string, n_results=5, cams_to_search=None):
        if cams_to_search is None:
            cams_to_search = list(range(self.num_cams))

        existing_collections = [col.name for col in self.client.list_collections()]
        if "my_persistent_collection" in existing_collections:
            collection = self.client.get_collection(name="my_persistent_collection")
        else:
            print("Collection 'my_persistent_collection' not found.")
            return []

        query_embedding = self.get_text_embedding(texts=[query_string])

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            # where={"id": {"$in": cams_to_search}}
        )

        timestamps = []
        for id_list in results['ids']:
            for id_str in id_list:
                timestamp = float(id_str)
                timestamps.append(timestamp)

        return timestamps, results['documents'][0], results['metadatas'][0]
    
    def get_vid_name(self, ts, cam_num):
        vid_start_times = [
            float(vid.split(".")[0] + vid.split(".")[1]) for vid in os.listdir("./vids") if (vid.endswith(".mp4"))
            #  and vid.startswith(str(int(cam_num))))
        ]
        vid_start_times.sort()

        # Initialize variables
        video_path = None

        # Edge case: No videos available
        if not vid_start_times:
            print("No video files found in the './vids' directory.")
            return None

        # Find the video that contains the timestamp
        for i in range(len(vid_start_times) - 1):
            if vid_start_times[i] <= ts < vid_start_times[i + 1]:
                video_path = vid_start_times[i]
                if video_path is None:
                    print("No video found for the given timestamp and camera number.")
                    return None
                return video_path

        # Check if timestamp is in the last video
        if ts >= vid_start_times[-1]:
            print("VIDEO NOT DONE YEAT")
            return video_path
        else:
            print("No video found for the given timestamp and camera number.")
            return None
    
            


def get_camera_count():
    max_tested_cameras = 10
    camera_count = 0

    for i in range(max_tested_cameras):
        try:
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                camera_count += 1
                cap.release()  # Release the camera
            else:
                break  # Stop the loop if no camera is found
        except Exception as e:
            print(f"Error accessing camera {i}: {e}")
            break  # Stop checking further cameras if an error occurs
    print(f"Found {camera_count} cameras")
    return camera_count


if __name__ == "__main__":
    NUM_CAMS = 3
    # assert that there are enough cameras connected
    assert get_camera_count() >= NUM_CAMS

    cam_net = CamNet(NUM_CAMS)
    cam_net.thread_record_and_monitor()

    # cap = cam_net.cams[1].cap

    # while True:
    #     ret, frame = cap.read()
    #     cv2.imshow("frame", frame)
    #     if cv2.waitKey(1) & 0xFF == ord('q'):
    #         break



    while True:
        query = input("Enter query: ")
        if query == "exit":
            break
        print(cam_net.query(query, n_results=5))

    # print(cam_net.query("water bottle", n_results=5))
