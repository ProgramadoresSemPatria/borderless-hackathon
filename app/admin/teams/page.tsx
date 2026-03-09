'use client'
import { useState, useCallback, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { HackathonSelector, useSelectedHackathon } from '@/components/admin/hackathon-selector'
import { TeamEditDialog } from '@/components/admin/team-edit-dialog'
import { TeamCreateDialog } from '@/components/admin/team-create-dialog'
import { ParticipantCreateDialog } from '@/components/admin/participant-create-dialog'
import { ImportSheet } from '@/components/admin/import-sheet'
import { FadeUp } from '@/components/animated/fade-up'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { exportTeamsCsv } from '@/lib/excel'
import { motion } from 'framer-motion'
import { Pencil, Search, Plus, Upload, Download, Trophy, ChevronRight, UserPlus } from 'lucide-react'

function rankColor(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default function AdminTeamsPage() {
  const [selectedId, setSelectedId] = useState<Id<'hackathons'> | null>(null)
  const handleChange = useCallback((id: Id<'hackathons'> | null) => setSelectedId(id), [])
  const hackathon = useSelectedHackathon(selectedId)

  const teams = useQuery(
    api.hackathons.getTeamsRanked,
    selectedId ? { hackathonId: selectedId } : 'skip',
  )

  const [search, setSearch] = useState('')
  const [editingTeamId, setEditingTeamId] = useState<Id<'teams'> | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [expandedTeamId, setExpandedTeamId] = useState<Id<'teams'> | null>(null)
  const [addMemberToTeamId, setAddMemberToTeamId] = useState<Id<'teams'> | null>(null)

  const criteria = hackathon?.criteria ?? []

  const filtered = useMemo(() => {
    if (!teams) return []
    if (!search.trim()) return teams
    const q = search.toLowerCase()
    return teams.filter(t =>
      t.name.toLowerCase().includes(q) || t.project.toLowerCase().includes(q)
    )
  }, [teams, search])

  const isLoading = selectedId && teams === undefined

  return (
    <div>
      <h1 className="mb-8 text-2xl font-black text-white">Times</h1>
      <HackathonSelector value={selectedId} onChange={handleChange} />

      {!selectedId && (
        <p className="text-sm text-[#636363]">Selecione um hackathon para ver os times.</p>
      )}

      {/* Skeleton loading */}
      {isLoading && (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-4">
              <Skeleton className="h-5 w-8 bg-white/10" />
              <Skeleton className="h-5 w-40 bg-white/10" />
              <Skeleton className="h-5 w-32 bg-white/10" />
              <div className="ml-auto flex gap-3">
                <Skeleton className="h-5 w-12 bg-white/10" />
                <Skeleton className="h-5 w-12 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedId && teams && (
        <>
          {/* Action bar */}
          <div className="mb-2 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome ou projeto…"
                className="w-full rounded-lg border border-white/[0.12] bg-[#2a2a2b] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#636363] focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
              />
            </div>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-1.5 bg-[#9810fa] text-white hover:bg-[#b040ff] active:scale-[0.97] transition-transform"
            >
              <Plus className="h-4 w-4" />
              Novo Time
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
              onClick={() => teams && exportTeamsCsv(teams, criteria)}
              disabled={!teams || teams.length === 0}
              className="gap-1.5 text-[#b2b2b2] hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Result count */}
          <p className="mb-4 text-xs text-[#636363]">
            {search.trim()
              ? `${filtered.length} de ${teams.length} times`
              : `${teams.length} times`}
          </p>

          {teams.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#2a2a2b] py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9810fa]/15">
                <Trophy className="h-7 w-7 text-[#9810fa]" />
              </div>
              <p className="mb-1 text-sm font-semibold text-white">Nenhum time cadastrado</p>
              <p className="mb-5 text-xs text-[#636363]">Crie o primeiro time deste hackathon.</p>
              <Button onClick={() => setShowCreate(true)} className="gap-1.5 bg-[#9810fa] text-white hover:bg-[#b040ff] active:scale-[0.97] transition-transform">
                <Plus className="h-4 w-4" />
                Novo Time
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-white/10 bg-[#2a2a2b] text-left">
                    <th scope="col" className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap w-12">#</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Time</th>
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Projeto</th>
                    {criteria.map(c => (
                      <th scope="col" key={c} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">{c}</th>
                    ))}
                    <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap">Total</th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((team, i) => {
                    const rank = teams.indexOf(team) + 1
                    const isExpanded = expandedTeamId === team._id
                    return (
                      <>
                        <tr
                          key={team._id}
                          className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.06] cursor-pointer animate-in fade-in-0 slide-in-from-bottom-1 duration-300 fill-mode-both"
                          style={{ animationDelay: `${i * 30}ms` }}
                          onClick={() => setExpandedTeamId(isExpanded ? null : team._id)}
                        >
                          <td className={`px-4 py-4 font-black text-sm ${rankColor(rank)}`}>
                            <div className="flex items-center gap-1">
                              <motion.div
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              >
                                <ChevronRight className="h-3.5 w-3.5 text-[#636363]" />
                              </motion.div>
                              #{rank}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-white">{team.name}</div>
                            {team.members.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {team.members.map(m => (
                                  <Badge key={m._id} variant="outline" className="border-white/10 text-[10px] text-[#b2b2b2] font-normal px-1.5 py-0">
                                    {m.name}{m.role ? ` · ${m.role}` : ''}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-[#b2b2b2]">{team.project}</td>
                          {criteria.map(c => (
                            <td key={c} className="px-4 py-4 text-center tabular-nums text-[#b2b2b2] text-sm">
                              {team.scores.find(s => s.criteriaKey === c)?.value.toFixed(1) ?? '—'}
                            </td>
                          ))}
                          <td className="px-6 py-4 font-black tabular-nums text-white text-sm">{team.totalScore.toFixed(2)}</td>
                          <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingTeamId(team._id)}
                              aria-label={`Editar ${team.name}`}
                              className="h-7 w-7 p-0 rounded text-[#636363] hover:text-white hover:bg-white/10"
                            >
                              <Pencil className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </td>
                        </tr>
                        {/* Expanded row with CSS grid transition */}
                        <tr key={`${team._id}-expanded`} className="border-b border-white/[0.06]">
                          <td colSpan={criteria.length + 5} className="p-0">
                            <div
                              className="grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                              style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                            >
                              <div className="overflow-hidden">
                                <div className="bg-white/[0.02] px-6 py-5">
                                  {team.description && (
                                    <p className="mb-4 text-sm text-[#b2b2b2]">{team.description}</p>
                                  )}
                                  {team.members.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                      {team.members.map((m, mi) => (
                                        <FadeUp key={m._id} delay={mi * 0.04}>
                                          <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#2a2a2b] px-4 py-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9810fa]/20 text-xs font-bold text-[#9810fa]">
                                              {m.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                              <div className="text-sm font-semibold text-white">{m.name}</div>
                                              {m.role && (
                                                <Badge variant="outline" className="mt-0.5 border-[#9810fa]/30 text-[10px] text-[#9810fa] font-normal px-1.5 py-0">
                                                  {m.role}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </FadeUp>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-[#636363]">Nenhum membro neste time.</p>
                                  )}
                                  <div className="mt-4 flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={(e) => { e.stopPropagation(); setEditingTeamId(team._id) }}
                                      className="gap-1.5 bg-[#9810fa] text-white hover:bg-[#b040ff] active:scale-[0.97] transition-transform"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                      Editar Time
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => { e.stopPropagation(); setAddMemberToTeamId(team._id) }}
                                      className="gap-1.5 text-[#b2b2b2] hover:bg-white/10 hover:text-white"
                                    >
                                      <UserPlus className="h-3.5 w-3.5" />
                                      Adicionar Membro
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )
                  })}
                  {filtered.length === 0 && teams.length > 0 && (
                    <tr>
                      <td colSpan={criteria.length + 5} className="px-6 py-8 text-center text-sm text-[#636363]">
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

      {editingTeamId && selectedId && (
        <TeamEditDialog
          key={editingTeamId}
          teamId={editingTeamId}
          hackathonId={selectedId}
          criteria={criteria}
          open={!!editingTeamId}
          onClose={() => setEditingTeamId(null)}
        />
      )}

      {showCreate && selectedId && (
        <TeamCreateDialog
          hackathonId={selectedId}
          open={showCreate}
          onClose={() => setShowCreate(false)}
        />
      )}

      {showImport && selectedId && (
        <ImportSheet
          hackathonId={selectedId}
          open={showImport}
          onClose={() => setShowImport(false)}
          defaultMode="teams-only"
        />
      )}

      {addMemberToTeamId && selectedId && (
        <ParticipantCreateDialog
          hackathonId={selectedId}
          teams={teams?.filter(t => t._id === addMemberToTeamId).map(t => ({ _id: t._id, name: t.name })) ?? []}
          open={!!addMemberToTeamId}
          onClose={() => setAddMemberToTeamId(null)}
        />
      )}
    </div>
  )
}
