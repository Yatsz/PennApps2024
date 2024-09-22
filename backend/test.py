import cv2
import os
import time
import threading

# Event to signal all threads to stop recording
stop_event = threading.Event()

# Lock for printing to avoid jumbled output
print_lock = threading.Lock()

def safe_print(*args, **kwargs):
    with print_lock:
        print(*args, **kwargs)

# Function to record from a single camera
def record_webcam(cameraIndex, output_dir="vids"):
    # Create directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Open the webcam (specified camera index)
    cap = cv2.VideoCapture(cameraIndex)

    # Check if the webcam opened correctly
    if not cap.isOpened():
        safe_print(f"Error: Could not open webcam {cameraIndex}.")
        return

    # Get the frame rate of the webcam
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0 or fps != fps:  # Check for 0 or NaN
        fps = 30  # Fallback if FPS is not correctly retrieved

    # Set the duration for each video chunk (30 seconds)
    chunk_duration = 30  # seconds
    chunk_frames = int(chunk_duration * fps)  # Number of frames per chunk

    # Frame width and height
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Define the codec once
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    # Infinite loop to continuously record video chunks
    while not stop_event.is_set():
        # Get the start time of this chunk (UNIX timestamp)
        start_time = int(time.time())

        # Define the video path
        video_path = os.path.join(output_dir, f'camera{cameraIndex}_{start_time}.mp4')
        out = cv2.VideoWriter(video_path, fourcc, fps, (frame_width, frame_height))

        safe_print(f"Started recording on camera {cameraIndex}: {video_path}")

        # Capture frames for the duration of the chunk
        frame_count = 0
        while frame_count < chunk_frames and not stop_event.is_set():
            ret, frame = cap.read()
            if not ret:
                safe_print(f"Error: Failed to grab frame from camera {cameraIndex}.")
                break

            # Write the frame to the video file
            out.write(frame)

            # Display the frame (optional)
            # cv2.imshow(f'Webcam {cameraIndex}', frame)

            frame_count += 1

            # Use a small delay to make `cv2.waitKey` responsive
            if cv2.waitKey(1) & 0xFF == ord('q'):
                stop_event.set()
                safe_print("Stop signal received from user.")
                break

        # Release the current chunk file after recording
        out.release()
        safe_print(f"Finished recording on camera {cameraIndex}: {video_path}")

    # Release the camera and close the window
    cap.release()
    cv2.destroyWindow(f'Webcam {cameraIndex}')
    safe_print(f"Stopped recording on camera {cameraIndex}.")

# Function to run multiple webcams simultaneously
def run_multiple_cameras(camera_indices=[0, 1], output_dir="vids"):
    threads = []

    # Create and start a thread for each camera
    for idx in camera_indices:
        thread = threading.Thread(target=record_webcam, args=(idx, output_dir))
        thread.start()
        threads.append(thread)
        safe_print(f"Thread started for camera {idx}.")

    try:
        while any(thread.is_alive() for thread in threads):
            time.sleep(1)
    except KeyboardInterrupt:
        safe_print("Keyboard Interrupt detected. Stopping all camera recordings.")
        stop_event.set()

    # Wait for all threads to finish
    for thread in threads:
        thread.join()

    safe_print("All camera recordings have been stopped.")

if __name__ == "__main__":
    run_multiple_cameras()