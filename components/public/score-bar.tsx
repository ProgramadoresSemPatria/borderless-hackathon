'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScoreBarProps {
  label: string
  value: number
  max?: number
  color?: 'purple' | 'teal'
}

export function ScoreBar({ label, value, max = 10, color = 'purple' }: ScoreBarProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const pct = (value / max) * 100
  const bg = color === 'purple' ? '#9810fa' : '#2debb1'

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-[#b2b2b2]">{label}</span>
        <span className="font-semibold text-white">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: bg }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}
