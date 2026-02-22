'use client'
import { useState } from 'react'
import { participants as initialParticipants, teams } from '@/lib/mock-data'
import { ParticipantEditDialog } from '@/components/admin/participant-edit-dialog'
import { Button } from '@/components/ui/button'
import type { Participant } from '@/lib/types'
import { Pencil } from 'lucide-react'

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [editing, setEditing] = useState<Participant | null>(null)

  function handleSave(updated: Participant) {
    setParticipants(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  const sorted = [...participants].sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)

  return (
    <div>
      <h1 className="mb-8 text-2xl font-black text-white">
        Participantes
      </h1>

      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Nome</th>
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Time</th>
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Tasks</th>
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Presença</th>
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Contribuições</th>
              <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Pontos</th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const team = teams.find(t => t.id === p.teamId)
              return (
                <tr key={p.id} className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.05]">
                  <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                  <td className="px-6 py-4 text-[#b2b2b2]">{team?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-center text-[#b2b2b2]">{p.metrics.tasksCompleted}</td>
                  <td className="px-6 py-4 text-center font-semibold tabular-nums text-white text-sm">{p.metrics.attendance}%</td>
                  <td className="px-6 py-4 text-center text-[#b2b2b2]">{p.metrics.contributions}</td>
                  <td className="px-6 py-4 font-black tabular-nums text-white text-sm">{p.metrics.totalPoints}</td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(p)} aria-label={`Editar ${p.name}`} className="h-7 w-7 p-0 rounded text-[#636363] hover:text-white hover:bg-white/10">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ParticipantEditDialog
        key={editing?.id}
        participant={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  )
}
