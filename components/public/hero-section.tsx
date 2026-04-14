'use client'
import { motion } from 'framer-motion'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { CountingNumber } from '@/components/animated/counting-number'
import { HeroGrain } from '@/components/animated/hero-grain'
import { PixelCluster } from '@/components/animated/pixel-cluster'
import Link from 'next/link'
import { ArrowRight, Dot } from 'lucide-react'

const E = [0.16, 1, 0.3, 1] as const

type Status = 'upcoming' | 'live' | 'finished'

interface HeroSectionProps {
  slug: string
  name: string
  edition: string
  date: string
  status: Status
  votingOpen: boolean
  criteria: string[]
  participantCount: number
  teamCount: number
  criteriaCount: number
  topTeam: { name: string; score: number } | null
}

const STATUS_META: Record<Status, { label: string; color: string }> = {
  live: { label: 'Em andamento', color: '#2debb1' },
  upcoming: { label: 'Em breve', color: '#9810fa' },
  finished: { label: 'Encerrada', color: '#b2b2b2' },
}

export function HeroSection({
  slug,
  name,
  edition,
  date,
  status,
  votingOpen,
  criteria,
  participantCount,
  teamCount,
  criteriaCount,
  topTeam,
}: HeroSectionProps) {
  // votingOpen overrides status label (voting is the loudest state)
  const effectiveMeta = votingOpen
    ? { label: 'Votação aberta', color: '#2debb1' }
    : STATUS_META[status]
  const showVoteCta = votingOpen
  const showLeader = !votingOpen && status === 'finished' && topTeam

  return (
    <section className="relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroGrain />
      </div>

      {/* Purple pixel accent — top-right, subtle */}
      <PixelCluster
        className="absolute right-8 top-24 hidden lg:block"
        cols={4}
        rows={4}
        size={8}
        color="#9810fa"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 pb-16 lg:px-12 lg:pt-28 lg:pb-20">
        {/* ── TOP: eyebrow row ─────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: E }}
        >
          <img
            src="/brand/borderless-logo.svg"
            alt="Borderless"
            width={22}
            height={26}
            style={{ mixBlendMode: 'screen' }}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#636363]">
            Borderless Coding
          </span>
          <span className="h-px w-6 bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9810fa]">
            {edition}
          </span>
          <span className="h-px w-6 bg-white/10" />
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: effectiveMeta.color }}>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: effectiveMeta.color,
                boxShadow: (votingOpen || status === 'live') ? `0 0 0 4px ${effectiveMeta.color}22` : undefined,
              }}
            />
            {effectiveMeta.label}
          </span>
        </motion.div>

        {/* ── MIDDLE: two-column main content ─────────────────────── */}
        <div className="grid gap-10 pt-12 pb-14 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start lg:gap-16 lg:pt-16 lg:pb-16">
          {/* LEFT: title + date */}
          <div className="min-w-0">
            <HeroReveal
              text={name}
              align="left"
              delay={0.1}
              className="mb-6 text-[clamp(2.5rem,7vw,6rem)] font-black leading-[0.88] tracking-tight text-white"
            />
            <motion.p
              className="text-xs font-bold uppercase tracking-[0.3em] text-[#636363]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              {date}
            </motion.p>
          </div>

          {/* RIGHT: state panel */}
          <motion.aside
            className="border-l border-white/[0.08] pl-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: E }}
          >
            {showVoteCta ? (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#2debb1]">
                  Votação popular aberta
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#b2b2b2]">
                  Vote no time que você acredita. Um voto por pessoa.
                </p>
                <Link
                  href={`/${slug}/votar`}
                  className="group mt-6 inline-flex items-center gap-3 border border-[#2debb1] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#2debb1] transition-all hover:bg-[#2debb1] hover:text-[#0a0a0a]"
                >
                  Votar agora
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ) : showLeader && topTeam ? (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#636363]">
                  Primeiro lugar
                </p>
                <p className="mt-3 truncate text-2xl font-black leading-tight text-white">
                  {topTeam.name}
                </p>
                <div className="mt-2 text-2xl font-black tabular-nums text-[#9810fa]">
                  <CountingNumber value={topTeam.score} decimals={2} />
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#636363]">
                    pontos
                  </span>
                </div>
                <Link
                  href={`/${slug}/resultados`}
                  className="group mt-6 inline-flex items-center gap-3 border border-[#9810fa] px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#9810fa] transition-all hover:bg-[#9810fa] hover:text-white"
                >
                  Ver resultados
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#636363]">
                  Critérios de avaliação
                </p>
                <ul className="mt-4 space-y-2">
                  {criteria.slice(0, 4).map((c, i) => (
                    <li
                      key={c}
                      className="flex items-baseline gap-3 text-sm text-white"
                    >
                      <span className="text-[10px] font-black tabular-nums text-[#636363]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate">{c}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${slug}/times`}
                  className="group mt-6 inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all hover:border-[#9810fa] hover:text-[#9810fa]"
                >
                  Ver times
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </motion.aside>
        </div>

        {/* ── BOTTOM: stats strip ─────────────────────────────────── */}
        <motion.div
          className="border-t border-white/[0.08] pt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: E }}
        >
          <div className="grid grid-cols-3 gap-6 sm:gap-12">
            <Stat label="Participantes" value={participantCount} />
            <Stat label="Times" value={teamCount} />
            <Stat label="Critérios" value={criteriaCount} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-4">
      <div className="text-4xl font-black tabular-nums text-white sm:text-5xl">
        <CountingNumber value={value} />
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#636363]">
        {label}
      </div>
    </div>
  )
}
