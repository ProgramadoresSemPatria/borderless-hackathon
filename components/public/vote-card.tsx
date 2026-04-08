'use client'
import { motion } from 'framer-motion'
import { Users, Check, Heart } from 'lucide-react'

interface VoteCardProps {
  team: {
    _id: string
    name: string
    project: string
    description?: string
    tags: string[]
    memberNames: string[]
  }
  voteCount: number
  isSelected: boolean
  hasVoted: boolean
  onVote: () => void
  disabled: boolean
  index: number
}

export function VoteCard({
  team,
  voteCount,
  isSelected,
  hasVoted,
  onVote,
  disabled,
  index,
}: VoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`relative flex flex-col rounded-xl border p-6 transition-all duration-300 ${
        isSelected
          ? 'border-[#9810fa]/50 bg-[#9810fa]/[0.06] shadow-[0_0_40px_-12px_rgba(152,16,250,0.25)]'
          : 'border-white/[0.08] bg-[#2a2a2b] hover:border-white/[0.15]'
      }`}
    >
      {/* Selected badge */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-3 right-4 flex items-center gap-1.5 rounded-full border border-[#9810fa]/30 bg-[#9810fa] px-3 py-1"
        >
          <Check className="h-3 w-3 text-white" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">
            Seu voto
          </span>
        </motion.div>
      )}

      {/* Team info */}
      <div className="mb-4">
        <h3 className="text-xl font-black leading-tight text-white">{team.name}</h3>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
          {team.project}
        </p>
      </div>

      {team.description && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#b2b2b2]">
          {team.description}
        </p>
      )}

      {team.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {team.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Members */}
      <div className="mb-5 flex items-center gap-1.5 text-sm text-[#636363]">
        <Users className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="line-clamp-1">{team.memberNames.join(', ')}</span>
      </div>

      {/* Footer: vote count + button */}
      <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-2">
          <Heart
            className={`h-4 w-4 ${voteCount > 0 ? 'fill-[#9810fa]/30 text-[#9810fa]' : 'text-[#636363]'}`}
          />
          <span className="text-sm font-bold tabular-nums text-white">
            {voteCount}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#636363]">
            {voteCount === 1 ? 'voto' : 'votos'}
          </span>
        </div>

        {!hasVoted ? (
          <button
            onClick={onVote}
            disabled={disabled}
            className="rounded-lg bg-[#9810fa] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#a835ff] hover:shadow-[0_0_20px_-4px_rgba(152,16,250,0.5)] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            Votar
          </button>
        ) : isSelected ? (
          <div className="flex items-center gap-1.5 rounded-lg border border-[#9810fa]/30 bg-[#9810fa]/10 px-4 py-2">
            <Check className="h-3.5 w-3.5 text-[#9810fa]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#9810fa]">
              Votado
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#636363]">
            —
          </span>
        )}
      </div>
    </motion.div>
  )
}
