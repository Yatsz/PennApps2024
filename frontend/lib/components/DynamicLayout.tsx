"use client"
import React from 'react';
import { useSidebar } from '../context/SidebarContext';
import SideBarComponent from './SideBarComponent';

interface DynamicLayoutProps {
  children: React.ReactNode;
}

export default function DynamicLayout({ children }: DynamicLayoutProps) {
    const { isSidebarOpen } = useSidebar();
  
    return (
      <main className="flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex flex-grow">
          <div 
            className={`transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'w-[calc(100%-969px)]' : 'w-0'
            } overflow-hidden`}
          >
            {isSidebarOpen && <SideBarComponent />}
          </div>
          <div 
            className={`transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'w-[969px]' : 'w-full'
            }`}
          >
            {children}
          </div>
        </div>
      </main>
    );
  }