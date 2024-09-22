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
      floor: `Levine Hall Floor 1`,
      camera_num: currentThreat['Camera Number'] + 1,
      severity: currentThreat.severity === 'EXTREME' ? 'HIGH' : currentThreat.severity as 'HIGH' | 'MEDIUM' | 'LOW',
      time_ago: 'Just now',
      frame: currentThreat.frame
    });
    clearCurrentThreat();
  };

  const severity = currentThreat.severity as Severity;
  const { bgColor, borderColor, textColor } = severityMap[severity];

  return (
    <>
     <div className="fixed inset-0 bg-[#FF1313] opacity-50 z-40"></div>
      {/* Black overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-50"></div>
    <div className="fixed inset-0 flex items-center justify-center z-50">      <div className="w-[1127px] h-[525px] bg-white p-6 flex flex-col items-center justify-between">
        <div className="flex flex-col items-center">
        <svg width="173" height="173" viewBox="0 0 173 173" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M95.8635 22.6919L158.1 130.485C159.049 132.129 159.549 133.993 159.549 135.891C159.549 137.789 159.049 139.654 158.1 141.298C157.151 142.941 155.786 144.306 154.143 145.255C152.499 146.204 150.635 146.704 148.737 146.704H24.2632C22.3652 146.704 20.5007 146.204 18.857 145.255C17.2133 144.306 15.8484 142.941 14.8995 141.298C13.9505 139.654 13.4509 137.789 13.4509 135.891C13.4509 133.993 13.9505 132.129 14.8995 130.485L77.1363 22.6919C81.2955 15.4836 91.6971 15.4836 95.8635 22.6919ZM86.4999 108.125C84.5881 108.125 82.7547 108.884 81.4028 110.236C80.051 111.588 79.2916 113.422 79.2916 115.333C79.2916 117.245 80.051 119.079 81.4028 120.43C82.7547 121.782 84.5881 122.542 86.4999 122.542C88.4117 122.542 90.2451 121.782 91.597 120.43C92.9488 119.079 93.7082 117.245 93.7082 115.333C93.7082 113.422 92.9488 111.588 91.597 110.236C90.2451 108.884 88.4117 108.125 86.4999 108.125ZM86.4999 57.6667C84.7343 57.667 83.0303 58.3152 81.7109 59.4884C80.3915 60.6616 79.5486 62.2783 79.342 64.0317L79.2916 64.8751V93.7084C79.2936 95.5456 79.9971 97.3128 81.2583 98.6488C82.5196 99.9847 84.2434 100.789 86.0775 100.896C87.9116 101.004 89.7176 100.407 91.1264 99.2281C92.5353 98.0489 93.4408 96.3762 93.6578 94.5518L93.7082 93.7084V64.8751C93.7082 62.9633 92.9488 61.1298 91.597 59.778C90.2451 58.4262 88.4117 57.6667 86.4999 57.6667Z" fill="#FF1313"/>
        </svg>

          <h2 className="text-4xl font-bold">
            <span className="opacity-50">Activity detected on </span>
            <span>Levine Hall Floor 1</span>
          </h2>
        </div>
        
        <div className="flex space-x-4">
          <div className="w-[85px] h-[44px] border-2 border-black border-opacity-50 rounded-sm flex items-center justify-center space-x-2">
            <Camera className="w-[28px] h-[25px]" />
            <span className="text-3xl opacity-50">{currentThreat['Camera Number'] + 1}</span>
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
    </>
  );
}