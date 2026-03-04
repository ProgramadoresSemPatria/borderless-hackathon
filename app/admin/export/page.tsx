'use client'
import { useState, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import {
  exportReportFromConvex,
  exportTeamsCsv,
  exportParticipantsCsv,
} from '@/lib/excel'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet, ChevronDown } from 'lucide-react'

export default function ExportPage() {
  const hackathons = useQuery(api.hackathons.list)
  const [selectedId, setSelectedId] = useState<Id<'hackathons'> | null>(null)

  const teams = useQuery(
    api.hackathons.getTeamsRanked,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )
  const participants = useQuery(
    api.hackathons.getParticipantsRanked,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )

  useEffect(() => {
    if (hackathons?.length === 1 && !selectedId) {
      setSelectedId(hackathons[0]._id)
    }
  }, [hackathons, selectedId])

  const selectedHackathon = hackathons?.find((h) => h._id === selectedId)
  const criteria = selectedHackathon?.criteria ?? []
  const isLoading = !!selectedId && (teams === undefined || participants === undefined)
  const hasData = !isLoading && teams && participants && (teams.length > 0 || participants.length > 0)

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">Exportar Relatório</h1>
      <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
        Gera relatórios com dados reais do Convex. Disponível em Excel (.xlsx) e CSV.
      </p>

      {/* Hackathon selector */}
      <div className="mb-6">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
          Hackathon
        </label>
        {hackathons === undefined ? (
          <div className="h-10 animate-pulse rounded-lg bg-white/5" />
        ) : (
          <div className="relative">
            <select
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId((e.target.value as Id<'hackathons'>) || null)}
              className="w-full appearance-none rounded-lg border border-white/[0.12] bg-[#2a2a2b] px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
            >
              {hackathons.length !== 1 && <option value="">Selecione um hackathon…</option>}
              {hackathons.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} — {h.edition}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
          </div>
        )}
      </div>

      {selectedId && (
        <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8">
          {/* Info cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-white/[0.08] bg-white/[0.03] p-3">
              <div className="font-semibold text-white">
                {isLoading ? '…' : teams?.length ?? 0} times
              </div>
              <div className="text-[#636363]">
                com {criteria.length} critério{criteria.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="rounded border border-white/[0.08] bg-white/[0.03] p-3">
              <div className="font-semibold text-white">
                {isLoading ? '…' : participants?.length ?? 0} participantes
              </div>
              <div className="text-[#636363]">com métricas individuais</div>
            </div>
          </div>

          {/* Export buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => teams && participants && exportReportFromConvex(teams, participants, criteria)}
              disabled={!hasData}
              className="w-full gap-2 rounded-lg bg-[#9810fa] py-3 text-base font-bold text-white hover:bg-[#9810fa]/90 disabled:opacity-50"
            >
              <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
              Exportar Excel (.xlsx)
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => teams && exportTeamsCsv(teams, criteria)}
                disabled={!hasData}
                className="gap-2 border-white/[0.12] bg-transparent text-white hover:bg-white/[0.06] disabled:opacity-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Times CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => teams && participants && exportParticipantsCsv(participants, teams)}
                disabled={!hasData}
                className="gap-2 border-white/[0.12] bg-transparent text-white hover:bg-white/[0.06] disabled:opacity-50"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Participantes CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
