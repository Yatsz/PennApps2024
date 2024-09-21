'use client'

import React, { useState } from "react";
import { MapView, useMapData, useMap, Label, useEvent } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";

interface CustomLabel {
  target: any; // Using 'any' for simplicity, ideally this should be properly typed
  text: string;
}

function MapContent() {
  const { mapView, mapData } = useMap();
  const [clickLabels, setClickLabels] = useState<CustomLabel[]>([]);

  useEvent("click", (event) => {
    setClickLabels((prevLabels) => [
      ...prevLabels,
    ]);
  });

  useEvent("hover", (event) => {
    console.log("hover", event);
  });

  useEvent("camera-change", (event) => {
    console.log(
      "camera-change",
      event.bearing,
      event.pitch,
      event.zoomLevel,
      event.center
    );
  });

  useEvent("floor-change", (event) => {
    console.log("floor-change", event.floor, event.reason);
  });

  return (
    <>
      {mapData.getByType("space").map((space) => (
        <Label key={space.id} target={space.center} text={space.name} />
      ))}
      {clickLabels.map((label, idx) => (
        <Label key={`click-${idx}`} {...label} />
      ))}
    </>
  );
}

export default function MapComponent() {
  // See Demo API key Terms and Conditions
  // https://developer.mappedin.com/v6/demo-keys-and-maps/
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
    <MapView mapData={mapData}>
      <MapContent />
    </MapView>
  ) : null;
}