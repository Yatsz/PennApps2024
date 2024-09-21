import React from 'react'

interface AlertCardProps {
  camera_num: number
  floor: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  time_ago: string
}

const severityConfig = {
  HIGH: { textColor: 'text-red-500', Icon: HighSeverityIcon },
  MEDIUM: { textColor: 'text-orange-500', Icon: MediumSeverityIcon },
  LOW: { textColor: 'text-yellow-500', Icon: LowSeverityIcon },
}

// Placeholder SVG components - replace these with your actual SVG components
function HighSeverityIcon() {
  return (
    <svg width="26" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6237 1.43506L25.4162 20.1276C25.5808 20.4126 25.6674 20.7359 25.6674 21.065C25.6674 21.3942 25.5808 21.7175 25.4162 22.0025C25.2517 22.2876 25.015 22.5243 24.73 22.6888C24.4449 22.8534 24.1216 22.94 23.7925 22.9401H2.20747C1.87834 22.94 1.55502 22.8534 1.26999 22.6888C0.984959 22.5243 0.74827 22.2876 0.58371 22.0025C0.41915 21.7175 0.332517 21.3942 0.33252 21.065C0.332522 20.7359 0.419158 20.4126 0.583722 20.1276L11.3762 1.43506C12.0975 0.185059 13.9012 0.185059 14.6237 1.43506ZM13 16.2501C12.6685 16.2501 12.3505 16.3818 12.1161 16.6162C11.8817 16.8506 11.75 17.1685 11.75 17.5001C11.75 17.8316 11.8817 18.1495 12.1161 18.3839C12.3505 18.6184 12.6685 18.7501 13 18.7501C13.3315 18.7501 13.6494 18.6184 13.8839 18.3839C14.1183 18.1495 14.25 17.8316 14.25 17.5001C14.25 17.1685 14.1183 16.8506 13.8839 16.6162C13.6494 16.3818 13.3315 16.2501 13 16.2501ZM13 7.50006C12.6938 7.5001 12.3983 7.6125 12.1695 7.81595C11.9407 8.0194 11.7945 8.29975 11.7587 8.60381L11.75 8.75006V13.7501C11.7503 14.0687 11.8723 14.3751 12.091 14.6068C12.3097 14.8384 12.6087 14.9779 12.9267 14.9965C13.2448 15.0152 13.5579 14.9117 13.8023 14.7072C14.0466 14.5027 14.2036 14.2127 14.2412 13.8963L14.25 13.7501V8.75006C14.25 8.41854 14.1183 8.1006 13.8839 7.86618C13.6494 7.63176 13.3315 7.50006 13 7.50006Z" fill="#FF1313"/>
</svg>

  )
}

function MediumSeverityIcon() {
  return (
    <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 25C6.09625 25 0.5 19.4037 0.5 12.5C0.5 5.59625 6.09625 0 13 0C19.9037 0 25.5 5.59625 25.5 12.5C25.5 19.4037 19.9037 25 13 25ZM13 22.5C15.6522 22.5 18.1957 21.4464 20.0711 19.5711C21.9464 17.6957 23 15.1522 23 12.5C23 9.84783 21.9464 7.3043 20.0711 5.42893C18.1957 3.55357 15.6522 2.5 13 2.5C10.3478 2.5 7.8043 3.55357 5.92893 5.42893C4.05357 7.3043 3 9.84783 3 12.5C3 15.1522 4.05357 17.6957 5.92893 19.5711C7.8043 21.4464 10.3478 22.5 13 22.5ZM13 6.25C13.3315 6.25 13.6495 6.3817 13.8839 6.61612C14.1183 6.85054 14.25 7.16848 14.25 7.5V13.75C14.25 14.0815 14.1183 14.3995 13.8839 14.6339C13.6495 14.8683 13.3315 15 13 15C12.6685 15 12.3505 14.8683 12.1161 14.6339C11.8817 14.3995 11.75 14.0815 11.75 13.75V7.5C11.75 7.16848 11.8817 6.85054 12.1161 6.61612C12.3505 6.3817 12.6685 6.25 13 6.25ZM13 18.75C12.6685 18.75 12.3505 18.6183 12.1161 18.3839C11.8817 18.1495 11.75 17.8315 11.75 17.5C11.75 17.1685 11.8817 16.8505 12.1161 16.6161C12.3505 16.3817 12.6685 16.25 13 16.25C13.3315 16.25 13.6495 16.3817 13.8839 16.6161C14.1183 16.8505 14.25 17.1685 14.25 17.5C14.25 17.8315 14.1183 18.1495 13.8839 18.3839C13.6495 18.6183 13.3315 18.75 13 18.75Z" fill="#FF8C00"/>
    </svg>
    
  )
}

function LowSeverityIcon() {
  return (
    <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_27_517)">
<path d="M15 8.50007V13.5001M15 18.5001H15.0125M25 14.7501C25 21.0001 20.625 24.1251 15.425 25.9376C15.1527 26.0298 14.8569 26.0254 14.5875 25.9251C9.375 24.1251 5 21.0001 5 14.7501V6.00007C5 5.66855 5.1317 5.35061 5.36612 5.11619C5.60054 4.88177 5.91848 4.75007 6.25 4.75007C8.75 4.75007 11.875 3.25007 14.05 1.35007C14.3148 1.12382 14.6517 0.999512 15 0.999512C15.3483 0.999512 15.6852 1.12382 15.95 1.35007C18.1375 3.26257 21.25 4.75007 23.75 4.75007C24.0815 4.75007 24.3995 4.88177 24.6339 5.11619C24.8683 5.35061 25 5.66855 25 6.00007V14.7501Z" stroke="#E3C800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"/>
</g>
<defs>
<filter id="filter0_d_27_517" x="0" y="-0.000488281" width="30" height="35.0044" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_27_517"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_27_517" result="shape"/>
</filter>
</defs>
</svg>

  )
}

export default function AlertCard({ camera_num, floor, severity, time_ago }: AlertCardProps) {
  const { textColor, Icon } = severityConfig[severity]

  return (
    <div className="w-[257px] h-[67px] bg-white rounded-[2px] border border-black border-opacity-10 flex items-center p-3 shadow-sm">
      <div className="mr-3 flex items-center justify-center">
        <Icon />
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-semibold">{floor}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex items-center space-x-1 bg-gray-100 rounded px-1">
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">{camera_num}</span>
          </div>
          <span className={`text-xs font-semibold ${textColor} px-1 rounded`}>
            {severity}
          </span>
        </div>
      </div>
      <div className="text-xs text-gray-500">{time_ago}</div>
    </div>
  )
}