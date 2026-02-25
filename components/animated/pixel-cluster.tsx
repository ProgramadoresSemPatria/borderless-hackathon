'use client'
import { useEffect, useRef } from 'react'

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

/**
 * Layered sine waves: adjacent pixels are correlated — feels like a live
 * noise field rather than independent random flickers.
 */
function noise(col: number, row: number, t: number): number {
  const v =
    Math.sin(col * 1.3 + t * 0.70) * 0.35 +
    Math.sin(row * 1.1 + t * 0.45) * 0.30 +
    Math.sin((col - row) * 0.9 + t * 1.00) * 0.20 +
    Math.sin(col * 0.4 + row * 1.8 + t * 0.35) * 0.15 +
    0.5
  // power curve → pushes dim pixels toward 0, keeps bright pixels bright
  return Math.max(0, Math.min(1, v)) ** 1.6
}

export function PixelCluster({
  cols = 4,
  rows = 4,
  /** px per square */
  size = 12,
  color = '#2DEBB1',
  /** animation speed multiplier */
  speed = 1,
  className = '',
}: {
  cols?: number
  rows?: number
  size?: number
  color?: string
  speed?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const [r, g, b] = hexToRgb(color)
    let frameId: number
    // random start phase so each instance is out of sync with others
    let t = Math.random() * 100

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const a = noise(col, row, t)
          ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`
          ctx.fillRect(col * size, row * size, size, size)
        }
      }
      t += 0.015 * speed
      frameId = requestAnimationFrame(draw)
    }

    frameId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameId)
  }, [cols, rows, size, color, speed])

  return (
    <canvas
      ref={canvasRef}
      width={cols * size}
      height={rows * size}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    />
  )
}
