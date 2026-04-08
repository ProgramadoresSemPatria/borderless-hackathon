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
import { X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'upcoming', label: 'Em breve' },
  { value: 'live', label: 'Em andamento' },
  { value: 'finished', label: 'Finalizado' },
]

const inputCls =
  'h-10 border-white/10 bg-white/[0.04] text-white placeholder:text-[#4a4a4a] focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20'

function formatDatePtBr(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface Props {
  open: boolean
  onClose: () => void
  onCreated?: (id: Id<'hackathons'>) => void
}

export function HackathonCreateDialog({ open, onClose, onCreated }: Props) {
  const createHackathon = useMutation(api.mutations.createHackathon)

  const [name, setName] = useState('Borderless Hackathon')
  const [edition, setEdition] = useState('')
  const [slug, setSlug] = useState('')
  const [dateValue, setDateValue] = useState('')
  const [status, setStatus] = useState<'upcoming' | 'live' | 'finished'>('upcoming')
  const [criteriaInput, setCriteriaInput] = useState('')
  const [criteria, setCriteria] = useState<string[]>(['Inovação', 'Execução', 'Pitch', 'Impacto'])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dateString = dateValue ? formatDatePtBr(new Date(dateValue + 'T12:00:00')) : ''

  function addCriterion() {
    const trimmed = criteriaInput.trim()
    if (trimmed && !criteria.includes(trimmed)) {
      setCriteria((prev) => [...prev, trimmed])
      setCriteriaInput('')
    }
  }

  function removeCriterion(c: string) {
    setCriteria((prev) => prev.filter((x) => x !== c))
  }

  async function handleCreate() {
    if (!name.trim() || !edition.trim() || !slug.trim() || !dateString || criteria.length === 0) return
    setSaving(true)
    setError(null)
    try {
      const id = await createHackathon({
        name: name.trim(),
        edition: edition.trim(),
        slug: slug.trim(),
        date: dateString,
        status,
        criteria,
      })
      onCreated?.(id)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao criar')
    } finally {
      setSaving(false)
    }
  }

  const isValid = name.trim() && edition.trim() && slug.trim() && dateString && criteria.length > 0

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="gap-0 border-white/[0.08] bg-[#2a2a2b] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Edição</DialogTitle>
          <DialogDescription className="text-[#636363]">
            Configure uma nova edição do hackathon.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <FormField label="Nome" required>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Borderless Hackathon"
              className={inputCls}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Edição" required>
              <Input
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="2026 — 2ª Edição"
                className={inputCls}
              />
            </FormField>

            <FormField label="Slug (URL)" required>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="borderless-2026-2"
                className={inputCls}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Data" required>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-white focus:border-[#9810fa]/50 focus:ring-1 focus:ring-[#9810fa]/20 focus:outline-none [color-scheme:dark]"
              />
            </FormField>

            <FormField label="Status" required>
              <CustomSelect
                value={status}
                onChange={(v) => setStatus(v as typeof status)}
                options={STATUS_OPTIONS}
              />
            </FormField>
          </div>

          <div className="space-y-2">
            <SectionHeader title="Critérios de avaliação" />
            <div className="flex flex-wrap gap-2">
              {criteria.map((c) => (
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
                onChange={(e) => setCriteriaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCriterion()
                  }
                }}
                placeholder="Novo critério…"
                className={inputCls}
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2] hover:text-white">
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!isValid || saving}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white"
            >
              {saving ? 'Criando…' : 'Criar Hackathon'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
