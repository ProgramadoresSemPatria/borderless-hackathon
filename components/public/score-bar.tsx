'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScoreBarProps {
  label: string
  value: number
  max?: number
}

export function ScoreBar({ label, value, max = 10 }: ScoreBarProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const pct = (value / max) * 100

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{label}</span>
        <span className="font-black tabular-nums text-white text-sm">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-none bg-white/[0.07]">
        <motion.div
          className="h-full rounded-none"
          style={{ backgroundColor: '#9810fa' }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}
