"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import { SidebarProvider } from '@/lib/context/SidebarContext';

const DynamicLayout = dynamic(() => import('@/lib/components/DynamicLayout'), { ssr: false });
const TopComponent = dynamic(() => import('@/lib/components/TopComponent'), { ssr: false });
const MapComponent = dynamic(() => import('@/lib/components/MapComponent'), { ssr: false });

export default function Home() {
  return (
    <SidebarProvider>
      <DynamicLayout>
        <TopComponent />
        <MapComponent />
      </DynamicLayout>
    </SidebarProvider>
  );
}