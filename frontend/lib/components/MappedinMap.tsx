"use client";

import React, { useEffect, useRef } from 'react';
import { getMapData, show3dMap } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";

const MappedinMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      key: process.env.NEXT_PUBLIC_MAPPEDIN_KEY,
      secret: process.env.MAPPEDIN_SECRET,
      mapId: process.env.NEXT_PUBLIC_MAPPEDIN_MAP_ID
    };

    const initMap = async () => {
      if (mapContainerRef.current) {
        const mapData = await getMapData(options);
        await show3dMap(mapContainerRef.current, mapData);
      }
    };

    initMap();
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MappedinMap;