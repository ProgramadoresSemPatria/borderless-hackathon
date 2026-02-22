'use client'
import { motion } from 'framer-motion'
import type { Team } from '@/lib/types'

interface PodiumProps {
  teams: Team[]
}

const RANK_COLOR: Record<1 | 2 | 3, string> = {
  1: '#9810fa',
  2: '#2debb1',
  3: 'rgba(255,255,255,0.55)',
}

function PodiumBlock({
  team,
  position,
  barHeight,
}: {
  team: Team
  position: 1 | 2 | 3
  barHeight: number
}) {
  const color = RANK_COLOR[position]
  const isFirst = position === 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: position * 0.12, ease: 'easeOut' }}
      className={`flex flex-col overflow-hidden rounded-xl border border-white/[0.08] ${isFirst ? 'w-44' : 'w-36'}`}
    >
      {/* Info */}
      <div className="bg-[#2a2a2b] px-4 py-4 text-center">
        <div className={`font-black leading-tight text-white ${isFirst ? 'text-base' : 'text-sm'}`}>
          {team.name}
        </div>
        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
          {team.project}
        </div>
        <div
          className={`mt-2 font-extrabold tabular-nums ${isFirst ? 'text-2xl' : 'text-lg'}`}
          style={{ color }}
        >
          {team.totalScore.toFixed(2)}
        </div>
      </div>

      {/* Platform */}
      <div
        className="flex items-center justify-center border-t border-white/[0.06]"
        style={{
          height: `${barHeight}px`,
          backgroundColor: `${color}0d`,
        }}
      >
        <span
          className="select-none font-black tabular-nums"
          style={{
            color,
            fontSize: isFirst ? '4rem' : '2.75rem',
            lineHeight: 1,
            opacity: 0.2,
          }}
        >
          {position}
        </span>
      </div>
    </motion.div>
  )
}

export function Podium({ teams }: PodiumProps) {
  const [first, second, third] = [teams[0], teams[1], teams[2]]

  return (
    <div className="flex items-end justify-center gap-3">
      {second && <PodiumBlock team={second} position={2} barHeight={80} />}
      {first && <PodiumBlock team={first} position={1} barHeight={120} />}
      {third && <PodiumBlock team={third} position={3} barHeight={56} />}
    </div>
  )
}
