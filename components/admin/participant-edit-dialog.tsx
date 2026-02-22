'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Participant } from '@/lib/types'

interface Props {
  participant: Participant | null
  open: boolean
  onClose: () => void
  onSave: (p: Participant) => void
}

export function ParticipantEditDialog({ participant, open, onClose, onSave }: Props) {
  const [metrics, setMetrics] = useState(participant?.metrics ?? {
    tasksCompleted: 0, attendance: 0, contributions: 0, totalPoints: 0,
  })

  if (!participant) return null

  const fields: { key: keyof typeof metrics; label: string }[] = [
    { key: 'tasksCompleted', label: 'Tasks Completadas' },
    { key: 'attendance', label: 'Presença (0–100%)' },
    { key: 'contributions', label: 'Contribuições' },
    { key: 'totalPoints', label: 'Pontos Totais' },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-[#2a2a2b] text-white">
        <DialogHeader>
          <DialogTitle>Editar Métricas — {participant.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fields.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-[#b2b2b2]">{label}</Label>
              <Input
                type="number"
                min={0}
                value={metrics[key]}
                onChange={e => setMetrics(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2]">Cancelar</Button>
            <Button
              onClick={() => { onSave({ ...participant, metrics }); onClose() }}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
