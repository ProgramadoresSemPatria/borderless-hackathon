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
  { label: 'Participantes', value: participants.length, icon: Users, color: '#2debb1' },
  { label: 'Critérios', value: hackathonConfig.criteria.length, icon: Star, color: '#9810fa' },
  {
    label: 'Status',
    value: hackathonConfig.status === 'finished' ? 'Finalizado' : 'Em andamento',
    icon: Trophy,
    color: '#2debb1',
    isText: true,
  },
]

export default function AdminDashboardPage() {
  const rankedTeams = getRankedTeams()
  const rankedParticipants = getRankedParticipants()

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">
        Dashboard
      </h1>
      <p className="mb-8 text-[#b2b2b2]">{hackathonConfig.name} · {hackathonConfig.edition}</p>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon, color, isText }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className={`font-bold text-white ${isText ? 'text-base' : 'text-3xl'}`}>{value}</div>
            <div className="mt-1 text-sm text-[#636363]">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Teams */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-white">Top Times</h2>
          <div className="space-y-3">
            {rankedTeams.slice(0, 5).map((team) => (
              <div key={team.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm font-bold text-[#636363]">#{team.position ?? '-'}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{team.name}</div>
                    <div className="text-xs text-[#b2b2b2]">{team.project}</div>
                  </div>
                </div>
                <span className="font-bold text-[#9810fa]">{team.totalScore.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Participants */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-white">Top Participantes</h2>
          <div className="space-y-3">
            {rankedParticipants.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm font-bold text-[#636363]">#{i + 1}</span>
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                </div>
                <span className="font-bold text-[#2debb1]">{p.metrics.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
