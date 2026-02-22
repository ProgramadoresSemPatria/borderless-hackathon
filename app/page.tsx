import { AuroraBackground } from '@/components/animated/aurora-background'
import { BlurText } from '@/components/animated/blur-text'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { CountingNumber } from '@/components/animated/counting-number'
import { GradientText } from '@/components/animated/gradient-text'
import { PublicNavbar } from '@/components/public/navbar'
import { getRankedTeams, getRankedParticipants, hackathonConfig, participants, teams } from '@/lib/mock-data'
import Link from 'next/link'
import { Trophy, Users, Code2, ArrowRight } from 'lucide-react'

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
              className="mb-4 justify-center text-5xl font-extrabold leading-tight text-white sm:text-7xl"
              animateBy="words"
            />

            <p className="mb-8 max-w-xl text-lg text-[#b2b2b2]">
              {hackathonConfig.date} · Comunidade de Embaixadores Borderless
            </p>

            {/* Stats */}
            <div className="mb-12 flex flex-wrap justify-center gap-8">
              {[
                { label: 'Times', value: teams.length, icon: Code2 },
                { label: 'Participantes', value: participants.length, icon: Users },
                { label: 'Critérios', value: hackathonConfig.criteria.length, icon: Trophy },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5 text-[#9810fa]" />
                  <span className="text-4xl font-bold text-white">
                    <CountingNumber value={value} />
                  </span>
                  <span className="text-sm text-[#b2b2b2]">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/resultados"
              className="group flex items-center gap-2 rounded-full bg-[#9810fa] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#b040ff] hover:shadow-lg hover:shadow-[#9810fa]/30"
            >
              Ver Resultados
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </AuroraBackground>

        {/* Highlights */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Destaques do Evento
          </h2>

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
