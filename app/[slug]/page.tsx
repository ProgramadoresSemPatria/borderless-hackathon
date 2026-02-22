import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { HeroSection } from '@/components/public/hero-section'
import { PublicNavbar } from '@/components/public/navbar'
import { FadeUp } from '@/components/animated/fade-up'

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const teams = await fetchQuery(api.hackathons.getTeamsRanked, { hackathonId: hackathon._id })
  const participants = await fetchQuery(api.hackathons.getParticipantsRanked, { hackathonId: hackathon._id })

  const topTeam = teams[0]
  const secondTeam = teams[1]
  const mvp = participants[0]

  return (
    <>
      <PublicNavbar slug={slug} />
      <main>
        <HeroSection
          slug={slug}
          name={hackathon.name}
          edition={hackathon.edition}
          date={hackathon.date}
          participantCount={participants.length}
          teamCount={teams.length}
          criteriaCount={hackathon.criteria.length}
        />

        {/* ── Highlights ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <FadeUp>
            <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">
              Destaques do Evento
            </p>
          </FadeUp>

          {/* 1st place — full width */}
          <FadeUp delay={0.05}>
            <div className="mb-3">
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8 transition-colors hover:border-white/[0.15]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-black tabular-nums text-white"
                  style={{ fontSize: '9rem', opacity: 0.04, lineHeight: 1 }}
                >
                  1
                </span>
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">
                      1º Lugar
                    </div>
                    <h3 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                      {topTeam?.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      {topTeam?.project}
                    </p>
                    {topTeam?.description && (
                      <p className="mt-3 line-clamp-2 max-w-lg text-sm text-[#b2b2b2]">
                        {topTeam.description}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 sm:text-right">
                    <div className="text-5xl font-black tabular-nums text-[#9810fa]">
                      {topTeam?.totalScore.toFixed(2)}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      pontuação final
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* 2nd place + MVP */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FadeUp delay={0.1}>
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black tabular-nums text-white"
                  style={{ fontSize: '6rem', opacity: 0.04, lineHeight: 1 }}
                >
                  2
                </span>
                <div className="relative">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">
                    2º Lugar
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-white">
                    {secondTeam?.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                    {secondTeam?.project}
                  </p>
                  {secondTeam?.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-[#b2b2b2]">{secondTeam.description}</p>
                  )}
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <div className="text-3xl font-black tabular-nums text-[#2debb1]">
                      {secondTeam?.totalScore.toFixed(2)}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      pontuação final
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">
                  Embaixador MVP
                </div>
                <h3 className="text-2xl font-black leading-tight text-white">{mvp?.name}</h3>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                  Maior pontuação individual
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4">
                  <div>
                    <div className="text-2xl font-black tabular-nums text-[#9810fa]">
                      {mvp?.metrics.totalPoints}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      Pontos
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black tabular-nums text-white">
                      {mvp?.metrics.attendance}%
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      Presença
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>
    </>
  )
}
