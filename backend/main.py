from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import json

from CamNet import CamNet


# Initialize the camera network
NUM_CAMS = 1
net = CamNet(NUM_CAMS)
net.thread_record_and_monitor()

# Create FastAPI app
app = FastAPI()

# Add CORS middleware allowing all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Helper function to parse metadata
def parse_metadata(metadata):
    threat_level = metadata
    if threat_level > 0.8:
        return "HIGH"
    elif threat_level > 0.5:
        return "MEDIUM"
    else:
        return "LOW"
    
def parse_metadata2(metadata, gpt_res):
    if not gpt_res:
        raise ValueError("GPT Response is empty or None")
    
    try:
        gpt_res = json.loads(gpt_res.replace("'", "\""))
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format in GPT Response: {gpt_res}. Error: {e}")
    
    if gpt_res[1].lower() == "yes":
        return "EXTREME"
    
    threat_level = metadata
    if threat_level > 0.8:
        return "HIGH"
    elif threat_level > 0.5:
        return "MEDIUM"
    else:
        return "LOW"

# Request model for search query
class SearchQuery(BaseModel):
    txt_string: str

# Endpoint to get anomalies
@app.get("/anomalies")
async def get_anomalies():
    # Placeholder for logic to retrieve anomalies
    return {"message": "List of anomalies will be returned here"}

prev_threat = None

@app.get("/is_new_threat")
async def is_new_threat():
    global prev_threat
    try:
        threats = pd.read_csv("threats.csv")
    except:
        return False
    
    if len(threats) == 0:
        return False
    
    # sort by timestamp
    threats = threats.sort_values("Timestamp", ascending=False)

    # get the most recent threat
    most_recent_threat = threats.iloc[0]
    
    if prev_threat is None or most_recent_threat["Timestamp"] > prev_threat["Timestamp"]:
        prev_threat = most_recent_threat

        cam_num = most_recent_threat["Camera Number"]

        print("ID: ", str(net.get_vid_name(most_recent_threat["Timestamp"], cam_num)))

        vid_id = str(int(cam_num)) + '_' + str(net.get_vid_name(most_recent_threat["Timestamp"], cam_num))

        # convert to dictionary
        most_recent_threat = most_recent_threat.to_dict()

        severity = parse_metadata2(most_recent_threat["Confidence"], most_recent_threat["GPT Response"])
        most_recent_threat["severity"] = severity
        most_recent_threat.pop("Confidence")

        most_recent_threat["vid_id"] = vid_id

        return most_recent_threat
    

    

# Endpoint to post a search query
@app.post("/search")
async def search_text(query: SearchQuery):
    s = query.txt_string
    options = net.query(s, n_results=30)
    
    o = []
    for i in range(len(options[0])):  # Fixed to iterate over the correct list length
        o.append({
            "timestamp": options[0][i], 
            "camera_num": int(options[1][i]) + 1, 
            "severity": parse_metadata(options[2][i]['threat']), 
            "video_id": str(options[1][i]) + str(options[0][i])
        })

    return o

# Command to run the FastAPI app
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
