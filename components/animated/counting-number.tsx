'use client'
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, animate } from 'framer-motion'

interface CountingNumberProps {
  value: number
  duration?: number
  className?: string
  decimals?: number
}

export function CountingNumber({
  value,
  duration = 1.5,
  className = '',
  decimals = 0,
}: CountingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = latest.toFixed(decimals)
        }
      },
    })
    return controls.stop
  }, [inView, value, duration, decimals, motionValue])

  return <span ref={ref} className={className}>0</span>
}
