'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  hackathonId: Id<'hackathons'>
  open: boolean
  onClose: () => void
}

export function TeamCreateDialog({ hackathonId, open, onClose }: Props) {
  const createTeam = useMutation(api.mutations.createTeam)
  const [name, setName] = useState('')
  const [project, setProject] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!name.trim() || !project.trim()) return
    setSaving(true)
    try {
      await createTeam({
        hackathonId,
        name: name.trim(),
        project: project.trim(),
        description: description.trim() || undefined,
        tags: [],
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
          <DialogTitle>Novo Time</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-[#b2b2b2]">Nome *</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do time"
              className="border-white/10 bg-white/5 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[#b2b2b2]">Projeto *</Label>
            <Input
              value={project}
              onChange={e => setProject(e.target.value)}
              placeholder="Nome do projeto"
              className="border-white/10 bg-white/5 text-white"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[#b2b2b2]">Descrição</Label>
            <Input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descrição opcional"
              className="border-white/10 bg-white/5 text-white"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2]">Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim() || !project.trim()}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white active:scale-[0.97] transition-transform"
            >
              {saving ? 'Criando…' : 'Criar Time'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
