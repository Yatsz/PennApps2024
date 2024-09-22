"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import { SidebarProvider } from '@/lib/context/SidebarContext';
import { AlertProvider } from '@/lib/context/AlertContext';
import { ThreatProvider } from '@/lib/context/ThreatContext';
const DynamicLayout = dynamic(() => import('@/lib/components/DynamicLayout'), { ssr: false });
const TopComponent = dynamic(() => import('@/lib/components/TopComponent'), { ssr: false });
const MapComponent = dynamic(() => import('@/lib/components/MapComponent'), { ssr: false });
const ActivityDetected = dynamic(() => import('@/lib/components/ActivityDetected'), { ssr: false });

export default function Home() {
  return (
    <SidebarProvider>
      <AlertProvider>
        <ThreatProvider>
          <DynamicLayout>
            <TopComponent />
            <MapComponent />
            <ActivityDetected />
          </DynamicLayout>
        </ThreatProvider>
      </AlertProvider>
    </SidebarProvider>
  );
}