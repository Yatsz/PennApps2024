import React from 'react'
import AlertCard from './AlertCard'

export default function AlertList() {
  return (
    <div className="space-y-4">
      <AlertCard 
        camera_num={3}
        floor="Levine Floor 2"
        severity="HIGH"
        time_ago="10m ago"
      />
      <AlertCard 
        camera_num={5}
        floor="Levine Floor 3"
        severity="MEDIUM"
        time_ago="15m ago"
      />
      <AlertCard 
        camera_num={1}
        floor="Levine Floor 1"
        severity="LOW"
        time_ago="20m ago"
      />
    </div>
  )
}