from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from CamNet import CamNet

# Initialize the camera network
NUM_CAMS = 3
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

# Request model for search query
class SearchQuery(BaseModel):
    txt_string: str

# Endpoint to get anomalies
@app.get("/anomalies")
async def get_anomalies():
    # Placeholder for logic to retrieve anomalies
    return {"message": "List of anomalies will be returned here"}

# Helper function to parse metadata
def parse_metadata(metadata):
    threat_level = metadata['threat']
    if threat_level > 0.8:
        return "High"
    elif threat_level > 0.5:
        return "Medium"
    else:
        return "Low"

# Endpoint to post a search query
@app.post("/search")
async def search_text(query: SearchQuery):
    s = query.txt_string
    options = net.query(s, n_results=10)
    
    o = []
    for i in range(len(options[0])):  # Fixed to iterate over the correct list length
        o.append({
            "timestamp": options[0][i], 
            "camera_num": int(options[1][i]), 
            "severity": parse_metadata(options[2][i]), 
            "video_id": str(options[1][i]) + str(options[0][i])
        })

    return o

# Command to run the FastAPI app
# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
