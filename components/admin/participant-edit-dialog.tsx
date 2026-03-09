'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown } from 'lucide-react'

const ROLE_OPTIONS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'Mobile',
  'DevOps',
  'Data Science',
  'UI/UX Design',
  'Product',
  'Outro',
]

interface Props {
  participantId: Id<'participants'>
  participantName: string
  initialRole: string
  initialExperienceYears?: number
  initialMetrics: {
    tasksCompleted: number
    attendance: number
    contributions: number
    totalPoints: number
  }
  initialTeamId: Id<'teams'>
  teams: { _id: Id<'teams'>; name: string }[]
  open: boolean
  onClose: () => void
}

export function ParticipantEditDialog({
  participantId,
  participantName,
  initialRole,
  initialExperienceYears,
  initialMetrics,
  initialTeamId,
  teams,
  open,
  onClose,
}: Props) {
  const updateParticipant = useMutation(api.mutations.updateParticipant)
  const [name, setName] = useState(participantName)
  const [teamId, setTeamId] = useState<Id<'teams'>>(initialTeamId)
  const [role, setRole] = useState(initialRole)
  const [experienceYears, setExperienceYears] = useState<number | undefined>(initialExperienceYears)
  const [metrics, setMetrics] = useState(initialMetrics)
  const [saving, setSaving] = useState(false)

  const metricFields: { key: keyof typeof metrics; label: string }[] = [
    { key: 'attendance', label: 'Presença (0–100%)' },
    { key: 'tasksCompleted', label: 'Tasks Completadas' },
    { key: 'contributions', label: 'Contribuições' },
    { key: 'totalPoints', label: 'Pontos Totais' },
  ]

  async function handleSave() {
    setSaving(true)
    try {
      await updateParticipant({
        id: participantId,
        name: name.trim() || undefined,
        teamId,
        role: role || undefined,
        experienceYears,
        metrics,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-[#2a2a2b] text-white">
        <DialogHeader>
          <DialogTitle>Editar Participante</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Perfil */}
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Perfil</p>
            <div className="space-y-1">
              <Label className="text-[#b2b2b2]">Nome</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[#b2b2b2]">Time</Label>
                <div className="relative">
                  <select
                    value={teamId}
                    onChange={e => setTeamId(e.target.value as Id<'teams'>)}
                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#2a2a2b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                  >
                    {teams.map(t => (
                      <option key={t._id} value={t._id} className="bg-[#2a2a2b] text-white">{t.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[#b2b2b2]">Área</Label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#2a2a2b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                  >
                    <option value="" className="bg-[#2a2a2b] text-white">Selecione…</option>
                    {ROLE_OPTIONS.map(r => (
                      <option key={r} value={r} className="bg-[#2a2a2b] text-white">{r}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[#b2b2b2]">Experiência (anos)</Label>
              <Input
                type="number"
                min={0}
                max={50}
                value={experienceYears ?? ''}
                onChange={e => {
                  const v = e.target.value
                  setExperienceYears(v === '' ? undefined : parseFloat(v) || 0)
                }}
                placeholder="Ex: 3"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>

          {/* Métricas */}
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Métricas</p>
            <div className="grid grid-cols-2 gap-3">
              {metricFields.map(({ key, label }) => (
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
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2]">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#9810fa] hover:bg-[#b040ff] text-white active:scale-[0.97] transition-transform">
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
