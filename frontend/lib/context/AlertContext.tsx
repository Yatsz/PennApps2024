import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AlertData {
  id: number;
  floor: string;
  camera_num: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  time_ago: string;
  frame: string;
}

interface AlertContextType {
  selectedAlert: AlertData | null;
  setSelectedAlert: (alert: AlertData | null) => void;
  clearSelectedAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);

  const clearSelectedAlert = () => {
    setSelectedAlert(null);
  };

  return (
    <AlertContext.Provider value={{ selectedAlert, setSelectedAlert, clearSelectedAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}