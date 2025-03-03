export function MobileIllustration() {
    return (
      <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
        {/* Phone base */}
        <rect x="180" y="50" width="140" height="280" rx="20" fill="#4A90E2" />
        <rect x="190" y="70" width="120" height="220" rx="5" fill="#FFFFFF" />
        {/* Screen content */}
        <rect x="200" y="90" width="100" height="60" rx="5" fill="#FF5A5F" />
        <rect x="210" y="160" width="80" height="10" rx="2" fill="#333333" />
        <rect x="210" y="180" width="60" height="10" rx="2" fill="#666666" />
        <rect x="210" y="200" width="40" height="20" rx="5" fill="#FF9500" />
        {/* Person */}
        <circle cx="250" y="270" r="15" fill="#FFD7D7" /> {/* Head */}
        <rect x="240" y="285" width="20" height="30" fill="#6C63FF" /> {/* Body */}
        <rect x="235" y="315" width="10" height="20" fill="#FFD7D7" /> {/* Left leg */}
        <rect x="255" y="315" width="10" height="20" fill="#FFD7D7" /> {/* Right leg */}
        {/* Decorative elements */}
        <circle cx="150" y="150" r="30" fill="#A5D6A7" /> {/* Green leaf */}
        <path d="M150,130 Q170,140 150,170 Q130,140 150,130" fill="#81C784" />
        <circle cx="350" y="120" r="25" fill="#90CAF9" /> {/* Blue decoration */}
        <path d="M350,100 Q365,110 350,140 Q335,110 350,100" fill="#64B5F6" />
        {/* Shopping bag */}
        <rect x="320" y="280" width="40" height="40" fill="#F44336" />
        <path d="M320,290 L320,280 L360,280 L360,290" fill="#D32F2F" />
        <rect x="330" y="270" width="5" height="10" fill="#D32F2F" />
        <rect x="345" y="270" width="5" height="10" fill="#D32F2F" />
        {/* Shopping cart icon */}
        <circle cx="400" y="200" r="20" fill="#FFC107" />
        <path d="M390,200 L395,190 L405,190 L410,200" stroke="#FFF" strokeWidth="2" fill="none" />
        <circle cx="395" y="205" r="3" fill="#FFF" />
        <circle cx="405" y="205" r="3" fill="#FFF" />
      </svg>
    )
  }
  
  