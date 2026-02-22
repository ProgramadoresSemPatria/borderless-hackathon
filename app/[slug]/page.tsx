import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { HeroSection } from '@/components/public/hero-section'
import { PublicNavbar } from '@/components/public/navbar'
import { FadeUp } from '@/components/animated/fade-up'
import { CountingNumber } from '@/components/animated/counting-number'

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
          {/* Section label — left-aligned with extending rule */}
          <FadeUp>
            <div className="mb-12 flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#636363]">Destaques</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </FadeUp>

          {/* 1st place — winner card */}
          <FadeUp delay={0.05}>
            <div className="mb-3 overflow-hidden rounded-xl border border-[#9810fa]/25 bg-[#2a2a2b] transition-colors hover:border-[#9810fa]/45">
              {/* Top accent line */}
              <div className="h-0.5 w-full bg-[#9810fa]" />
              <div className="flex items-center gap-6 p-8">
                {/* Rank */}
                <span
                  className="flex-shrink-0 font-black tabular-nums leading-none text-[#9810fa]"
                  style={{ fontSize: '5rem', opacity: 0.9 }}
                >
                  1
                </span>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#9810fa]">
                    1º Lugar
                  </div>
                  <h3 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                    {topTeam?.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                    {topTeam?.project}
                  </p>
                  {topTeam?.description && (
                    <p className="mt-2 line-clamp-1 max-w-lg text-sm text-[#b2b2b2]">
                      {topTeam.description}
                    </p>
                  )}
                </div>
                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-5xl font-black tabular-nums text-[#9810fa]">
                    <CountingNumber value={topTeam?.totalScore ?? 0} decimals={2} />
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                    pontuação
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* 2nd place + MVP */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FadeUp delay={0.1}>
              <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b] transition-colors hover:border-white/[0.15]">
                <div className="h-0.5 w-full bg-[#2debb1]" />
                <div className="flex items-start gap-5 p-6">
                  <span
                    className="flex-shrink-0 font-black tabular-nums leading-none text-[#2debb1]"
                    style={{ fontSize: '3rem' }}
                  >
                    2
                  </span>
                  <div className="min-w-0">
                    <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#2debb1]">
                      2º Lugar
                    </div>
                    <h3 className="text-xl font-black leading-tight text-white">
                      {secondTeam?.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      {secondTeam?.project}
                    </p>
                    <div className="mt-4 border-t border-white/[0.06] pt-3">
                      <span className="text-2xl font-black tabular-nums text-[#2debb1]">
                        <CountingNumber value={secondTeam?.totalScore ?? 0} decimals={2} />
                      </span>
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                        pts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b] transition-colors hover:border-white/[0.15]">
                <div className="h-0.5 w-full bg-white/20" />
                <div className="p-6">
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#636363]">
                    MVP
                  </div>
                  <h3 className="text-xl font-black leading-tight text-white">{mvp?.name}</h3>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                    Embaixador de maior destaque
                  </p>
                  <div className="mt-4 flex gap-8 border-t border-white/[0.06] pt-3">
                    <div>
                      <div className="text-2xl font-black tabular-nums text-[#9810fa]">
                        <CountingNumber value={mvp?.metrics.totalPoints ?? 0} />
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                        pontos
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-black tabular-nums text-white">
                        <CountingNumber value={mvp?.metrics.attendance ?? 0} />%
                      </div>
                      <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                        presença
                      </div>
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
