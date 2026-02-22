'use client'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function AuroraBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Aurora blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #9810fa 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #2debb1 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #9810fa 0%, transparent 70%)' }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
