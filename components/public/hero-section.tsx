'use client'
import { motion } from 'framer-motion'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { CountingNumber } from '@/components/animated/counting-number'
import { HeroGrain } from '@/components/animated/hero-grain'
import { PixelCluster } from '@/components/animated/pixel-cluster'
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
    <section className="relative flex min-h-screen flex-col justify-end pb-16">

      {/* Background — overflow scoped here so pixel clusters can bleed */}
      <div className="absolute inset-0 overflow-hidden">
        <HeroGrain />
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
      </div>

      {/* Logo — centralizada verticalmente na direita, textura de fundo */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden select-none items-center lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      >
        <img
          src="/brand/borderless-logo.svg"
          alt=""
          style={{ height: 'min(55vh, 480px)', width: 'auto', mixBlendMode: 'screen', opacity: 0.35 }}
        />
      </motion.div>

      {/* Pixel accent — top-right, inside padding so it feels intentional */}
      <PixelCluster
        className="absolute right-8 top-28 hidden lg:block"
        cols={4}
        rows={5}
        size={9}
        color="#9810fa"
      />

      {/* Pixel accent — bleeds into next section */}
      <PixelCluster
        className="absolute bottom-0 left-6 z-20 translate-y-1/2"
        cols={4}
        rows={3}
        size={10}
        color="#2DEBB1"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="flex items-end gap-12 lg:gap-16">

          {/* ── Left: editorial text column ── */}
          <div className="min-w-0 flex-1 pb-2 pt-32">

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

            {/* Title */}
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

            {/* Separator */}
            <motion.div
              className="my-10 h-px bg-white/[0.12]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: E }}
            />

            {/* Stats */}
            <motion.div
              className="flex items-center gap-8"
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
            </motion.div>

          </div>{/* /left */}

          {/* ── Right: CTA alinhado com os stats ── */}
          <motion.div
            className="hidden flex-shrink-0 pb-2 lg:block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: E }}
          >
            <Link
              href={`/${slug}/resultados`}
              className="group inline-flex items-center gap-3 border border-[#9810fa] px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-[#9810fa] transition-all duration-200 hover:bg-[#9810fa] hover:text-white active:scale-[0.98]"
            >
              Ver Resultados
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>
      </div>

    </section>
  )
}
