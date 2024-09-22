import cv2
import numpy as np
import time
import faiss
import pinecone
from roboflow import Roboflow
from fastapi import FastAPI
from pathlib import Path


def record_and_chunk_video(chunk_duration=5):


    cap = cv2.VideoCapture(-1)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    out = None
    start_time = time.time()

    while cap.isOpened():
        ret, frame = cap.read()
        if ret:
            current_time = time.time()
            if out is None or (current_time - start_time) > chunk_duration:
                if out:
                    out.release()
                timestamp = int(current_time)
                out = cv2.VideoWriter(f'video_{timestamp}.avi', 
                                      cv2.VideoWriter_fourcc('M','J','P','G'), 
                                      10, (frame_width, frame_height))
                start_time = current_time
            out.write(frame)
            cv2.imshow('Camera Stream', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            break

    cap.release()
    if out is not None:
        out.release()
    cv2.destroyAllWindows()


record_and_chunk_video()
