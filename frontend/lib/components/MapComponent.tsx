import React, { useRef, useCallback, useEffect } from "react";
import { MapView, useMapData, useMap, Label, useEvent } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import { useAlert } from '../context/AlertContext';
import SurveillanceVideo from './Surveillance';

function MapContent() {
  const { mapView, mapData } = useMap();
  const { selectedAlert, clearSelectedAlert } = useAlert();
  const surveillanceRef = useRef<HTMLDivElement>(null);

  const handleMapClick = useCallback((event: any) => {
    const { labels } = event;
    if (labels.length > 0) {
      const clickedLabel = labels[0];
      console.log("Clicked label:", clickedLabel);
      
      const poi = mapData.getByType("point-of-interest").find(p => p.name === clickedLabel.text);
      console.log("Found POI:", poi);
     
      if (poi) {
        mapView.Camera.focusOn(poi, {
          maxZoomLevel: 22,
          duration: 1000,
          easing: "ease-in-out"
        });
      }
    } else if (selectedAlert && !surveillanceRef.current?.contains(event.target)) {
      clearSelectedAlert();
    }
  }, [mapView, mapData, selectedAlert, clearSelectedAlert]);

  useEvent("click", handleMapClick);

  useEffect(() => {
    if (selectedAlert && mapData && mapView) {
      const cameraName = `Cam${selectedAlert.camera_num}`;
      const cameraPOI = mapData.getByType("point-of-interest").find(p => p.name === cameraName);
      
      if (cameraPOI) {
        console.log(`Focusing on ${cameraName}`);
        mapView.Camera.focusOn(cameraPOI, {
          maxZoomLevel: 22,
          duration: 1000,
          easing: "ease-in-out"
        });
      } else {
        console.log(`POI for ${cameraName} not found`);
      }
    }
  }, [selectedAlert, mapData, mapView]);

  if (!mapData) return null;

  return (
    <>
      {mapData.getByType("space").map((space, idx) => (
        <Label
          key={`space-${idx}`}
          target={space.center}
          text={space.name}
          options={{
            interactive: true,
            appearance: {
              marker: {
                foregroundColor: {
                  active: "green",
                  inactive: "green",
                },
              },
              text: {
                foregroundColor: "green",
              },
            },
          }}
        />
      ))}
      {mapData.getByType("point-of-interest").map((poi, idx) => (
        <Label
          key={`poi-${idx}`}
          target={poi.coordinate}
          text={poi.name}
          options={{
            interactive: true,
            appearance: {
              marker: {
                foregroundColor: {
                  active: "dodgerblue",
                  inactive: "dodgerblue",
                },
              },
              text: {
                foregroundColor: "dodgerblue",
              },
            },
          }}
        />
      ))}
      {selectedAlert && (
        <div 
          ref={surveillanceRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-[107%] -translate-y-[49%] z-10 surveillance-container"
        >
          <SurveillanceVideo
            floor={selectedAlert.floor}
            camNum={selectedAlert.camera_num}
            severity={selectedAlert.severity}
            videoUrl="/banana.mp4" // Replace with actual video URL
          />
        </div>
      )}
    </>
  );
}

export default function MapComponent() {
  const { isLoading, error, mapData } = useMapData({
    key: process.env.NEXT_PUBLIC_MAPPEDIN_KEY,
    secret: process.env.NEXT_PUBLIC_MAPPEDIN_SECRET,
    mapId: process.env.NEXT_PUBLIC_MAPPEDIN_MAP_ID,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return mapData ? (
    <div className="relative w-full h-full">
      <MapView mapData={mapData}>
        <MapContent />
      </MapView>
    </div>
  ) : null;
}