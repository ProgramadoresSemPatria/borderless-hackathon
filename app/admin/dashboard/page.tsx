'use client'
import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { HackathonSelector, useSelectedHackathon } from '@/components/admin/hackathon-selector'
import { Badge } from '@/components/ui/badge'
import { FadeUp } from '@/components/animated/fade-up'
import { CountingNumber } from '@/components/animated/counting-number'
import { Trophy, Users, Code2, Star, Vote, Heart, type LucideIcon } from 'lucide-react'

function rankColor(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

function statusBadge(status: string) {
  switch (status) {
    case 'live':
      return <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px]">Em andamento</Badge>
    case 'upcoming':
      return <Badge className="border-yellow-500/30 bg-yellow-500/15 text-yellow-400 text-[10px]">Em breve</Badge>
    case 'finished':
      return <Badge className="border-white/20 bg-white/10 text-[#b2b2b2] text-[10px]">Finalizado</Badge>
    default:
      return null
  }
}

export default function AdminDashboardPage() {
  const [selectedId, setSelectedId] = useState<Id<'hackathons'> | null>(null)
  const handleChange = useCallback((id: Id<'hackathons'> | null) => setSelectedId(id), [])
  const hackathon = useSelectedHackathon(selectedId)

  const rankedTeams = useQuery(
    api.hackathons.getTeamsRanked,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )
  const rankedParticipants = useQuery(
    api.hackathons.getParticipantsRanked,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )
  const voteCounts = useQuery(
    api.hackathons.getVoteCounts,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )
  const toggleVoting = useMutation(api.mutations.toggleVoting)

  const totalMembers = useMemo(
    () => rankedTeams?.reduce((sum, t) => sum + t.memberNames.length, 0) ?? 0,
    [rankedTeams],
  )

  const avgAttendance = useMemo(() => {
    if (!rankedParticipants || rankedParticipants.length === 0) return 0
    return Math.round(rankedParticipants.reduce((sum, p) => sum + p.metrics.attendance, 0) / rankedParticipants.length)
  }, [rankedParticipants])

  const avgTeamScore = useMemo(() => {
    if (!rankedTeams || rankedTeams.length === 0) return 0
    return parseFloat((rankedTeams.reduce((sum, t) => sum + t.totalScore, 0) / rankedTeams.length).toFixed(2))
  }, [rankedTeams])

  const topIndividualScore = useMemo(() => {
    if (!rankedParticipants || rankedParticipants.length === 0) return 0
    return Math.max(...rankedParticipants.map(p => p.metrics.totalPoints))
  }, [rankedParticipants])

  type SummaryCard = { label: string; value: number; sub?: string; icon: LucideIcon; color: string; badge?: React.ReactNode; decimals?: number }
  const summaryCards: SummaryCard[] = [
    { label: 'Times', value: rankedTeams?.length ?? 0, sub: `${totalMembers} membros total`, icon: Code2, color: '#9810fa' },
    { label: 'Participantes', value: rankedParticipants?.length ?? 0, sub: `média ${avgAttendance}% presença`, icon: Users, color: '#9810fa' },
    { label: 'Critérios', value: hackathon?.criteria.length ?? 0, icon: Star, color: '#9810fa' },
    { label: 'Status', value: 0, icon: Trophy, color: '#9810fa', badge: hackathon ? statusBadge(hackathon.status) : null },
  ]

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Dashboard</h1>
      <HackathonSelector value={selectedId} onChange={handleChange} />

      {hackathon && (
        <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
          {hackathon.name} · {hackathon.edition}
        </p>
      )}

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map(({ label, value, sub, icon: Icon, color, badge, decimals }, i) => (
          <FadeUp key={label} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded border" style={{ borderColor: `${color}30`, backgroundColor: `${color}15` }}>
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div className="mt-auto">
                {badge ? (
                  <div className="mb-1">{badge}</div>
                ) : (
                  <div className="font-black tabular-nums text-white leading-none text-4xl">
                    <CountingNumber value={value} decimals={decimals ?? 0} />
                  </div>
                )}
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">{label}</div>
                <div className="mt-0.5 text-[10px] text-[#636363]">{sub ?? '\u00A0'}</div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Quick stats row */}
      {selectedId && rankedTeams && rankedParticipants && (rankedTeams.length > 0 || rankedParticipants.length > 0) && (
        <FadeUp delay={0.3}>
          <div className="mb-6 grid grid-cols-3 rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
            <div className="px-6 py-4">
              <div className="text-lg font-black tabular-nums text-white">
                <CountingNumber value={avgTeamScore} decimals={2} />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Score médio</div>
            </div>
            <div className="border-x border-white/[0.08] px-6 py-4">
              <div className="text-lg font-black tabular-nums text-white">
                <CountingNumber value={topIndividualScore} />
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Melhor pontuação</div>
            </div>
            <div className="px-6 py-4">
              <div className="text-lg font-black tabular-nums text-white">
                <CountingNumber value={avgAttendance} />%
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Presença média</div>
            </div>
          </div>
        </FadeUp>
      )}

      {!selectedId && (
        <p className="text-sm text-[#636363]">Selecione um hackathon para ver os dados.</p>
      )}

      {/* Voting control */}
      {selectedId && hackathon && (
        <FadeUp delay={0.35}>
          <div className="mb-6 rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded border border-[#9810fa]/30 bg-[#9810fa]/15">
                  <Vote className="h-5 w-5 text-[#9810fa]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Voto Popular</h2>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                    {hackathon.votingOpen ? 'Aberto' : 'Fechado'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleVoting({ hackathonId: hackathon._id, votingOpen: !hackathon.votingOpen })}
                className={`relative h-7 w-12 rounded-full border transition-colors ${
                  hackathon.votingOpen
                    ? 'border-[#9810fa]/30 bg-[#9810fa]'
                    : 'border-white/10 bg-white/10'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all shadow-sm ${
                    hackathon.votingOpen ? 'left-[22px]' : 'left-[2px]'
                  }`}
                />
              </button>
            </div>

            {voteCounts && voteCounts.some(v => v.voteCount > 0) && (
              <div className="space-y-2">
                {voteCounts.filter(v => v.voteCount > 0).map((entry, i) => (
                  <div key={entry.teamId} className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-sm font-black ${
                        i === 0 ? 'text-[#9810fa]' : i === 1 ? 'text-[#2debb1]' : 'text-[#636363]'
                      }`}>#{i + 1}</span>
                      <span className="text-sm font-semibold text-white">{entry.teamName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className={`h-3.5 w-3.5 ${i === 0 ? 'fill-[#9810fa]/30 text-[#9810fa]' : 'text-[#636363]'}`} />
                      <span className="text-sm font-black tabular-nums text-white">{entry.voteCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {voteCounts && !voteCounts.some(v => v.voteCount > 0) && (
              <p className="text-sm text-[#636363]">Nenhum voto registrado ainda.</p>
            )}
          </div>
        </FadeUp>
      )}

      {selectedId && rankedTeams && rankedParticipants && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Teams */}
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Top Times</h2>
            <div>
              {rankedTeams.slice(0, 5).map((team, i) => (
                <FadeUp key={team._id} delay={i * 0.05}>
                  <div className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0 hover:bg-white/[0.04] -mx-2 px-2 rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-sm font-black ${rankColor(team.position ?? 4)}`}>#{team.position ?? '-'}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">{team.name}</div>
                        <div className="text-xs text-[#636363]">
                          {team.project} · {team.memberNames.length} membro{team.memberNames.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <span className={`font-black tabular-nums ${rankColor(team.position ?? 4)}`}>{team.totalScore.toFixed(2)}</span>
                  </div>
                </FadeUp>
              ))}
              {rankedTeams.length === 0 && (
                <p className="text-sm text-[#636363]">Nenhum time cadastrado.</p>
              )}
            </div>
          </div>

          {/* Top Participants */}
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Top Participantes</h2>
            <div>
              {rankedParticipants.slice(0, 5).map((p, i) => {
                const team = rankedTeams?.find(t => t._id === p.teamId)
                return (
                  <FadeUp key={p._id} delay={i * 0.05}>
                    <div className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0 hover:bg-white/[0.04] -mx-2 px-2 rounded transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-5 text-sm font-black ${rankColor(i + 1)}`}>#{i + 1}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{p.name}</span>
                            {p.role && (
                              <Badge variant="outline" className="border-white/10 text-[10px] text-[#636363] font-normal px-1.5 py-0">{p.role}</Badge>
                            )}
                          </div>
                          {team && <div className="text-xs text-[#636363]">{team.name}</div>}
                        </div>
                      </div>
                      <span className="font-black tabular-nums text-white">
                        {p.metrics.totalPoints} <span className="text-[#636363] font-semibold">pts</span>
                      </span>
                    </div>
                  </FadeUp>
                )
              })}
              {rankedParticipants.length === 0 && (
                <p className="text-sm text-[#636363]">Nenhum participante cadastrado.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
