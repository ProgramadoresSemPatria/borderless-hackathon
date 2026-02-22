import { useId } from 'react'

export function HeroGrain() {
  const id = useId()
  const filterId = `grain-${id.replace(/:/g, '')}`

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {/* Film grain via SVG feTurbulence */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      {/* Purple edge bleed — top-left */}
      <div
        className="absolute -left-[15%] -top-[5%] h-[55%] w-[55%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(152,16,250,0.28) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Teal edge bleed — bottom-right */}
      <div
        className="absolute -right-[15%] bottom-[0%] h-[50%] w-[50%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(45,235,177,0.16) 0%, transparent 70%)',
          filter: 'blur(110px)',
        }}
      />
    </div>
  )
}
