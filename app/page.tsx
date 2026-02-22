import { AuroraBackground } from '@/components/animated/aurora-background'
import { BlurText } from '@/components/animated/blur-text'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { CountingNumber } from '@/components/animated/counting-number'
import { PublicNavbar } from '@/components/public/navbar'
import { getRankedTeams, getRankedParticipants, hackathonConfig, participants, teams } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const rankedTeams = getRankedTeams()
  const rankedParticipants = getRankedParticipants()
  const topTeam = rankedTeams[0]
  const mvp = rankedParticipants[0]

  return (
    <>
      <PublicNavbar />
      <main>
        {/* Hero */}
        <AuroraBackground>
          <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
            <span className="mb-4 inline-block rounded-full border border-[#9810fa]/30 bg-[#9810fa]/10 px-4 py-1.5 text-sm font-medium text-[#9810fa]">
              {hackathonConfig.edition}
            </span>

            <BlurText
              text={hackathonConfig.name}
              className="mb-4 justify-center text-6xl font-black leading-none tracking-tight text-white sm:text-8xl lg:text-9xl"
              animateBy="words"
            />

            <p className="mb-8 max-w-xl text-lg text-[#b2b2b2]">
              {hackathonConfig.date} · Comunidade de Embaixadores Borderless
            </p>

            {/* Stats — skyline hierarchy: one dominant, two supporting */}
            <div className="mb-12 flex flex-wrap items-end justify-center gap-10">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-7xl font-black leading-none tabular-nums text-white">
                  <CountingNumber value={participants.length} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9810fa]">Participantes</span>
              </div>
              <div className="mb-4 flex flex-col items-center gap-1">
                <span className="text-4xl font-black leading-none tabular-nums text-white/70">
                  <CountingNumber value={teams.length} />
                </span>
                <span className="text-xs text-[#b2b2b2]">Times</span>
              </div>
              <div className="mb-4 flex flex-col items-center gap-1">
                <span className="text-4xl font-black leading-none tabular-nums text-white/70">
                  <CountingNumber value={hackathonConfig.criteria.length} />
                </span>
                <span className="text-xs text-[#b2b2b2]">Critérios</span>
              </div>
            </div>

            <Link
              href="/resultados"
              className="group flex items-center gap-2 rounded-full bg-[#9810fa] px-10 py-4 text-base font-bold tracking-wide text-white transition-all duration-200 hover:bg-[#9810fa]/90 hover:shadow-2xl hover:shadow-[#9810fa]/40 active:scale-[0.98]"
            >
              Ver Resultados
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </AuroraBackground>

        {/* Highlights */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">
            Destaques do Evento
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 1st place */}
            <SpotlightCard className="p-6" spotlightColor="rgba(152,16,250,0.2)">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9810fa]">
                🥇 1º Lugar
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{topTeam?.name}</h3>
              <p className="mb-3 text-sm text-[#b2b2b2]">{topTeam?.project}</p>
              <div className="gradient-brand-text text-3xl font-extrabold">
                {topTeam?.totalScore.toFixed(2)}
              </div>
            </SpotlightCard>

            {/* 2nd place */}
            <SpotlightCard className="p-6" spotlightColor="rgba(45,235,177,0.2)">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2debb1]">
                🥈 2º Lugar
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{rankedTeams[1]?.name}</h3>
              <p className="mb-3 text-sm text-[#b2b2b2]">{rankedTeams[1]?.project}</p>
              <div className="text-3xl font-extrabold text-[#2debb1]">
                {rankedTeams[1]?.totalScore.toFixed(2)}
              </div>
            </SpotlightCard>

            {/* MVP Ambassador */}
            <SpotlightCard className="p-6" spotlightColor="rgba(152,16,250,0.15)">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9810fa]">
                ⭐ Embaixador MVP
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{mvp?.name}</h3>
              <p className="mb-3 text-sm text-[#b2b2b2]">
                {mvp?.metrics.totalPoints} pontos totais
              </p>
              <div className="gradient-brand-text text-3xl font-extrabold">
                {mvp?.metrics.attendance}% presença
              </div>
            </SpotlightCard>
          </div>
        </section>
      </main>
    </>
  )
}
