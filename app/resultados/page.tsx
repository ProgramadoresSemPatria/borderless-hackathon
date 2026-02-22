import { PublicNavbar } from '@/components/public/navbar'
import { Podium } from '@/components/public/podium'
import { ScoreBar } from '@/components/public/score-bar'
import { GradientText } from '@/components/animated/gradient-text'
import { getRankedTeams, getRankedParticipants, hackathonConfig } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

export default function ResultadosPage() {
  const teams = getRankedTeams()
  const participants = getRankedParticipants()

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-white sm:text-5xl">
            <GradientText>Resultados Finais</GradientText>
          </h1>
          <p className="text-[#b2b2b2]">{hackathonConfig.edition} · {hackathonConfig.date}</p>
        </div>

        {/* Podium */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-xl font-semibold text-white">Pódio</h2>
          <Podium teams={teams} />
        </section>

        {/* Teams Ranking */}
        <section className="mb-20">
          <h2 className="mb-6 text-2xl font-bold text-white">Ranking de Times</h2>
          <div className="space-y-4">
            {teams.map((team, i) => (
              <div key={team.id} className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-[#636363]">#{team.position}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{team.name}</h3>
                      <p className="text-sm text-[#b2b2b2]">{team.project}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {team.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-[#b2b2b2]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold">
                      {i === 0 ? (
                        <GradientText>{team.totalScore.toFixed(2)}</GradientText>
                      ) : (
                        <span className="text-white">{team.totalScore.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="text-xs text-[#636363]">pontuação total</div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {hackathonConfig.criteria.map((criterion, ci) => (
                    <ScoreBar
                      key={criterion}
                      label={criterion}
                      value={team.scores[criterion] ?? 0}
                      color={ci % 2 === 0 ? 'purple' : 'teal'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Individual Leaderboard */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-white">Leaderboard Individual</h2>
          <div className="glass overflow-hidden rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-widest text-[#636363]">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Embaixador</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Presença</th>
                  <th className="px-6 py-4">Tasks</th>
                  <th className="px-6 py-4">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const team = getRankedTeams().find(t => t.id === p.teamId)
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        i % 2 === 0 ? 'bg-[#2a2a2b]/50' : 'bg-[#232322]/50'
                      }`}
                    >
                      <td className="px-6 py-4 text-[#636363] font-bold">{i + 1}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${i === 0 ? 'gradient-brand-text' : 'text-white'}`}>
                          {p.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#b2b2b2]">{team?.name ?? '—'}</td>
                      <td className="px-6 py-4 text-[#2debb1]">{p.metrics.attendance}%</td>
                      <td className="px-6 py-4 text-[#b2b2b2]">{p.metrics.tasksCompleted}</td>
                      <td className="px-6 py-4 font-bold text-white">{p.metrics.totalPoints}</td>
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
