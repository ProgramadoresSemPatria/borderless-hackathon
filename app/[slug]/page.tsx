import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { HeroGrain } from '@/components/animated/hero-grain'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { CountingNumber } from '@/components/animated/counting-number'
import { PublicNavbar } from '@/components/public/navbar'
import { FadeUp } from '@/components/animated/fade-up'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative flex min-h-screen items-end overflow-hidden pb-16">
          <HeroGrain />

          {/* Vignette: edges darker than center */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(34,34,34,0.6) 100%)',
            }}
          />

          {/* Logo mark — large, right side */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 hidden h-full items-center justify-end pr-8 lg:flex xl:pr-16"
          >
            <img
              src="/brand/borderless-logo.svg"
              alt=""
              className="w-auto"
              style={{ height: 'min(58vh, 520px)' }}
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-2 pt-32 lg:max-w-[56%]">
            {/* Eyebrow */}
            <div className="mb-8 flex items-center gap-4">
              <img
                src="/brand/icon.png"
                alt="Borderless"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="h-px w-8 bg-white/[0.12]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#636363]">
                Borderless Coding
              </span>
              <span className="h-px w-8 bg-white/[0.12]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9810fa]">
                {hackathon.edition}
              </span>
            </div>

            {/* Title */}
            <HeroReveal
              text={hackathon.name}
              align="left"
              className="mb-4 text-[clamp(2.75rem,9vw,7.5rem)] font-black leading-[0.88] tracking-tight text-white"
            />

            {/* Date */}
            <p className="mb-16 text-xs font-bold uppercase tracking-[0.3em] text-[#636363]">
              {hackathon.date}
            </p>

            {/* Stats + CTA */}
            <div className="flex flex-wrap items-center gap-8 border-t border-white/[0.08] pt-8">
              <div>
                <div className="text-3xl font-black tabular-nums text-white">
                  <CountingNumber value={participants.length} />
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">
                  Participantes
                </div>
              </div>
              <div className="h-8 w-px bg-white/[0.08]" />
              <div>
                <div className="text-3xl font-black tabular-nums text-white">
                  <CountingNumber value={teams.length} />
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">
                  Times
                </div>
              </div>
              <div className="h-8 w-px bg-white/[0.08]" />
              <div>
                <div className="text-3xl font-black tabular-nums text-white">
                  <CountingNumber value={hackathon.criteria.length} />
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
            </div>
          </div>
        </section>

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
