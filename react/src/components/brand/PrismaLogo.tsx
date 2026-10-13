interface PrismaLogoProps {
  size?: number
  className?: string
}

export function PrismaLogo({ size = 24, className }: PrismaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="prisma-spectrum" x1="21" y1="15" x2="31" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f87171" />
          <stop offset="0.25" stopColor="#fbbf24" />
          <stop offset="0.5" stopColor="#4ade80" />
          <stop offset="0.75" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#c084fc" />
        </linearGradient>
      </defs>

      {/* Prisma */}
      <path
        d="M16 6 L26 24 L6 24 Z"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Feixe incidente */}
      <path d="M2 15 H11" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Feixe dentro do prisma */}
      <path d="M11 15 H21" stroke="rgba(255,255,255,0.28)" strokeWidth="1.25" strokeLinecap="round" />

      {/* Dispersão espectral */}
      <path d="M21 15 L30 10.5" stroke="url(#prisma-spectrum)" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M21 15 L30 15" stroke="url(#prisma-spectrum)" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M21 15 L30 19.5" stroke="url(#prisma-spectrum)" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}
