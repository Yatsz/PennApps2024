# import the InferencePipeline interface
from inference import InferencePipeline
# import a built-in sink called render_boxes (sinks are the logic that happens after inference)
from inference.core.interfaces.stream.sinks import render_boxes

api_key = "yGqtE1WRJtnagxj3upLu"

# create an inference pipeline object
pipeline = InferencePipeline.init(
    model_id="threat-detection-final/1", # set the model id to a yolov8x model with in put size 1280
    video_reference= 0,
    on_prediction=render_boxes, # tell the pipeline object what to do with each set of inference by passing a function
    api_key=api_key, # provide your roboflow api key for loading models from the roboflow api
)
# start the pipeline
pipeline.start()
# wait for the pipeline to finish
pipeline.join()