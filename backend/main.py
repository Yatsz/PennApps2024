from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

from CamNet import CamNet
NUM_CAMS = 3
net = CamNet(NUM_CAMS)
net.thread_record_and_monitor()


app = FastAPI()
# Request model for search query
class SearchQuery(BaseModel):
    txt_string: str

# Endpoint to get anomalies
@app.get("/anomalies")
async def get_anomalies():
    # Placeholder for logic to retrieve anomalies
    return {"message": "List of anomalies will be returned here"}

# Endpoint to post a search query

def parse_metadata(metadata):
    threat_level = metadata['threat']
    if threat_level > 0.8:
        return "High"
    elif threat_level > 0.5:
        return "Medium"
    else:
        return "Low"
    
@app.post("/search")
async def search_text(query: SearchQuery):
    s = query.txt_string
    options = net.query(s, n_results=10)
    # options = ([1726966105, 1726966103, 1726966104, 1726966101, 1726966101], ['1', '1', '1', '1', '2'], [{'camera_num': 1, 'normal': 0.6898310780525208, 'threat': 0.31016889214515686}, {'camera_num': 1, 'normal': 0.4183826744556427, 'threat': 0.5816173553466797}, {'camera_num': 1, 'normal': 0.636824369430542, 'threat': 0.363175630569458}, {'camera_num': 1, 'normal': 0.6965492963790894, 'threat': 0.30345073342323303}, {'camera_num': 2, 'normal': 0.9212072491645813, 'threat': 0.07879272848367691}])
    o = []
    for i in range(len(options)):
        o.append({"timestamp": options[0][i], "camera_num": int(options[1][i]), "severity": parse_metadata(options[2][i]), "video_id": str(options[1][i]) + str(options[0][i])})

    return o

# To run the server, use: uvicorn filename:app --reload
# For example, uvicorn main:app --reload