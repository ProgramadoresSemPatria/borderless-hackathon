'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from './form-field'

interface Props {
  hackathonId: Id<'hackathons'>
  open: boolean
  onClose: () => void
}

const inputCls = 'h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-[#4a4a4a] focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20'

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
      <DialogContent className="gap-0 border-white/[0.08] bg-[#2a2a2b] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Time</DialogTitle>
          <DialogDescription className="text-[#636363]">
            Adicione um novo time ao hackathon.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <FormField label="Nome" required>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do time"
              className={inputCls}
            />
          </FormField>

          <FormField label="Projeto" required>
            <Input
              value={project}
              onChange={e => setProject(e.target.value)}
              placeholder="Nome do projeto"
              className={inputCls}
            />
          </FormField>

          <FormField label="Descrição">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva brevemente o projeto…"
              rows={3}
              className="w-full min-h-[80px] resize-none rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-[#4a4a4a] focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20 focus:outline-none"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2] hover:text-white">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !name.trim() || !project.trim()}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white"
            >
              {saving ? 'Criando…' : 'Criar Time'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
