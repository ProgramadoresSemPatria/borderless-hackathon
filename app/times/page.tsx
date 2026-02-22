import { PublicNavbar } from '@/components/public/navbar'
import { getRankedTeams, getTeamParticipants } from '@/lib/mock-data'
import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

function rankColor(position: number | null) {
  if (position === null) return 'text-[#636363]'
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default function TimesPage() {
  const teams = getRankedTeams()

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">
            Times
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">Todos os times participantes</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teams.map((team) => {
            const members = getTeamParticipants(team.id)
            return (
              <Link key={team.id} href={`/times/${team.id}`} className="group block">
                <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      {team.position && (
                        <div className={`mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] ${rankColor(team.position)}`}>
                          #{team.position} no ranking
                        </div>
                      )}
                      <h3 className="font-black text-xl text-white leading-tight">{team.name}</h3>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{team.project}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-extrabold tabular-nums ${rankColor(team.position ?? 4)}`}>
                        {team.totalScore.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">score</div>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-[#b2b2b2] line-clamp-2">{team.description}</p>

                  <div className="mb-4 flex flex-wrap gap-1">
                    {team.tags?.map(tag => (
                      <span key={tag} className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                    <div className="flex items-center gap-1.5 text-sm text-[#636363]">
                      <Users className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{members.map(m => m.name).join(', ')}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[#636363] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}
