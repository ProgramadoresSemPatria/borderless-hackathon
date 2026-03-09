'use client'
import { useEffect, useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown, Plus, X } from 'lucide-react'

interface HackathonSelectorProps {
  value: Id<'hackathons'> | null
  onChange: (id: Id<'hackathons'> | null) => void
  label?: string
}

export function HackathonSelector({ value, onChange, label = 'Hackathon' }: HackathonSelectorProps) {
  const hackathons = useQuery(api.hackathons.list)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    if (hackathons?.length === 1 && !value) {
      onChange(hackathons[0]._id)
    }
  }, [hackathons, value, onChange])

  if (hackathons === undefined) {
    return (
      <div className="mb-6">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
          {label}
        </label>
        <div className="h-10 animate-pulse rounded-lg bg-white/5" />
      </div>
    )
  }

  return (
    <div className="mb-6">
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
        {label}
      </label>
      <div className="flex gap-2">
        {hackathons.length === 0 ? (
          <p className="flex-1 self-center text-sm text-red-400">Nenhum hackathon encontrado.</p>
        ) : (
          <div className="relative flex-1">
            <select
              value={value ?? ''}
              onChange={(e) => onChange((e.target.value as Id<'hackathons'>) || null)}
              className="w-full appearance-none rounded-lg border border-white/[0.12] bg-[#2a2a2b] px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
            >
              {hackathons.length > 1 && <option value="" className="bg-[#2a2a2b] text-white">Selecione um hackathon…</option>}
              {hackathons.map((h) => (
                <option key={h._id} value={h._id} className="bg-[#2a2a2b] text-white">
                  {h.name} — {h.edition}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => setShowCreate(true)}
          className="h-10 w-10 shrink-0 rounded-lg border border-white/[0.12] bg-[#2a2a2b] p-0 text-[#636363] hover:border-[#9810fa]/50 hover:bg-[#9810fa]/10 hover:text-white"
          aria-label="Criar novo hackathon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <CreateHackathonDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(id) => {
          onChange(id)
          setShowCreate(false)
        }}
      />
    </div>
  )
}

export function useSelectedHackathon(hackathonId: Id<'hackathons'> | null) {
  const hackathons = useQuery(api.hackathons.list)
  return hackathons?.find(h => h._id === hackathonId) ?? null
}

// --- Create Hackathon Dialog ---

function CreateHackathonDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (id: Id<'hackathons'>) => void
}) {
  const createHackathon = useMutation(api.mutations.createHackathon)

  const [name, setName] = useState('Borderless Hackathon')
  const [edition, setEdition] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming')
  const [criteriaInput, setCriteriaInput] = useState('')
  const [criteria, setCriteria] = useState<string[]>(['Inovação', 'Execução', 'Pitch', 'Impacto'])
  const [saving, setSaving] = useState(false)

  function addCriterion() {
    const trimmed = criteriaInput.trim()
    if (trimmed && !criteria.includes(trimmed)) {
      setCriteria(prev => [...prev, trimmed])
      setCriteriaInput('')
    }
  }

  function removeCriterion(c: string) {
    setCriteria(prev => prev.filter(x => x !== c))
  }

  async function handleCreate() {
    if (!name.trim() || !edition.trim() || !slug.trim() || !date.trim() || criteria.length === 0) return
    setSaving(true)
    try {
      const id = await createHackathon({
        name: name.trim(),
        edition: edition.trim(),
        slug: slug.trim(),
        date: date.trim(),
        status,
        criteria,
      })
      onCreated(id)
    } finally {
      setSaving(false)
    }
  }

  const isValid = name.trim() && edition.trim() && slug.trim() && date.trim() && criteria.length > 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-[#2a2a2b] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Edição</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-[#b2b2b2]">Nome</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Borderless Hackathon"
              className="border-white/10 bg-white/5 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[#b2b2b2]">Edição</Label>
              <Input
                value={edition}
                onChange={e => setEdition(e.target.value)}
                placeholder="2026 — 2ª Edição"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[#b2b2b2]">Slug (URL)</Label>
              <Input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="borderless-2026-2"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[#b2b2b2]">Data</Label>
              <Input
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="15 de Março de 2026"
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[#b2b2b2]">Status</Label>
              <div className="relative">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as typeof status)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-[#2a2a2b] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
                >
                  <option value="upcoming" className="bg-[#2a2a2b] text-white">Em breve</option>
                  <option value="live" className="bg-[#2a2a2b] text-white">Em andamento</option>
                  <option value="finished" className="bg-[#2a2a2b] text-white">Finalizado</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#b2b2b2]">Critérios de avaliação</Label>
            <div className="flex flex-wrap gap-2">
              {criteria.map(c => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 rounded-md border border-[#9810fa]/30 bg-[#9810fa]/10 px-2.5 py-1 text-xs font-medium text-white"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => removeCriterion(c)}
                    className="ml-0.5 rounded text-white/40 hover:text-white"
                    aria-label={`Remover ${c}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={criteriaInput}
                onChange={e => setCriteriaInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCriterion() } }}
                placeholder="Novo critério…"
                className="border-white/10 bg-white/5 text-white"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={addCriterion}
                disabled={!criteriaInput.trim()}
                className="shrink-0 text-[#9810fa] hover:bg-[#9810fa]/10 hover:text-[#9810fa]"
              >
                Adicionar
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2]">Cancelar</Button>
            <Button
              onClick={handleCreate}
              disabled={!isValid || saving}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white disabled:opacity-50 active:scale-[0.97] transition-transform"
            >
              {saving ? 'Criando…' : 'Criar Hackathon'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
