'use client'
import { motion } from 'framer-motion'
import type { Team } from '@/lib/types'
import { GradientText } from '@/components/animated/gradient-text'

interface PodiumProps {
  teams: Team[]
}

const MEDAL: Record<1 | 2 | 3, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function PodiumBlock({ team, position, height }: { team: Team; position: 1 | 2 | 3; height: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: position * 0.15 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="text-center">
        <div className={`mb-1 ${position === 1 ? 'text-4xl' : 'text-2xl'}`}>{MEDAL[position]}</div>
        <div className={`font-black leading-tight text-white ${position === 1 ? 'text-lg' : 'text-sm'}`}>{team.name}</div>
        <div className="text-xs text-[#b2b2b2]">{team.project}</div>
        <div className={`mt-1 font-extrabold tabular-nums ${position === 1 ? 'text-2xl' : 'text-base'}`}>
          {position === 1 ? (
            <GradientText>{team.totalScore.toFixed(2)}</GradientText>
          ) : (
            <span className="text-[#2debb1]">{team.totalScore.toFixed(2)}</span>
          )}
        </div>
      </div>
      <div
        className={`flex items-center justify-center rounded-t-lg font-black text-white ${
          position === 1
            ? 'w-32 text-3xl bg-gradient-to-b from-[#9810fa] to-[#6c0bb8]'
            : position === 2
            ? 'w-24 text-xl bg-[#2a2a2b] border border-white/20'
            : 'w-24 text-xl bg-[#232322] border border-white/10'
        }`}
        style={{ height }}
      >
        {position}
      </div>
    </motion.div>
  )
}

export function Podium({ teams }: PodiumProps) {
  const [first, second, third] = [teams[0], teams[1], teams[2]]

  return (
    <div className="flex items-end justify-center gap-4">
      {second && <PodiumBlock team={second} position={2} height="80px" />}
      {first && <PodiumBlock team={first} position={1} height="120px" />}
      {third && <PodiumBlock team={third} position={3} height="60px" />}
    </div>
  )
}
