import { teams, participants, hackathonConfig, getRankedTeams, getRankedParticipants } from '@/lib/mock-data'
import { Trophy, Users, Code2, Star, type LucideIcon } from 'lucide-react'

type SummaryCard = {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  isText?: boolean
}

const summaryCards: SummaryCard[] = [
  { label: 'Times', value: teams.length, icon: Code2, color: '#9810fa' },
  { label: 'Participantes', value: participants.length, icon: Users, color: '#9810fa' },
  { label: 'Critérios', value: hackathonConfig.criteria.length, icon: Star, color: '#9810fa' },
  {
    label: 'Status',
    value: hackathonConfig.status === 'finished' ? 'Finalizado' : 'Em andamento',
    icon: Trophy,
    color: '#9810fa',
    isText: true,
  },
]

function rankColor(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default function AdminDashboardPage() {
  const rankedTeams = getRankedTeams()
  const rankedParticipants = getRankedParticipants()

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">
        Dashboard
      </h1>
      <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
        {hackathonConfig.name} · {hackathonConfig.edition}
      </p>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon, color, isText }) => (
          <div key={label} className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded border" style={{ borderColor: `${color}30`, backgroundColor: `${color}15` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className={`font-black tabular-nums text-white leading-none ${isText ? 'text-base' : 'text-4xl'}`}>{value}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Teams */}
        <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Top Times</h2>
          <div>
            {rankedTeams.slice(0, 5).map((team) => (
              <div key={team.id} className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0 hover:bg-white/[0.04] -mx-2 px-2 rounded transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-sm font-black ${rankColor(team.position ?? 4)}`}>#{team.position ?? '-'}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{team.name}</div>
                    <div className="text-xs text-[#b2b2b2]">{team.project}</div>
                  </div>
                </div>
                <span className={`font-black tabular-nums ${rankColor(team.position ?? 4)}`}>{team.totalScore.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Participants */}
        <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
          <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Top Participantes</h2>
          <div>
            {rankedParticipants.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0 hover:bg-white/[0.04] -mx-2 px-2 rounded transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-sm font-black ${rankColor(i + 1)}`}>#{i + 1}</span>
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                </div>
                <span className="font-black tabular-nums text-white">
                  {p.metrics.totalPoints} <span className="text-[#636363] font-semibold">pts</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
