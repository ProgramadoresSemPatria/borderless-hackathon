'use client'
import { useState } from 'react'
import { teams as initialTeams, hackathonConfig } from '@/lib/mock-data'
import { TeamEditDialog } from '@/components/admin/team-edit-dialog'
import { Button } from '@/components/ui/button'
import type { Team } from '@/lib/types'
import { Pencil } from 'lucide-react'

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  function handleSave(updated: Team) {
    setTeams(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-black text-white">
        Times
      </h1>

      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Time</th>
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Projeto</th>
              {hackathonConfig.criteria.map(c => (
                <th scope="col" key={c} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">{c}</th>
              ))}
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Total</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.05]"
              >
                <td className="px-6 py-4 font-semibold text-white">{team.name}</td>
                <td className="px-6 py-4 text-[#b2b2b2]">{team.project}</td>
                {hackathonConfig.criteria.map(c => (
                  <td key={c} className="px-4 py-4 text-center tabular-nums text-[#b2b2b2] text-sm">
                    {team.scores[c]?.toFixed(1) ?? '—'}
                  </td>
                ))}
                <td className="px-6 py-4 font-black tabular-nums text-white text-sm">{team.totalScore.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingTeam(team)}
                    aria-label={`Editar ${team.name}`}
                    className="h-7 w-7 p-0 rounded text-[#636363] hover:text-white hover:bg-white/10"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TeamEditDialog
        key={editingTeam?.id}
        team={editingTeam}
        open={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        onSave={handleSave}
      />
    </div>
  )
}
