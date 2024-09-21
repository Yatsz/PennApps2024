import cv2
import time
import os

def record_webcam():
    # Create directory if it doesn't exist
    output_dir = "vids"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Open the webcam (usually the first camera is index 0)
    cap = cv2.VideoCapture(0)

    # Check if the webcam opened correctly
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    # Get the frame rate of the webcam
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    if fps == 0:  # Fallback if FPS is not correctly retrieved
        fps = 30

    # Set the duration for each video chunk (30 seconds)
    chunk_duration = 30  # seconds
    chunk_frames = chunk_duration * fps  # Number of frames per chunk

    # Frame width and height
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Infinite loop to continuously record video chunks
    while True:
        # Get the start time of this chunk (UNIX timestamp)
        start_time = int(time.time())

        # Define the codec and create a VideoWriter object to save the video
        video_path = os.path.join(output_dir, f'{start_time}.mp4')
        out = cv2.VideoWriter(video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (frame_width, frame_height))

        # Loop to capture frames for the duration of the chunk
        for _ in range(chunk_frames):
            ret, frame = cap.read()
            if not ret:
                print("Error: Failed to grab frame.")
                break

            # Write the frame to the video file
            out.write(frame)

            # Display the frame (optional)
            cv2.imshow('Webcam', frame)

            # Exit if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        # Release the current chunk file after 30 seconds of recording
        out.release()

        # Exit if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close any OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    record_webcam()
