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
          <h1 className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">
            Resultados <span className="text-[#9810fa]">Finais</span>
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">
            {hackathonConfig.edition} · {hackathonConfig.date}
          </p>
        </div>

        {/* Podium */}
        <section className="mb-20">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#9810fa]">Pódio</p>
          <Podium teams={teams} />
        </section>

        {/* Teams Ranking */}
        <section className="mb-20">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Ranking de Times</h2>
          <div className="space-y-4">
            {teams.map((team, i) => (
              <div key={team.id} className={`rounded-2xl transition-colors ${i === 0 ? 'glass-featured p-8' : 'glass p-6'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`font-black tabular-nums leading-none ${
                      team.position === 1 ? 'text-6xl text-[#9810fa]' :
                      team.position === 2 ? 'text-5xl text-[#2debb1]' :
                      team.position === 3 ? 'text-4xl text-white/60' :
                      'text-3xl text-[#636363]'
                    }`}>{team.position}</span>
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
                    <div className={`font-extrabold tabular-nums ${
                      i === 0 ? 'text-3xl' :
                      i === 1 ? 'text-2xl' :
                      'text-xl'
                    }`}>
                      {i === 0 ? (
                        <GradientText>{team.totalScore.toFixed(2)}</GradientText>
                      ) : i === 1 ? (
                        <span className="text-[#2debb1]">{team.totalScore.toFixed(2)}</span>
                      ) : (
                        <span className="text-white/50">{team.totalScore.toFixed(2)}</span>
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
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Leaderboard Individual</h2>
          <div className="glass overflow-hidden rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-widest text-[#636363]">
                  <th scope="col" className="px-6 py-4">#</th>
                  <th scope="col" className="px-6 py-4">Embaixador</th>
                  <th scope="col" className="px-6 py-4">Time</th>
                  <th scope="col" className="px-6 py-4">Presença</th>
                  <th scope="col" className="px-6 py-4">Tasks</th>
                  <th scope="col" className="px-6 py-4">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const team = teams.find(t => t.id === p.teamId)
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        i % 2 === 0 ? 'bg-[#2a2a2b]/50' : 'bg-[#232322]/50'
                      }`}
                    >
                      <td className="px-6 py-4 font-black tabular-nums">
                        <span className={
                          i === 0 ? 'text-[#9810fa]' :
                          i === 1 ? 'text-[#2debb1]' :
                          i === 2 ? 'text-white/60' :
                          'text-[#636363]'
                        }>
                          {i + 1}
                        </span>
                      </td>
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
