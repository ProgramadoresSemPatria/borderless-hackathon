'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from './form-field'
import { CustomSelect } from './custom-select'
import { SectionHeader } from './section-header'

const ROLE_OPTIONS = [
  'Frontend', 'Backend', 'Full Stack', 'Mobile',
  'DevOps', 'Data Science', 'UI/UX Design', 'Product', 'Outro',
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

const inputCls = 'h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-[#4a4a4a] focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20'

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
      <DialogContent className="gap-0 border-white/[0.08] bg-[#2a2a2b] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Participante</DialogTitle>
          <DialogDescription className="text-[#636363]">
            {participantName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Profile */}
          <div className="space-y-3">
            <SectionHeader title="Perfil" />

            <FormField label="Nome">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                className={inputCls}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Time">
                <CustomSelect
                  value={teamId}
                  onChange={v => setTeamId(v as Id<'teams'>)}
                  options={teams.map(t => ({ value: t._id, label: t.name }))}
                />
              </FormField>

              <FormField label="Área">
                <CustomSelect
                  value={role}
                  onChange={setRole}
                  options={ROLE_OPTIONS.map(r => ({ value: r, label: r }))}
                  placeholder="Selecione…"
                />
              </FormField>
            </div>

            <FormField label="Experiência (anos)">
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
                className={inputCls}
              />
            </FormField>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <SectionHeader title="Métricas" />

            <div className="grid grid-cols-2 gap-3">
              {metricFields.map(({ key, label }) => (
                <FormField key={key} label={label}>
                  <Input
                    type="number"
                    min={0}
                    value={metrics[key]}
                    onChange={e => setMetrics(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                    className={inputCls}
                  />
                </FormField>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2] hover:text-white">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
