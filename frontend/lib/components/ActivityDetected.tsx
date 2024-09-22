import { useState } from 'react'
import { Camera } from 'lucide-react'

export default function ActivityDetected() {
  const [floor, setFloor] = useState('Levine Floor 2')

  const handleViewNow = () => {
    console.log('View Now button clicked')
  }

  return (
    <div className="w-[1127px] h-[525px] bg-white p-6 flex flex-col items-center justify-between">
      <div className="flex flex-col items-center">
        <div className="w-[146px] h-[130px] bg-gray-200 flex items-center justify-center mb-4">
          <span className="text-gray-500">SVG Placeholder</span>
        </div>
        <h2 className="text-4xl font-bold">
          <span className="opacity-50">Activity detected on </span>
          <span>{floor}</span>
        </h2>
      </div>
      
      <div className="flex space-x-4">
        <div className="w-[85px] h-[44px] border-2 border-black border-opacity-50 rounded-sm flex items-center justify-center space-x-2">
          <Camera className="w-[28px] h-[25px]" />
          <span className="text-3xl opacity-50">3</span>
        </div>
        <div className="w-[85px] h-[44px] bg-[#FFD4D4] border-[2.5px] border-[#FF1313] rounded-sm flex items-center justify-center">
          <span className="text-[#FF1313] text-3xl">HIGH</span>
        </div>
      </div>
      
      <button
        onClick={handleViewNow}
        className="w-[1052px] h-[58px] bg-[#134DAB] text-white rounded-sm text-xl font-semibold"
      >
        View Now
      </button>
    </div>
  )
}