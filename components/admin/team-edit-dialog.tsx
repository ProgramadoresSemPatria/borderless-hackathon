'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Team } from '@/lib/types'
import { hackathonConfig } from '@/lib/mock-data'

interface TeamEditDialogProps {
  team: Team | null
  open: boolean
  onClose: () => void
  onSave: (team: Team) => void
}

export function TeamEditDialog({ team, open, onClose, onSave }: TeamEditDialogProps) {
  const [scores, setScores] = useState<Record<string, number>>(team?.scores ?? {})

  if (!team) return null

  function handleSave() {
    const total = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    onSave({ ...team!, scores, totalScore: parseFloat(total.toFixed(3)) })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-[#2a2a2b] text-white">
        <DialogHeader>
          <DialogTitle>Editar Notas — {team.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-[#b2b2b2]">Projeto: {team.project}</p>
          <div className="space-y-3">
            {hackathonConfig.criteria.map((criterion) => (
              <div key={criterion} className="space-y-1">
                <Label className="text-[#b2b2b2]">{criterion} (0–10)</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={scores[criterion] ?? 0}
                  onChange={e => setScores(prev => ({ ...prev, [criterion]: parseFloat(e.target.value) || 0 }))}
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2]">Cancelar</Button>
            <Button onClick={handleSave} className="bg-[#9810fa] hover:bg-[#b040ff] text-white">Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
