'use client'
import { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'characters'
}

export function BlurText({
  text,
  delay = 0.05,
  className = '',
  animateBy = 'words',
}: BlurTextProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  const tokens = animateBy === 'words' ? text.split(' ') : text.split('')

  return (
    <motion.p
      ref={ref}
      className={`flex flex-wrap gap-[0.25em] ${className}`}
      initial="hidden"
      animate={controls}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
            visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
          }}
          transition={{ duration: 0.5, delay: i * delay, ease: 'easeOut' }}
        >
          {token}
        </motion.span>
      ))}
    </motion.p>
  )
}
