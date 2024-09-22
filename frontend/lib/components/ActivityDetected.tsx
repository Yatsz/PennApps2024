import React from 'react';
import { Camera } from 'lucide-react';
import { useThreat } from '@/lib/context/ThreatContext';
import { useAlert } from '@/lib/context/AlertContext';

type Severity = 'HIGH' | 'MEDIUM' | 'LOW' | 'EXTREME';

const severityMap: { [key in Severity]: { bgColor: string; borderColor: string; textColor: string } } = {
  HIGH: { bgColor: 'bg-[#FFD4D4]', borderColor: 'border-[#FF1313]', textColor: 'text-[#FF1313]' },
  MEDIUM: { bgColor: 'bg-[#FFDFC4]', borderColor: 'border-[#FF8C00]', textColor: 'text-[#FF8C00]' },
  LOW: { bgColor: 'bg-[#FFFBD9]', borderColor: 'border-[#E4D141]', textColor: 'text-[#E4D141]' },
  EXTREME: { bgColor: 'bg-[#FFD4D4]', borderColor: 'border-[#FF1313]', textColor: 'text-[#FF1313]' }, // Same as HIGH
};

export default function ActivityDetected() {
  const { currentThreat, clearCurrentThreat } = useThreat();
  const { setSelectedAlert } = useAlert();

  if (!currentThreat) return null;

  const handleViewNow = () => {
    setSelectedAlert({
      id: Date.now(),  // Using timestamp as a unique id
      floor: `Floor ${currentThreat['Camera Number']}`,
      camera_num: currentThreat['Camera Number'],
      severity: currentThreat.severity === 'EXTREME' ? 'HIGH' : currentThreat.severity as 'HIGH' | 'MEDIUM' | 'LOW',
      time_ago: 'Just now',
      frame: currentThreat.frame
    });
    clearCurrentThreat();
  };

  const severity = currentThreat.severity as Severity;
  const { bgColor, borderColor, textColor } = severityMap[severity];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-[1127px] h-[525px] bg-white p-6 flex flex-col items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="w-[146px] h-[130px] bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-gray-500">SVG Placeholder</span>
          </div>
          <h2 className="text-4xl font-bold">
            <span className="opacity-50">Activity detected on </span>
            <span>Floor {currentThreat['Camera Number']}</span>
          </h2>
        </div>
        
        <div className="flex space-x-4">
          <div className="w-[85px] h-[44px] border-2 border-black border-opacity-50 rounded-sm flex items-center justify-center space-x-2">
            <Camera className="w-[28px] h-[25px]" />
            <span className="text-3xl opacity-50">{currentThreat['Camera Number']}</span>
          </div>
          <div className={`w-[85px] h-[44px] ${bgColor} border-[2.5px] ${borderColor} rounded-sm flex items-center justify-center`}>
            <span className={`text-3xl ${textColor}`}>
              {severity === 'EXTREME' ? 'HIGH' : severity}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleViewNow}
          className="w-[1052px] h-[58px] bg-[#134DAB] text-white rounded-sm text-xl font-semibold"
        >
          View Now
        </button>
      </div>
    </div>
  );
}