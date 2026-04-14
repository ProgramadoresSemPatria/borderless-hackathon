'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Doc } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { HackathonCreateDialog } from '@/components/admin/hackathon-create-dialog'
import { HackathonEditDialog } from '@/components/admin/hackathon-edit-dialog'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Rocket,
  ExternalLink,
} from 'lucide-react'

function statusBadge(status: Doc<'hackathons'>['status']) {
  switch (status) {
    case 'live':
      return (
        <Badge className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-[10px]">
          Em andamento
        </Badge>
      )
    case 'upcoming':
      return (
        <Badge className="border-yellow-500/30 bg-yellow-500/15 text-yellow-400 text-[10px]">
          Em breve
        </Badge>
      )
    case 'finished':
      return (
        <Badge className="border-white/20 bg-white/10 text-[#b2b2b2] text-[10px]">
          Finalizado
        </Badge>
      )
  }
}

function votingBadge(open: boolean | undefined) {
  return open ? (
    <Badge className="border-[#2debb1]/30 bg-[#2debb1]/15 text-[#2debb1] text-[10px]">
      Aberta
    </Badge>
  ) : (
    <Badge className="border-white/20 bg-white/10 text-[#636363] text-[10px]">
      Fechada
    </Badge>
  )
}

export default function AdminHackathonsPage() {
  const hackathons = useQuery(api.hackathons.list)
  const deleteHackathon = useMutation(api.mutations.deleteHackathon)

  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Doc<'hackathons'> | null>(null)
  const [deleting, setDeleting] = useState<Doc<'hackathons'> | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!hackathons) return []
    if (!search.trim()) return hackathons
    const q = search.toLowerCase()
    return hackathons.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.edition.toLowerCase().includes(q) ||
        h.slug.toLowerCase().includes(q),
    )
  }, [hackathons, search])

  async function confirmDelete() {
    if (!deleting) return
    setDeletePending(true)
    setDeleteError(null)
    try {
      await deleteHackathon({ id: deleting._id })
      setDeleting(null)
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Erro ao deletar')
    } finally {
      setDeletePending(false)
    }
  }

  const isLoading = hackathons === undefined

  return (
    <div>
      <h1 className="mb-8 text-2xl font-black text-white">Hackathons</h1>

      {isLoading && (
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-4"
            >
              <Skeleton className="h-5 w-40 bg-white/10" />
              <Skeleton className="h-5 w-32 bg-white/10" />
              <Skeleton className="h-5 w-24 bg-white/10" />
              <div className="ml-auto flex gap-3">
                <Skeleton className="h-5 w-12 bg-white/10" />
                <Skeleton className="h-5 w-12 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hackathons && (
        <>
          {/* Action bar */}
          <div className="mb-2 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636363]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, edição ou slug…"
                className="w-full rounded-lg border border-white/[0.12] bg-[#2a2a2b] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#636363] focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
              />
            </div>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-1.5 bg-[#9810fa] text-white hover:bg-[#b040ff] active:scale-[0.97] transition-transform"
            >
              <Plus className="h-4 w-4" />
              Nova Edição
            </Button>
          </div>

          {/* Result count */}
          <p className="mb-4 text-xs text-[#636363]">
            {search.trim()
              ? `${filtered.length} de ${hackathons.length} hackathons`
              : `${hackathons.length} hackathons`}
          </p>

          {hackathons.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#2a2a2b] py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9810fa]/15">
                <Rocket className="h-7 w-7 text-[#9810fa]" />
              </div>
              <p className="mb-1 text-sm font-semibold text-white">
                Nenhum hackathon cadastrado
              </p>
              <p className="mb-5 text-xs text-[#636363]">
                Crie a primeira edição do hackathon.
              </p>
              <Button
                onClick={() => setShowCreate(true)}
                className="gap-1.5 bg-[#9810fa] text-white hover:bg-[#b040ff] active:scale-[0.97] transition-transform"
              >
                <Plus className="h-4 w-4" />
                Nova Edição
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="sticky top-0 z-10 border-b border-white/10 bg-[#2a2a2b] text-left">
                    <th
                      scope="col"
                      className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap"
                    >
                      Hackathon
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap"
                    >
                      Slug
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap"
                    >
                      Critérios
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363] whitespace-nowrap"
                    >
                      Votação
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h, i) => (
                    <tr
                      key={h._id}
                      className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.06] animate-in fade-in-0 slide-in-from-bottom-1 duration-300 fill-mode-both"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{h.name}</div>
                        <div className="text-xs text-[#636363]">{h.edition}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/${h.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[#636363] hover:text-white transition-colors"
                        >
                          /{h.slug}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[#b2b2b2]">{h.date}</td>
                      <td className="px-6 py-4">{statusBadge(h.status)}</td>
                      <td className="px-6 py-4 text-[#b2b2b2]">
                        {h.criteria.length}{' '}
                        <span className="text-[#636363]">
                          critério{h.criteria.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4">{votingBadge(h.votingOpen)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(h)}
                            aria-label={`Editar ${h.name}`}
                            className="h-7 w-7 p-0 rounded text-[#636363] hover:text-white hover:bg-white/10"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleting(h)}
                            aria-label={`Deletar ${h.name}`}
                            className="h-7 w-7 p-0 rounded text-[#636363] hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && hackathons.length > 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-[#636363]"
                      >
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

      <HackathonCreateDialog open={showCreate} onClose={() => setShowCreate(false)} />

      <HackathonEditDialog
        open={!!editing}
        hackathon={editing}
        onClose={() => setEditing(null)}
      />

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="gap-0 border-white/[0.08] bg-[#2a2a2b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deletar hackathon?</DialogTitle>
            <DialogDescription className="text-[#636363]">
              Esta ação é permanente. Todos os times, participantes, scores e votos
              vinculados a{' '}
              <span className="font-semibold text-white">
                {deleting?.name} — {deleting?.edition}
              </span>{' '}
              serão removidos.
            </DialogDescription>
          </DialogHeader>

          {deleteError && <p className="mt-4 text-sm text-red-400">{deleteError}</p>}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleting(null)}
              className="text-[#b2b2b2] hover:text-white"
              disabled={deletePending}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deletePending}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              {deletePending ? 'Deletando…' : 'Deletar definitivamente'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
