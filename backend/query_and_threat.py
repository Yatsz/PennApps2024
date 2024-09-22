import chromadb
from PIL import Image
import time
import os
import cv2
import pandas as pd

from embeddings import get_embedding, get_text_embedding
from ask_gpt import gpt

import json

# /vids has videos titled as the Unix timestamp of the start of the video

def get_threat_timestamps(threshold=0.8):
    client = chromadb.PersistentClient(path="./chroma_storage")
    existing_collections = [col.name for col in client.list_collections()]
    
    if "my_persistent_collection" in existing_collections:
        collection = client.get_collection(name="my_persistent_collection")
    else:
        print("Collection 'my_persistent_collection' not found.")
        return []

    # Get all documents and metadatas
    results = collection.get(include=["metadatas", "documents"])
    threat_timestamps = []
    for idx, metadata in zip(results['documents'], results['metadatas']):
        if metadata['threat'] > threshold:
            timestamp = int(float(idx))
            threat_confidence = metadata['threat']
            threat_timestamps.append((timestamp, threat_confidence))
    return threat_timestamps


def query(query_string, n_results=5):
    client = chromadb.PersistentClient(path="./chroma_storage")
    existing_collections = [col.name for col in client.list_collections()]
    
    if "my_persistent_collection" in existing_collections:
        collection = client.get_collection(name="my_persistent_collection")
    else:
        print("Collection 'my_persistent_collection' not found.")
        return []

    # Perform the query
    query_embedding = get_text_embedding(texts=[query_string])
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    # Extract the timestamps from the results
    timestamps = []
    for id_list in results['documents']:
        for id_str in id_list:
            timestamp = int(float(id_str))
            timestamps.append(timestamp)
    return timestamps

def play_timestamp(ts):
    # Get the list of video start times
    vid_start_times = [int(vid.split(".")[0]) for vid in os.listdir("./vids") if vid.endswith(".mp4")]
    vid_start_times.sort()
    video_path = None
    vid_start_time = None

    # Find the video that contains the timestamp
    for i in range(len(vid_start_times) - 1):
        if ts >= vid_start_times[i] and ts < vid_start_times[i + 1]:
            vid_start_time = vid_start_times[i]
            video_path = f"./vids/{vid_start_times[i]}.mp4"
            break

    if video_path is None:
        # Check if timestamp is after the last video start time
        if ts >= vid_start_times[-1]:
            vid_start_time = vid_start_times[-1]
            video_path = f"./vids/{vid_start_times[-1]}.mp4"
        else:
            print("No video found for the given timestamp.")
            return

    print(f"Playing video: {video_path}")
    # Calculate the offset in seconds
    offset_seconds = ts - vid_start_time
    # Play the video
    cap = cv2.VideoCapture(video_path)
    # Get frames per second
    fps = cap.get(cv2.CAP_PROP_FPS)
    # Calculate frame number
    frame_number = int(offset_seconds * fps)
    # Set the frame position
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        cv2.imshow("Video", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


def get_frame_at_timestamp(ts):
    vid_start_times = [
        int(vid.split(".")[0]) for vid in os.listdir("./vids") if vid.endswith(".mp4")
    ]
    vid_start_times.sort()

    video_path = None
    vid_start_time = None

    if not vid_start_times:
        print("No video files found in the './vids' directory.")
        return None

    for i in range(len(vid_start_times) - 1):
        if vid_start_times[i] <= ts < vid_start_times[i + 1]:
            vid_start_time = vid_start_times[i]
            video_path = f"./vids/{vid_start_times[i]}.mp4"
            break

    if video_path is None:
        if ts >= vid_start_times[-1]:
            vid_start_time = vid_start_times[-1]
            video_path = f"./vids/{vid_start_times[-1]}.mp4"
        else:
            print("No video found for the given timestamp.")
            return None

    offset_seconds = ts - vid_start_time

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Failed to open video file: {video_path}")
        return None

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = total_frames / fps

    if offset_seconds > video_duration:
        print("Timestamp exceeds video duration.")
        cap.release()
        return None

    frame_number = int(offset_seconds * fps)
    if frame_number >= total_frames:
        frame_number = total_frames - 1

    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

    ret, frame = cap.read()
    cap.release()
    if not ret:
        print("Failed to read frame.")
        return None

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(frame_rgb)

    return pil_image


def get_video_path(ts):
    # Get the list of video start times from filenames in './vids' directory
    vid_start_times = [
        int(vid.split(".")[0]) for vid in os.listdir("./vids") if vid.endswith(".mp4")
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
            video_path = f"./vids/{vid_start_times[i]}.mp4"
            return video_path

    # Check if timestamp is in the last video
    if ts >= vid_start_times[-1]:
        video_path = f"./vids/{vid_start_times[-1]}.mp4"
        return video_path
    else:
        print("No video found for the given timestamp.")
        return None



        
if __name__ == "__main__":

    threat_timestamps = get_threat_timestamps()
    print("Threat Timestamps:", threat_timestamps)


    query_string = "smiling person"
    relevant_timestamps = query(query_string)
    print(f"Top {len(relevant_timestamps)} timestamps for query '{query_string}':", relevant_timestamps)

    if len(threat_timestamps) > 0:
        threats_df = pd.DataFrame(threat_timestamps, columns=["Timestamp", "Confidence"])
        # write to threats.csv
        threats_df.to_csv("threats.csv", index=False)

        print(f'Number of threat timestamps: {len(threat_timestamps)}')
        print("Playing the first threat video, confidence:", threat_timestamps[0][1])
        play_timestamp(threat_timestamps[0][0])


    if len(relevant_timestamps) > 0:
        print("Playing the first relevant video:")
        play_timestamp(relevant_timestamps[0])
