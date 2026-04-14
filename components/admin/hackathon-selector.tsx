'use client'
import { useEffect, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { HackathonCreateDialog } from './hackathon-create-dialog'
import { ChevronDown, Plus } from 'lucide-react'

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

      <HackathonCreateDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(id) => onChange(id)}
      />
    </div>
  )
}

export function useSelectedHackathon(hackathonId: Id<'hackathons'> | null) {
  const hackathons = useQuery(api.hackathons.list)
  return hackathons?.find(h => h._id === hackathonId) ?? null
}

