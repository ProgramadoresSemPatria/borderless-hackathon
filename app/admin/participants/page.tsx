'use client'
import { useState } from 'react'
import { participants as initialParticipants, teams } from '@/lib/mock-data'
import { ParticipantEditDialog } from '@/components/admin/participant-edit-dialog'
import { Button } from '@/components/ui/button'
import type { Participant } from '@/lib/types'
import { Pencil } from 'lucide-react'
import { GradientText } from '@/components/animated/gradient-text'

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [editing, setEditing] = useState<Participant | null>(null)

  function handleSave(updated: Participant) {
    setParticipants(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  const sorted = [...participants].sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">
        <GradientText>Participantes</GradientText>
      </h1>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-widest text-[#636363]">
              <th scope="col" className="px-6 py-4">Nome</th>
              <th scope="col" className="px-6 py-4">Time</th>
              <th scope="col" className="px-6 py-4">Tasks</th>
              <th scope="col" className="px-6 py-4">Presença</th>
              <th scope="col" className="px-6 py-4">Contribuições</th>
              <th scope="col" className="px-6 py-4">Pontos</th>
              <th scope="col" className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const team = teams.find(t => t.id === p.teamId)
              return (
                <tr key={p.id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#2a2a2b]/50' : 'bg-[#232322]/50'}`}>
                  <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                  <td className="px-6 py-4 text-[#b2b2b2]">{team?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-center text-[#b2b2b2]">{p.metrics.tasksCompleted}</td>
                  <td className="px-6 py-4 text-center text-[#2debb1]">{p.metrics.attendance}%</td>
                  <td className="px-6 py-4 text-center text-[#b2b2b2]">{p.metrics.contributions}</td>
                  <td className="px-6 py-4 font-bold text-[#9810fa]">{p.metrics.totalPoints}</td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(p)} aria-label={`Editar ${p.name}`} className="h-8 w-8 p-0 text-[#b2b2b2] hover:text-white">
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
