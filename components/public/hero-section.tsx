'use client'
import { motion } from 'framer-motion'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { CountingNumber } from '@/components/animated/counting-number'
import { HeroGrain } from '@/components/animated/hero-grain'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const E = [0.16, 1, 0.3, 1] as const

interface HeroSectionProps {
  slug: string
  name: string
  edition: string
  date: string
  participantCount: number
  teamCount: number
  criteriaCount: number
}

export function HeroSection({
  slug, name, edition, date,
  participantCount, teamCount, criteriaCount,
}: HeroSectionProps) {
  const year = date.match(/\d{4}/)?.[0] ?? ''

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden pb-16">
      <HeroGrain />

      {/* Year watermark — fills background with depth */}
      {year && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        >
          <span
            className="font-black leading-none tracking-tight text-white"
            style={{ fontSize: 'clamp(10rem, 30vw, 28rem)', opacity: 0.028 }}
          >
            {year}
          </span>
        </div>
      )}

      {/* Borderless logo — bottom-right, anchored to same baseline as text */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden items-end pb-16 pr-10 lg:flex xl:pr-20"
        initial={{ opacity: 0, x: 56 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.1, ease: E }}
      >
        <img
          src="/brand/borderless-logo.svg"
          alt=""
          className="w-auto"
          style={{ height: 'min(72vh, 640px)', mixBlendMode: 'screen' }}
        />
      </motion.div>

      {/* Text content — genuine left-align, capped so it doesn't reach the logo */}
      <div className="relative z-10 w-full px-6 pb-2 pt-32 lg:max-w-[58%]">

        {/* Eyebrow */}
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0, ease: E }}
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
          <span className="h-px w-6 flex-shrink-0 bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9810fa]">
            {edition}
          </span>
        </motion.div>

        {/* Title — words reveal after eyebrow */}
        <HeroReveal
          text={name}
          align="left"
          delay={0.1}
          className="mb-4 text-[clamp(2.5rem,7vw,6.5rem)] font-black leading-[0.88] tracking-tight text-white"
        />

        {/* Date */}
        <motion.p
          className="text-xs font-bold uppercase tracking-[0.3em] text-[#636363]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          {date}
        </motion.p>

        {/* Animated rule */}
        <motion.div
          className="my-8 h-px bg-white/[0.08]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: E }}
        />

        {/* Stats + CTA */}
        <motion.div
          className="flex flex-wrap items-center gap-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: E }}
        >
          <div>
            <div className="text-3xl font-black tabular-nums text-white">
              <CountingNumber value={participantCount} />
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">
              Participantes
            </div>
          </div>
          <div className="h-8 w-px bg-white/[0.08]" />
          <div>
            <div className="text-3xl font-black tabular-nums text-white">
              <CountingNumber value={teamCount} />
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">
              Times
            </div>
          </div>
          <div className="h-8 w-px bg-white/[0.08]" />
          <div>
            <div className="text-3xl font-black tabular-nums text-white">
              <CountingNumber value={criteriaCount} />
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">
              Critérios
            </div>
          </div>
          <div className="ml-auto">
            <Link
              href={`/${slug}/resultados`}
              className="group inline-flex items-center gap-3 border border-[#9810fa] px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-[#9810fa] transition-all duration-200 hover:bg-[#9810fa] hover:text-white active:scale-[0.98]"
            >
              Ver Resultados
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
