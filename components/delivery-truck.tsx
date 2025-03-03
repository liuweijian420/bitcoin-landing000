import type React from "react"

export function DeliveryTruck(): React.JSX.Element {
  return (
    <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
      {/* 卡車主體 */}
      <rect x="10" y="20" width="50" height="25" fill="#06b6d4" rx="2" />

      {/* 卡車駕駛艙 */}
      <rect x="0" y="25" width="15" height="20" fill="#06b6d4" rx="2" />
      <rect x="5" y="30" width="8" height="6" fill="#dbeafe" />

      {/* 輪子 */}
      <circle cx="15" cy="45" r="5" fill="#1e293b" />
      <circle cx="15" cy="45" r="2" fill="#94a3b8" />
      <circle cx="50" cy="45" r="5" fill="#1e293b" />
      <circle cx="50" cy="45" r="2" fill="#94a3b8" />

      {/* 速度線 */}
      <line x1="0" y1="35" x2="-10" y2="35" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="2,2" />
    </svg>
  )
}

