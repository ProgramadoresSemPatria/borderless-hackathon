'use client'
import { useState, useCallback, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { HackathonSelector } from '@/components/admin/hackathon-selector'
import { ParticipantEditDialog } from '@/components/admin/participant-edit-dialog'
import { ParticipantCreateDialog } from '@/components/admin/participant-create-dialog'
import { ImportSheet } from '@/components/admin/import-sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { exportParticipantsCsv } from '@/lib/excel'
import { Pencil, Search, Plus, Upload, Download, Users } from 'lucide-react'

function rankColor(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

function attendanceColor(value: number) {
  if (value >= 80) return 'text-emerald-400'
  if (value >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

export default function AdminParticipantsPage() {
  const [selectedId, setSelectedId] = useState<Id<'hackathons'> | null>(null)
  const handleChange = useCallback((id: Id<'hackathons'> | null) => setSelectedId(id), [])
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)

  const participants = useQuery(
    api.hackathons.getParticipantsRanked,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )

  const teams = useQuery(
    api.hackathons.getTeamsRanked,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )

  const filtered = useMemo(() => {
    if (!participants) return []
    if (!search.trim()) return participants
    const q = search.toLowerCase()
    return participants.filter(p => {
      const team = teams?.find(t => t._id === p.teamId)
      return p.name.toLowerCase().includes(q)
        || (team?.name ?? '').toLowerCase().includes(q)
        || (p.role ?? '').toLowerCase().includes(q)
    })
  }, [participants, teams, search])

  const [editingId, setEditingId] = useState<Id<'participants'> | null>(null)
  const editingParticipant = participants?.find(p => p._id === editingId) ?? null

  const isLoading = selectedId && participants === undefined

  return (
    <div>
      <h1 className="mb-8 text-2xl font-black text-white">Participantes</h1>
      <HackathonSelector value={selectedId} onChange={handleChange} />

      {!selectedId && (
        <p className="text-sm text-[#636363]">Selecione um hackathon para ver os participantes.</p>
      )}

      {/* Skeleton loading */}
      {isLoading && (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-4">
              <Skeleton className="h-5 w-8 bg-white/10" />
              <Skeleton className="h-5 w-32 bg-white/10" />
              <Skeleton className="h-5 w-24 bg-white/10" />
              <Skeleton className="h-5 w-16 bg-white/10" />
              <div className="ml-auto flex gap-3">
                <Skeleton className="h-5 w-12 bg-white/10" />
                <Skeleton className="h-5 w-12 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedId && participants && (
        <>
          {/* Action bar */}
          <div className="mb-2 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome, time ou área…"
                className="w-full rounded-lg border border-white/[0.12] bg-[#2a2a2b] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#636363] focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
              />
            </div>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-1.5 bg-[#9810fa] text-white hover:bg-[#b040ff] active:scale-[0.97] transition-transform"
            >
              <Plus className="h-4 w-4" />
              Novo Participante
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowImport(true)}
              className="gap-1.5 text-[#b2b2b2] hover:bg-white/10 hover:text-white"
            >
              <Upload className="h-4 w-4" />
              Importar
            </Button>
            <Button
              variant="ghost"
              onClick={() => teams && participants && exportParticipantsCsv(participants, teams)}
              disabled={!teams || !participants || participants.length === 0}
              className="gap-1.5 text-[#b2b2b2] hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Result count */}
          <p className="mb-4 text-xs text-[#636363]">
            {search.trim()
              ? `${filtered.length} de ${participants.length} participantes`
              : `${participants.length} participantes`}
          </p>

          {participants.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#2a2a2b] py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9810fa]/15">
                <Users className="h-7 w-7 text-[#9810fa]" />
              </div>
              <p className="mb-1 text-sm font-semibold text-white">Nenhum participante cadastrado</p>
              <p className="mb-5 text-xs text-[#636363]">Adicione participantes a este hackathon.</p>
              <Button onClick={() => setShowCreate(true)} className="gap-1.5 bg-[#9810fa] text-white hover:bg-[#b040ff] active:scale-[0.97] transition-transform">
                <Plus className="h-4 w-4" />
                Novo Participante
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-white/10 bg-[#2a2a2b] text-left">
                    <th scope="col" className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap w-12">#</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Nome</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Time</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Área</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Exp.</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Presença</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Tasks</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Contrib.</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Pontos</th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const rank = participants.indexOf(p) + 1
                    const team = teams?.find(t => t._id === p.teamId)
                    return (
                      <tr
                        key={p._id}
                        className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.06] animate-in fade-in-0 slide-in-from-bottom-1 duration-300 fill-mode-both"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <td className={`px-4 py-4 font-black text-sm ${rankColor(rank)}`}>#{rank}</td>
                        <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                        <td className="px-6 py-4 text-[#b2b2b2]">{team?.name ?? '—'}</td>
                        <td className="px-6 py-4">
                          {p.role
                            ? <Badge variant="outline" className="border-white/10 text-xs text-[#b2b2b2] font-normal">{p.role}</Badge>
                            : <span className="text-[#636363]">—</span>}
                        </td>
                        <td className="px-6 py-4 text-center tabular-nums text-[#b2b2b2]">
                          {p.experienceYears != null ? `${p.experienceYears}a` : '—'}
                        </td>
                        <td className={`px-6 py-4 text-center font-semibold tabular-nums text-sm ${attendanceColor(p.metrics.attendance)}`}>{p.metrics.attendance}%</td>
                        <td className="px-6 py-4 text-center tabular-nums text-[#b2b2b2] text-sm">{p.metrics.tasksCompleted}</td>
                        <td className="px-6 py-4 text-center tabular-nums text-[#b2b2b2] text-sm">{p.metrics.contributions}</td>
                        <td className="px-6 py-4 font-black tabular-nums text-white text-sm">{p.metrics.totalPoints}</td>
                        <td className="px-6 py-4">
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(p._id)} aria-label={`Editar ${p.name}`} className="h-7 w-7 p-0 rounded text-[#636363] hover:text-white hover:bg-white/10">
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && participants.length > 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-sm text-[#636363]">
                        Nenhum resultado encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {editingParticipant && (
        <ParticipantEditDialog
          key={editingParticipant._id}
          participantId={editingParticipant._id}
          participantName={editingParticipant.name}
          initialRole={editingParticipant.role ?? ''}
          initialExperienceYears={editingParticipant.experienceYears ?? undefined}
          initialMetrics={editingParticipant.metrics}
          initialTeamId={editingParticipant.teamId}
          teams={teams?.map(t => ({ _id: t._id, name: t.name })) ?? []}
          open={!!editingId}
          onClose={() => setEditingId(null)}
        />
      )}

      {showCreate && selectedId && teams && (
        <ParticipantCreateDialog
          hackathonId={selectedId}
          teams={teams.map(t => ({ _id: t._id, name: t.name }))}
          open={showCreate}
          onClose={() => setShowCreate(false)}
        />
      )}

      {showImport && selectedId && (
        <ImportSheet
          hackathonId={selectedId}
          open={showImport}
          onClose={() => setShowImport(false)}
          defaultMode="participants-only"
        />
      )}
    </div>
  )
}
