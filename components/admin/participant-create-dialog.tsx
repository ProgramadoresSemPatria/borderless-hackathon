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

const ROLE_OPTIONS = [
  'Frontend', 'Backend', 'Full Stack', 'Mobile',
  'DevOps', 'Data Science', 'UI/UX Design', 'Product', 'Outro',
]

interface Props {
  hackathonId: Id<'hackathons'>
  teams: { _id: Id<'teams'>; name: string }[]
  open: boolean
  onClose: () => void
}

const inputCls = 'h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-[#4a4a4a] focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20'

export function ParticipantCreateDialog({ hackathonId, teams, open, onClose }: Props) {
  const createParticipant = useMutation(api.mutations.createParticipant)
  const [name, setName] = useState('')
  const [teamId, setTeamId] = useState<Id<'teams'> | ''>('')
  const [role, setRole] = useState('')
  const [experienceYears, setExperienceYears] = useState<number | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim() || !teamId) return
    setSaving(true)
    try {
      await createParticipant({
        hackathonId,
        teamId: teamId as Id<'teams'>,
        name: name.trim(),
        role: role || undefined,
        experienceYears,
        metrics: {
          tasksCompleted: 0,
          attendance: 0,
          contributions: 0,
          totalPoints: 0,
        },
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
          <DialogTitle>Novo Participante</DialogTitle>
          <DialogDescription className="text-[#636363]">
            Adicione um participante e vincule a um time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <FormField label="Nome" required>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do participante"
              className={inputCls}
            />
          </FormField>

          <FormField label="Time" required>
            <CustomSelect
              value={teamId}
              onChange={v => setTeamId(v as Id<'teams'> | '')}
              options={teams.map(t => ({ value: t._id, label: t.name }))}
              placeholder="Selecione um time…"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Área">
              <CustomSelect
                value={role}
                onChange={setRole}
                options={ROLE_OPTIONS.map(r => ({ value: r, label: r }))}
                placeholder="Selecione…"
              />
            </FormField>

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

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2] hover:text-white">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim() || !teamId}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white"
            >
              {saving ? 'Criando…' : 'Criar Participante'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
