'use client'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FormField } from './form-field'
import { SectionHeader } from './section-header'
import { Trash2 } from 'lucide-react'

interface TeamEditDialogProps {
  teamId: Id<'teams'>
  hackathonId: Id<'hackathons'>
  criteria: string[]
  open: boolean
  onClose: () => void
}

const inputCls = 'h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-[#4a4a4a] focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20'

function scoreColor(v: number) {
  if (v <= 3) return 'text-red-400'
  if (v <= 6) return 'text-yellow-400'
  if (v <= 8) return 'text-[#2debb1]'
  return 'text-[#9810fa]'
}

export function TeamEditDialog({ teamId, hackathonId, criteria, open, onClose }: TeamEditDialogProps) {
  const team = useQuery(api.hackathons.getTeam, { teamId })
  const upsertScore = useMutation(api.mutations.upsertScore)
  const updateTeam = useMutation(api.mutations.updateTeam)
  const deleteTeam = useMutation(api.mutations.deleteTeam)

  const [scores, setScores] = useState<Record<string, number>>({})
  const [name, setName] = useState('')
  const [project, setProject] = useState('')
  const [description, setDescription] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (team && !initialized) {
    const loaded: Record<string, number> = {}
    for (const s of team.scores) {
      loaded[s.criteriaKey] = s.value
    }
    for (const c of criteria) {
      if (!(c in loaded)) loaded[c] = 0
    }
    setScores(loaded)
    setName(team.name)
    setProject(team.project)
    setDescription(team.description ?? '')
    setInitialized(true)
  }

  if (!team) return null

  const avg = criteria.length > 0
    ? criteria.reduce((sum, c) => sum + (scores[c] ?? 0), 0) / criteria.length
    : 0

  async function handleSaveDetails() {
    setSaving(true)
    try {
      await updateTeam({
        id: teamId,
        name: name.trim() || undefined,
        project: project.trim() || undefined,
        description: description.trim() || undefined,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveScores() {
    setSaving(true)
    try {
      await Promise.all(
        criteria.map(criteriaKey =>
          upsertScore({
            hackathonId,
            teamId,
            criteriaKey,
            value: scores[criteriaKey] ?? 0,
          }),
        ),
      )
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTeam({ id: teamId })
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-0 border-white/[0.08] bg-[#2a2a2b] text-white sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Editar — {team.name}</DialogTitle>
          <DialogDescription className="text-[#636363]">
            Gerencie detalhes e notas do time.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="pt-4">
          <TabsList className="mb-4 grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="details" className="text-sm data-[state=active]:bg-[#9810fa] data-[state=active]:text-white">
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="scores" className="text-sm data-[state=active]:bg-[#9810fa] data-[state=active]:text-white">
              Notas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <FormField label="Nome do Time">
              <Input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
            </FormField>

            <FormField label="Projeto">
              <Input value={project} onChange={e => setProject(e.target.value)} className={inputCls} />
            </FormField>

            <FormField label="Descrição">
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full min-h-[80px] resize-none rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-[#4a4a4a] focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20 focus:outline-none"
                placeholder="Descreva o projeto do time…"
              />
            </FormField>

            {team.members.length > 0 && (
              <div className="space-y-1.5">
                <SectionHeader title="Membros" />
                <div className="flex flex-wrap gap-1.5">
                  {team.members.map(m => (
                    <Badge key={m._id} variant="outline" className="border-white/10 text-xs text-[#b2b2b2]">
                      {m.name}{m.role ? ` · ${m.role}` : ''}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Delete */}
            <div className="border-t border-white/[0.06] pt-4">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400">Tem certeza? Essa ação não pode ser desfeita.</span>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)} className="h-7 text-xs text-[#b2b2b2]">
                    Não
                  </Button>
                  <Button size="sm" onClick={handleDelete} disabled={deleting} className="h-7 bg-red-600 text-xs text-white hover:bg-red-700">
                    {deleting ? 'Excluindo…' : 'Sim, excluir'}
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)} className="gap-1.5 text-xs text-red-400 hover:bg-red-400/10 hover:text-red-300">
                  <Trash2 className="h-3.5 w-3.5" />
                  Excluir Time
                </Button>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2] hover:text-white">Cancelar</Button>
              <Button onClick={handleSaveDetails} disabled={saving} className="bg-[#9810fa] hover:bg-[#b040ff] text-white">
                {saving ? 'Salvando…' : 'Salvar'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#b2b2b2]">{team.project}</p>
              <span className="text-sm font-bold tabular-nums text-white">Média: {avg.toFixed(1)}</span>
            </div>

            <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
              {criteria.map(criterion => {
                const value = scores[criterion] ?? 0
                return (
                  <div key={criterion} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-[#b2b2b2]">{criterion}</label>
                      <span className={`text-sm font-bold tabular-nums ${scoreColor(value)}`}>
                        {value.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      step={0.1}
                      value={value}
                      onChange={e => setScores(prev => ({ ...prev, [criterion]: parseFloat(e.target.value) }))}
                      className="score-slider"
                    />
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2] hover:text-white">Cancelar</Button>
              <Button onClick={handleSaveScores} disabled={saving} className="bg-[#9810fa] hover:bg-[#b040ff] text-white">
                {saving ? 'Salvando…' : 'Salvar Notas'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
