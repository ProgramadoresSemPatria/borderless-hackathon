import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { BlurText } from '@/components/animated/blur-text'
import { FadeUp } from '@/components/animated/fade-up'
import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

function rankColor(position: number | null) {
  if (position === null) return 'text-[#636363]'
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default async function SlugTimesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const teams = await fetchQuery(api.hackathons.getTeamsRanked, { hackathonId: hackathon._id })

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <HeroReveal
            text="Times"
            className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl"
          />
          <BlurText
            text="Todos os times participantes"
            className="justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]"
            delay={0.04}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {teams.map((team, i) => (
            <FadeUp key={team._id} delay={i * 0.05}>
              <Link href={`/${slug}/times/${team._id}`} className="group block h-full">
                <div className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      {team.position && (
                        <div className={`mb-2 text-[10px] font-black uppercase tracking-[0.15em] ${rankColor(team.position)}`}>
                          #{team.position} no ranking
                        </div>
                      )}
                      <h3 className="text-xl font-black leading-tight text-white">{team.name}</h3>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                        {team.project}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-extrabold tabular-nums ${rankColor(team.position ?? null)}`}>
                        {team.totalScore.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                        score
                      </div>
                    </div>
                  </div>

                  {team.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-[#b2b2b2]">{team.description}</p>
                  )}

                  {team.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {team.tags.map(tag => (
                        <span
                          key={tag}
                          className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-1.5 text-sm text-[#636363]">
                      <Users className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{team.memberNames.join(', ')}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[#636363] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </main>
    </>
  )
}
