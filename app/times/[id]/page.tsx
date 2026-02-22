import { PublicNavbar } from '@/components/public/navbar'
import { ScoreBar } from '@/components/public/score-bar'
import { getTeamById, getTeamParticipants, hackathonConfig } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = getTeamById(id)
  if (!team) return notFound()

  const members = getTeamParticipants(team.id)

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <Link
          href="/times"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#b2b2b2] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para times
        </Link>

        {/* Header */}
        <div className="glass mb-8 rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {team.position && (
                <span className="mb-2 inline-block rounded-full bg-[#9810fa]/20 px-3 py-1 text-xs font-bold text-[#9810fa]">
                  #{team.position} lugar
                </span>
              )}
              <h1 className="mb-1 text-3xl font-extrabold text-white">{team.name}</h1>
              <p className="mb-3 text-xl font-semibold text-[#2debb1]">{team.project}</p>
              <p className="mb-4 text-[#b2b2b2]">{team.description}</p>
              <div className="flex flex-wrap gap-2">
                {team.tags?.map(tag => (
                  <Badge key={tag} className="bg-white/10 text-[#b2b2b2]">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-[#9810fa]">
                {team.totalScore.toFixed(2)}
              </div>
              <div className="text-sm text-[#636363]">pontuação final</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Scores */}
          <div className="glass rounded-2xl p-6">
            <h2 className="mb-6 text-lg font-bold text-white">Critérios de Avaliação</h2>
            <div className="space-y-4">
              {hackathonConfig.criteria.map((criterion, i) => (
                <ScoreBar
                  key={criterion}
                  label={criterion}
                  value={team.scores[criterion] ?? 0}
                  color={i % 2 === 0 ? 'purple' : 'teal'}
                />
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="glass rounded-2xl p-6">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <Users className="h-5 w-5 text-[#9810fa]" />
              Membros ({members.length})
            </h2>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-xs text-[#b2b2b2]">
                      {member.metrics.tasksCompleted} tasks · {member.metrics.attendance}% presença
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#2debb1]">{member.metrics.totalPoints}</div>
                    <div className="text-xs text-[#636363]">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
