import { PublicNavbar } from '@/components/public/navbar'
import { Podium } from '@/components/public/podium'
import { ScoreBar } from '@/components/public/score-bar'
import { getRankedTeams, getRankedParticipants, hackathonConfig } from '@/lib/mock-data'

function rankColor(position: number | null) {
  if (position === null) return 'text-[#636363]'
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default function ResultadosPage() {
  const teams = getRankedTeams()
  const participants = getRankedParticipants()

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">
            Resultados <span className="text-[#9810fa]">Finais</span>
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">
            {hackathonConfig.edition} · {hackathonConfig.date}
          </p>
        </div>

        {/* Podium */}
        <section className="mb-20">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#9810fa]">Pódio</p>
          <Podium teams={teams} />
        </section>

        {/* Teams Ranking */}
        <section className="mb-20">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Ranking de Times</h2>
          <div className="space-y-3">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <span className={`flex-shrink-0 font-black tabular-nums leading-none ${
                      team.position === 1 ? 'text-4xl text-[#9810fa]' :
                      team.position === 2 ? 'text-3xl text-[#2debb1]' :
                      team.position === 3 ? 'text-2xl text-white/60' :
                      'text-xl text-[#636363]'
                    }`}>{team.position}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <h3 className="text-lg font-black text-white leading-tight">{team.name}</h3>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{team.project}</span>
                      </div>
                      {team.description && (
                        <p className="mt-1.5 line-clamp-1 text-sm text-[#b2b2b2]">{team.description}</p>
                      )}
                      {team.tags && team.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {team.tags.map(tag => (
                            <span key={tag} className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className={`font-black tabular-nums leading-none ${
                      team.position === 1 ? 'text-3xl' :
                      team.position === 2 ? 'text-2xl' :
                      'text-xl'
                    } ${rankColor(team.position)}`}>
                      {team.totalScore.toFixed(2)}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">pontuação total</div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="mt-5 border-t border-white/[0.06] pt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                  {hackathonConfig.criteria.map((criterion) => (
                    <ScoreBar
                      key={criterion}
                      label={criterion}
                      value={team.scores[criterion] ?? 0}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Individual Leaderboard */}
        <section>
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Leaderboard Individual</h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">#</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Embaixador</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Time</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Presença</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Tasks</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const team = teams.find(t => t.id === p.teamId)
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.06]"
                    >
                      <td className="px-6 py-4 text-sm font-black tabular-nums">
                        <span className={rankColor(i + 1)}>{i + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">{p.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#636363]">{team?.name ?? '—'}</td>
                      <td className="px-6 py-4 font-semibold tabular-nums text-white">{p.metrics.attendance}%</td>
                      <td className="px-6 py-4 text-[#b2b2b2]">{p.metrics.tasksCompleted}</td>
                      <td className="px-6 py-4 font-black tabular-nums text-white">{p.metrics.totalPoints}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}
