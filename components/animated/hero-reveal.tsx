'use client'
import { motion } from 'framer-motion'

interface HeroRevealProps {
  text: string
  className?: string
  stagger?: number
  align?: 'left' | 'center'
}

export function HeroReveal({ text, className = '', stagger = 0.1, align = 'center' }: HeroRevealProps) {
  const words = text.split(' ')

  return (
    <div className={`flex flex-wrap ${align === 'left' ? 'justify-start' : 'justify-center'} gap-x-[0.3em] gap-y-0 ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.75,
              delay: i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  )
}
