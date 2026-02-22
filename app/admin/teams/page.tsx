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
      <h1 className="mb-8 text-2xl font-bold text-white">
        Times
      </h1>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-widest text-[#636363]">
              <th scope="col" className="px-6 py-4">Time</th>
              <th scope="col" className="px-6 py-4">Projeto</th>
              {hackathonConfig.criteria.map(c => (
                <th scope="col" key={c} className="px-4 py-4">{c}</th>
              ))}
              <th scope="col" className="px-6 py-4">Total</th>
              <th scope="col" className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <tr
                key={team.id}
                className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#2a2a2b]/50' : 'bg-[#232322]/50'}`}
              >
                <td className="px-6 py-4 font-semibold text-white">{team.name}</td>
                <td className="px-6 py-4 text-[#b2b2b2]">{team.project}</td>
                {hackathonConfig.criteria.map(c => (
                  <td key={c} className="px-4 py-4 text-center text-[#2debb1]">
                    {team.scores[c]?.toFixed(1) ?? '—'}
                  </td>
                ))}
                <td className="px-6 py-4 font-bold text-[#9810fa]">{team.totalScore.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingTeam(team)}
                    aria-label={`Editar ${team.name}`}
                    className="h-8 w-8 p-0 text-[#b2b2b2] hover:text-white"
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
