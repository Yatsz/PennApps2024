import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThreatData {
  Timestamp: number;
  "Camera Number": number;
  Confidence: number;
  "GPT Response": string;
  severity: string;
  vid_id: string;
  frame: string;
}

interface ThreatContextType {
  currentThreat: ThreatData | null;
  setCurrentThreat: (threat: ThreatData | null) => void;
  clearCurrentThreat: () => void;
}

const ThreatContext = createContext<ThreatContextType | undefined>(undefined);

export function ThreatProvider({ children }: { children: ReactNode }) {
  const [currentThreat, setCurrentThreat] = useState<ThreatData | null>(null);

  const clearCurrentThreat = () => {
    setCurrentThreat(null);
  };

  useEffect(() => {
    const checkForNewThreats = async () => {
      try {
        console.log('checking for new threats')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/is_new_threat`);
        const data = await response.json();
        if (data !== false) {
          console.log('success')
          setCurrentThreat(data);
        }
      } catch (error) {
        console.error('Error checking for new threats:', error);
      }
    };

    const intervalId = setInterval(checkForNewThreats, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ThreatContext.Provider value={{ currentThreat, setCurrentThreat, clearCurrentThreat }}>
      {children}
    </ThreatContext.Provider>
  );
}

export function useThreat() {
  const context = useContext(ThreatContext);
  if (context === undefined) {
    throw new Error('useThreat must be used within a ThreatProvider');
  }
  return context;
}