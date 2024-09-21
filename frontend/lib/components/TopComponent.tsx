"use client"
import { useState, useEffect } from 'react'
import { ChevronDown, BarChart2 } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useSidebar } from '../context/SidebarContext'


const buildings = [
  "Penn Engineering Building",
  "Towne Building",
  "Levine Hall",
  "Moore Building",
  "Skirkanich Hall"
]



export default function TopNavBar() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [selectedBuilding, setSelectedBuilding] = useState(buildings[0])
  const { isSidebarOpen, toggleSidebar } = useSidebar()


  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

 


  const formatDateTime = (date: Date) => {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const timeZone = 'EDT'; // You might want to dynamically determine this

    return (
      <>
        <span className="text-[14px] text-black font-bold opacity-50">
          {`${dayOfWeek} ${month} ${day}`}
        </span>
        {' '}
        <span className="text-[14px] text-black font-bold opacity-75">
          {`${time} ${timeZone}`}
        </span>
      </>
    );
  };

  return (
    <div className="w-full">
    <nav className="flex items-center justify-between px-4 bg-white border-b border-gray-200 h-[46px] w-full">
      <div className="flex items-center space-x-4">
        <button aria-label="Menu" className="text-gray-600 hover:text-gray-800" onClick={toggleSidebar}
        >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"               className={`transform ${isSidebarOpen ? 'rotate-180' : ''}`}
        >
      <g opacity="0.5">
      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.25 10L5.5 12L7.25 14M9.5 21V3" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      </svg>

        </button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center space-x-1 text-black text-[14px] font-bold opacity-75 hover:opacity-100">
              <span>{selectedBuilding}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] bg-white rounded-md shadow-lg p-1 z-50"
              sideOffset={5}
            >
              {buildings.map((building) => (
                <DropdownMenu.Item
                  key={building}
                  className="text-[14px] text-black  opacity-75 rounded-md px-2 py-2 outline-none cursor-default hover:bg-gray-100 hover:opacity-100 focus:bg-gray-100 focus:opacity-100"
                  onSelect={() => setSelectedBuilding(building)}
                >
                  {building}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div className="flex items-center space-x-4">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.5">
      <path d="M10.6666 7.85333L13.4933 2.96667L14.6466 3.63333L11.1599 9.66667L6.81992 7.16667L3.63992 12.6667H14.6666V14H1.33325V2H2.66659V11.6933L6.33325 5.33333L10.6666 7.85333Z" fill="black"/>
      </g>
      </svg>
        <span className="text-sm text-gray-600">{formatDateTime(currentDateTime)}</span>
      </div>
      
    </nav>
    <div className="w-full h-[2px] bg-[#BFBFBF]"></div>

    </div>
  )
}