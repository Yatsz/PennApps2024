import React, { useState } from 'react'
import AlertCard from './AlertCard'

// You'll need to import your actual SVG component here
// import WatchfulAILogo from './WatchfulAILogo.svg'

interface AlertData {
  id: number
  floor: string
  camera_num: number
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  time_ago: string
}

const mockAlerts: AlertData[] = [
  { id: 1, floor: 'Levine Floor 2', camera_num: 3, severity: 'HIGH', time_ago: '10m ago' },
  { id: 2, floor: 'Levine Floor 2', camera_num: 3, severity: 'HIGH', time_ago: '10m ago' },
  { id: 3, floor: 'Levine Floor 2', camera_num: 3, severity: 'HIGH', time_ago: '10m ago' },
  { id: 4, floor: 'Levine Floor 2', camera_num: 3, severity: 'MEDIUM', time_ago: '10m ago' },
  { id: 5, floor: 'Levine Floor 2', camera_num: 3, severity: 'MEDIUM', time_ago: '10m ago' },
  { id: 6, floor: 'Levine Floor 2', camera_num: 3, severity: 'MEDIUM', time_ago: '10m ago' },
  { id: 7, floor: 'Levine Floor 2', camera_num: 3, severity: 'LOW', time_ago: '10m ago' },
  { id: 8, floor: 'Levine Floor 2', camera_num: 3, severity: 'LOW', time_ago: '10m ago' },
  { id: 9, floor: 'Levine Floor 2', camera_num: 3, severity: 'LOW', time_ago: '10m ago' },
]

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [alerts, setAlerts] = useState<AlertData[]>(mockAlerts)
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="w-[311px] h-screen bg-white overflow-y-auto">
      <div className="ml-[29px]">
        <div className="mt-[17px]">
        <svg width="103" height="24" viewBox="0 0 103 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="103" height="24" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.42858 0C5.74659 0 5.09254 0.270918 4.6103 0.753154C4.12807 1.23539 3.85715 1.88944 3.85715 2.57143V4.61314C2.66534 5.44125 1.69191 6.54579 1.02018 7.83224C0.348441 9.11869 -0.00160121 10.5487 5.5063e-06 12C5.5063e-06 15.0583 1.52572 17.76 3.85715 19.3869V21.4286C3.85715 22.1106 4.12807 22.7646 4.6103 23.2468C5.09254 23.7291 5.74659 24 6.42858 24H11.5714C12.2534 24 12.9075 23.7291 13.3897 23.2468C13.8719 22.7646 14.1429 22.1106 14.1429 21.4286V19.3869C15.3347 18.5587 16.3081 17.4542 16.9798 16.1678C17.6516 14.8813 18.0016 13.4513 18 12C18 8.94171 16.4743 6.24 14.1429 4.61314V2.57143C14.1429 1.88944 13.8719 1.23539 13.3897 0.753154C12.9075 0.270918 12.2534 0 11.5714 0L6.42858 0ZM2.57143 12C2.57143 10.295 3.24873 8.6599 4.45432 7.45431C5.65991 6.24872 7.29504 5.57143 9.00001 5.57143C10.705 5.57143 12.3401 6.24872 13.5457 7.45431C14.7513 8.6599 15.4286 10.295 15.4286 12C15.4286 13.705 14.7513 15.3401 13.5457 16.5457C12.3401 17.7513 10.705 18.4286 9.00001 18.4286C7.29504 18.4286 5.65991 17.7513 4.45432 16.5457C3.24873 15.3401 2.57143 13.705 2.57143 12ZM9.11829 9.312C9.04664 9.1251 8.92407 8.96201 8.76447 8.84121C8.60487 8.72041 8.41462 8.64674 8.21529 8.62853C8.01596 8.61033 7.81551 8.64833 7.63667 8.73823C7.45783 8.82812 7.30775 8.96631 7.20343 9.13714L6.09772 10.9423H5.26286C4.9787 10.9423 4.70618 11.0552 4.50525 11.2561C4.30432 11.457 4.19143 11.7296 4.19143 12.0137C4.19143 12.2979 4.30432 12.5704 4.50525 12.7713C4.70618 12.9723 4.9787 13.0851 5.26286 13.0851H6.69943C7.07315 13.0851 7.41943 12.8914 7.61315 12.5726L7.89772 12.1097L8.94343 14.8303C9.01627 15.0201 9.14161 15.1853 9.30482 15.3066C9.46803 15.4278 9.66237 15.5001 9.86514 15.515C10.0679 15.53 10.2707 15.4869 10.4499 15.3908C10.6291 15.2948 10.7773 15.1497 10.8771 14.9726L11.94 13.0851H13.0234C13.3076 13.0851 13.5801 12.9723 13.781 12.7713C13.982 12.5704 14.0949 12.2979 14.0949 12.0137C14.0949 11.7296 13.982 11.457 13.781 11.2561C13.5801 11.0552 13.3076 10.9423 13.0234 10.9423H11.3143C11.1247 10.9433 10.9387 10.9942 10.775 11.0899C10.6112 11.1856 10.4756 11.3227 10.3817 11.4874L10.128 11.9366L9.11829 9.312Z" fill="black"/>
        <path d="M28.4404 16.5L26.0479 6.47852H28.1191L29.6299 13.3623L31.4619 6.47852H33.8682L35.625 13.4785L37.1631 6.47852H39.2002L36.7666 16.5H34.6201L32.624 9.00781L30.6348 16.5H28.4404ZM41.1416 11.4551L39.3984 11.1406C39.5944 10.4388 39.9316 9.91927 40.4102 9.58203C40.8887 9.24479 41.5996 9.07617 42.543 9.07617C43.3997 9.07617 44.0378 9.17871 44.457 9.38379C44.8763 9.58431 45.1702 9.8418 45.3389 10.1562C45.512 10.4661 45.5986 11.0381 45.5986 11.8721L45.5781 14.1143C45.5781 14.7523 45.6077 15.224 45.667 15.5293C45.7308 15.8301 45.847 16.1536 46.0156 16.5H44.1152C44.0651 16.3724 44.0036 16.1833 43.9307 15.9326C43.8988 15.8187 43.876 15.7435 43.8623 15.707C43.5342 16.026 43.1833 16.2653 42.8096 16.4248C42.4359 16.5843 42.0371 16.6641 41.6133 16.6641C40.8659 16.6641 40.2757 16.4613 39.8428 16.0557C39.4144 15.6501 39.2002 15.1374 39.2002 14.5176C39.2002 14.1074 39.2982 13.7428 39.4941 13.4238C39.6901 13.1003 39.9635 12.8542 40.3145 12.6855C40.6699 12.5124 41.1803 12.362 41.8457 12.2344C42.7435 12.0658 43.3656 11.9085 43.7119 11.7627V11.5713C43.7119 11.2021 43.6208 10.9401 43.4385 10.7852C43.2562 10.6257 42.9121 10.5459 42.4062 10.5459C42.0645 10.5459 41.7979 10.6143 41.6064 10.751C41.415 10.8831 41.2601 11.1178 41.1416 11.4551ZM43.7119 13.0137C43.4658 13.0957 43.0762 13.1937 42.543 13.3076C42.0098 13.4215 41.6611 13.5332 41.4971 13.6426C41.2464 13.8203 41.1211 14.0459 41.1211 14.3193C41.1211 14.5882 41.2214 14.8206 41.4219 15.0166C41.6224 15.2126 41.8776 15.3105 42.1875 15.3105C42.5339 15.3105 42.8643 15.1966 43.1787 14.9688C43.4111 14.7956 43.5638 14.5837 43.6367 14.333C43.6868 14.1689 43.7119 13.8568 43.7119 13.3965V13.0137ZM50.8281 9.24023V10.7715H49.5156V13.6973C49.5156 14.2897 49.527 14.6361 49.5498 14.7363C49.5771 14.832 49.6341 14.9118 49.7207 14.9756C49.8118 15.0394 49.9212 15.0713 50.0488 15.0713C50.2266 15.0713 50.484 15.0098 50.8213 14.8867L50.9854 16.377C50.5387 16.5684 50.0329 16.6641 49.4678 16.6641C49.1214 16.6641 48.8092 16.6071 48.5312 16.4932C48.2533 16.3747 48.0482 16.2243 47.916 16.042C47.7884 15.8551 47.6995 15.6045 47.6494 15.29C47.6084 15.0667 47.5879 14.6156 47.5879 13.9365V10.7715H46.7061V9.24023H47.5879V7.79785L49.5156 6.67676V9.24023H50.8281ZM58.4912 11.3867L56.5977 11.7285C56.5339 11.3503 56.388 11.0654 56.1602 10.874C55.9368 10.6826 55.6452 10.5869 55.2852 10.5869C54.8066 10.5869 54.4238 10.7533 54.1367 11.0859C53.8542 11.4141 53.7129 11.9655 53.7129 12.7402C53.7129 13.6016 53.8564 14.21 54.1436 14.5654C54.4352 14.9209 54.8249 15.0986 55.3125 15.0986C55.6771 15.0986 55.9756 14.9961 56.208 14.791C56.4404 14.5814 56.6045 14.2236 56.7002 13.7178L58.5869 14.0391C58.391 14.9049 58.015 15.5589 57.459 16.001C56.903 16.443 56.1579 16.6641 55.2236 16.6641C54.1618 16.6641 53.3141 16.3291 52.6807 15.6592C52.0518 14.9893 51.7373 14.0618 51.7373 12.877C51.7373 11.6784 52.054 10.7464 52.6875 10.0811C53.321 9.41113 54.1777 9.07617 55.2578 9.07617C56.1419 9.07617 56.8438 9.26758 57.3633 9.65039C57.8874 10.0286 58.2633 10.6074 58.4912 11.3867ZM61.8682 6.47852V10.1631C62.488 9.43848 63.2285 9.07617 64.0898 9.07617C64.5319 9.07617 64.9307 9.1582 65.2861 9.32227C65.6416 9.48633 65.9082 9.69596 66.0859 9.95117C66.2682 10.2064 66.3913 10.4889 66.4551 10.7988C66.5234 11.1087 66.5576 11.5895 66.5576 12.2412V16.5H64.6367V12.665C64.6367 11.904 64.6003 11.4209 64.5273 11.2158C64.4544 11.0107 64.3245 10.849 64.1377 10.7305C63.9554 10.6074 63.7253 10.5459 63.4473 10.5459C63.1283 10.5459 62.8434 10.6234 62.5928 10.7783C62.3421 10.9333 62.1576 11.168 62.0391 11.4824C61.9251 11.7923 61.8682 12.2526 61.8682 12.8633V16.5H59.9473V6.47852H61.8682ZM67.6719 9.24023H68.7383V8.69336C68.7383 8.08268 68.8021 7.62695 68.9297 7.32617C69.0618 7.02539 69.3011 6.78158 69.6475 6.59473C69.9984 6.40332 70.4404 6.30762 70.9736 6.30762C71.5205 6.30762 72.056 6.38965 72.5801 6.55371L72.3203 7.89355C72.015 7.82064 71.721 7.78418 71.4385 7.78418C71.1605 7.78418 70.96 7.85026 70.8369 7.98242C70.7184 8.11003 70.6592 8.3584 70.6592 8.72754V9.24023H72.0947V10.751H70.6592V16.5H68.7383V10.751H67.6719V9.24023ZM77.9531 16.5V15.4131C77.6888 15.8005 77.3402 16.1058 76.9072 16.3291C76.4788 16.5524 76.0254 16.6641 75.5469 16.6641C75.0592 16.6641 74.6217 16.557 74.2344 16.3428C73.847 16.1286 73.5667 15.8278 73.3936 15.4404C73.2204 15.0531 73.1338 14.5176 73.1338 13.834V9.24023H75.0547V12.5762C75.0547 13.597 75.0889 14.2236 75.1572 14.4561C75.2301 14.6839 75.36 14.8662 75.5469 15.0029C75.7337 15.1351 75.9707 15.2012 76.2578 15.2012C76.5859 15.2012 76.8799 15.1123 77.1396 14.9346C77.3994 14.7523 77.5771 14.529 77.6729 14.2646C77.7686 13.9958 77.8164 13.3418 77.8164 12.3027V9.24023H79.7373V16.5H77.9531ZM81.7334 16.5V6.47852H83.6543V16.5H81.7334ZM85.6299 16.5V14.5791H87.5508V16.5H85.6299ZM98.5771 16.5H96.376L95.501 14.2236H91.4951L90.668 16.5H88.5215L92.4248 6.47852H94.5645L98.5771 16.5ZM94.8516 12.5352L93.4707 8.81641L92.1172 12.5352H94.8516ZM99.5957 16.5V6.47852H101.619V16.5H99.5957Z" fill="black"/>
        </svg>
        </div>
        <div className="mt-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-[257px] h-10 pl-10 pr-3 py-2 text-sm text-black text-opacity-75 border border-black border-opacity-50 rounded-md outline-none transition-colors duration-200 ${
                isFocused ? 'border-[#134DAB]' : ''
              }`}
              placeholder="Search..."
              style={{ fontSize: '14px' }}
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              aria-label="Search"
            >
              {/* Replace this with your actual SVG icon */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-colors duration-200 ${
                  isFocused ? 'text-[#134DAB]' : 'text-black text-opacity-75'
                }`}
              >
                <path
                  d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14L11.1 11.1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
        <div className="mt-[8px] text-[12px] text-black opacity-50 mb-[8px] font-normal">
        {alerts.length} Search Results
        </div>
        <div className="mt-[16px] mb-[16px] space-y-4">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              camera_num={alert.camera_num}
              floor={alert.floor}
              severity={alert.severity}
              time_ago={alert.time_ago}
            />
          ))}
        </div>
      </div>
    </div>
  )
}