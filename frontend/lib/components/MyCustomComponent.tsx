'use client'

import React from "react";
import { useMap, Label } from "@mappedin/react-sdk";

export default function MyCustomComponent() {
  const { mapData } = useMap();
  
  if (!mapData) return null;

  return (
    <>
      {mapData.getByType("space").map((space) => (
        <Label key={space.id} target={space.center} text={space.name} />
      ))}
    </>
  );
}