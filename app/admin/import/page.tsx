'use client'
import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { parseTeamsSheet, parseParticipantsSheet, detectAndParseCsv, downloadTemplate } from '@/lib/excel'
import { Button } from '@/components/ui/button'
import type { ImportedTeamRow, ImportedParticipantRow } from '@/lib/types'
import { Upload, Download, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'

type ValidationError = {
  entity: 'time' | 'participante'
  row: number
  field: string
  message: string
}

type ImportMode = 'both' | 'teams-only' | 'participants-only'

function validate(
  teams: ImportedTeamRow[],
  participants: ImportedParticipantRow[],
  mode: ImportMode,
): ValidationError[] {
  const errors: ValidationError[] = []
  const teamNames = new Set<string>()

  if (mode !== 'participants-only') {
    teams.forEach((t, i) => {
      const name = String(t.Nome ?? '').trim()
      if (!name) {
        errors.push({ entity: 'time', row: i + 1, field: 'Nome', message: 'Nome do time é obrigatório' })
      }
      if (!String(t.Projeto ?? '').trim()) {
        errors.push({ entity: 'time', row: i + 1, field: 'Projeto', message: 'Nome do projeto é obrigatório' })
      }
      if (name) {
        if (teamNames.has(name)) {
          errors.push({ entity: 'time', row: i + 1, field: 'Nome', message: `Time "${name}" duplicado` })
        }
        teamNames.add(name)
      }
    })
  } else {
    participants.forEach((p) => {
      const name = String(p.Time ?? '').trim()
      if (name) teamNames.add(name)
    })
  }

  if (mode !== 'teams-only') {
    participants.forEach((p, i) => {
      if (!String(p.Nome ?? '').trim()) {
        errors.push({ entity: 'participante', row: i + 1, field: 'Nome', message: 'Nome do participante é obrigatório' })
      }
      const teamName = String(p.Time ?? '').trim()
      if (!teamName) {
        errors.push({ entity: 'participante', row: i + 1, field: 'Time', message: 'Time é obrigatório' })
      } else if (mode === 'both' && !teamNames.has(teamName)) {
        errors.push({ entity: 'participante', row: i + 1, field: 'Time', message: `Time "${teamName}" não encontrado na lista de times` })
      }
      const presenca = Number(p.Presenca)
      if (p.Presenca !== undefined && !isNaN(presenca) && (presenca < 0 || presenca > 100)) {
        errors.push({ entity: 'participante', row: i + 1, field: 'Presenca', message: 'Presença deve ser entre 0 e 100' })
      }
      const tasks = Number(p.Tasks)
      if (p.Tasks !== undefined && !isNaN(tasks) && tasks < 0) {
        errors.push({ entity: 'participante', row: i + 1, field: 'Tasks', message: 'Tasks deve ser >= 0' })
      }
      const contrib = Number(p.Contribuicoes)
      if (p.Contribuicoes !== undefined && !isNaN(contrib) && contrib < 0) {
        errors.push({ entity: 'participante', row: i + 1, field: 'Contribuicoes', message: 'Contribuições deve ser >= 0' })
      }
    })
  }

  return errors
}

function calcPoints(p: ImportedParticipantRow): number {
  return (Number(p.Tasks) || 0) + (Number(p.Presenca) || 0) / 10 + (Number(p.Contribuicoes) || 0)
}

export default function ImportPage() {
  const hackathons = useQuery(api.hackathons.list)
  const bulkImport = useMutation(api.mutations.bulkImport)

  const [selectedId, setSelectedId] = useState<Id<'hackathons'> | null>(null)
  const [teams, setTeams] = useState<ImportedTeamRow[]>([])
  const [participants, setParticipants] = useState<ImportedParticipantRow[]>([])
  const [mode, setMode] = useState<ImportMode>('both')
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [fileError, setFileError] = useState('')
  const [clearExisting, setClearExisting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ teamCount: number; participantCount: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (hackathons?.length === 1 && !selectedId) {
      setSelectedId(hackathons[0]._id)
    }
  }, [hackathons, selectedId])

  async function handleFile(file: File) {
    setFileError('')
    setErrors([])
    setImportResult(null)
    setTeams([])
    setParticipants([])

    try {
      if (file.name.endsWith('.csv')) {
        const result = await detectAndParseCsv(file)
        const m: ImportMode = result.type === 'teams' ? 'teams-only' : 'participants-only'
        setMode(m)
        setTeams(result.teams)
        setParticipants(result.participants)
        setErrors(validate(result.teams, result.participants, m))
      } else {
        const [t, p] = await Promise.all([parseTeamsSheet(file), parseParticipantsSheet(file)])
        setMode('both')
        setTeams(t)
        setParticipants(p)
        setErrors(validate(t, p, 'both'))
      }
    } catch {
      setFileError('Erro ao ler o arquivo. Verifique se está no formato correto.')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleConfirm() {
    if (!selectedId) return
    setImporting(true)
    try {
      type MemberInput = {
        name: string
        metrics: { tasksCompleted: number; attendance: number; contributions: number; totalPoints: number }
      }
      type TeamInput = { name: string; project: string; description?: string; tags: string[]; members: MemberInput[] }

      let mergedTeams: TeamInput[]

      if (mode === 'teams-only') {
        mergedTeams = teams.map((t) => ({
          name: String(t.Nome).trim(),
          project: String(t.Projeto).trim(),
          description: t.Descricao ? String(t.Descricao).trim() : undefined,
          tags: [],
          members: [],
        }))
      } else if (mode === 'participants-only') {
        const uniqueTeams = [...new Set(participants.map((p) => String(p.Time).trim()).filter(Boolean))]
        mergedTeams = uniqueTeams.map((teamName) => ({
          name: teamName,
          project: '(a definir)',
          tags: [],
          members: participants
            .filter((p) => String(p.Time).trim() === teamName)
            .map((p) => ({
              name: String(p.Nome).trim(),
              metrics: {
                tasksCompleted: Number(p.Tasks) || 0,
                attendance: Number(p.Presenca) || 0,
                contributions: Number(p.Contribuicoes) || 0,
                totalPoints: calcPoints(p),
              },
            })),
        }))
      } else {
        mergedTeams = teams.map((t) => ({
          name: String(t.Nome).trim(),
          project: String(t.Projeto).trim(),
          description: t.Descricao ? String(t.Descricao).trim() : undefined,
          tags: [],
          members: participants
            .filter((p) => String(p.Time).trim() === String(t.Nome).trim())
            .map((p) => ({
              name: String(p.Nome).trim(),
              metrics: {
                tasksCompleted: Number(p.Tasks) || 0,
                attendance: Number(p.Presenca) || 0,
                contributions: Number(p.Contribuicoes) || 0,
                totalPoints: calcPoints(p),
              },
            })),
        }))
      }

      const result = await bulkImport({ hackathonId: selectedId, clearExisting, teams: mergedTeams })
      setImportResult(result)
      setTeams([])
      setParticipants([])
      setErrors([])
    } catch (e) {
      setFileError('Erro ao importar dados. Tente novamente.')
      console.error(e)
    } finally {
      setImporting(false)
    }
  }

  const hasData = teams.length > 0 || participants.length > 0
  const hasErrors = errors.length > 0

  return (
    <div className="max-w-3xl">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Importar Dados</h1>
        <Button
          variant="ghost"
          onClick={downloadTemplate}
          className="gap-2 rounded text-xs font-semibold uppercase tracking-[0.08em] text-[#636363] hover:bg-white/10 hover:text-white"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Baixar Template
        </Button>
      </div>
      <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
        Aceita .xlsx, .xls e .csv. Use o template acima para garantir o formato correto.
      </p>

      {/* Hackathon selector */}
      <div className="mb-6">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
          Hackathon de destino
        </label>
        {hackathons === undefined ? (
          <div className="h-10 animate-pulse rounded-lg bg-white/5" />
        ) : hackathons.length === 0 ? (
          <p className="text-sm text-red-400">Nenhum hackathon encontrado. Crie um primeiro.</p>
        ) : (
          <div className="relative">
            <select
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId((e.target.value as Id<'hackathons'>) || null)}
              className="w-full appearance-none rounded-lg border border-white/[0.12] bg-[#2a2a2b] px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
            >
              {hackathons.length > 1 && <option value="">Selecione um hackathon…</option>}
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

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Área de upload — arraste um arquivo ou clique para selecionar"
        className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-[#2a2a2b] p-12 transition-colors hover:border-[#9810fa]/50 hover:bg-[#9810fa]/[0.03] focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
      >
        <Upload className="mb-3 h-10 w-10 text-[#636363]" aria-hidden="true" />
        <p className="text-sm font-medium text-[#b2b2b2]">Arraste o arquivo ou clique para selecionar</p>
        <p className="mt-1 text-xs text-[#636363]">.xlsx, .xls ou .csv</p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />
      </div>

      {fileError && (
        <div role="alert" className="mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          {fileError}
        </div>
      )}

      {importResult && (
        <div role="status" className="mb-4 flex items-center gap-2 rounded border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-400">
          <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Importação concluída: {importResult.teamCount} time{importResult.teamCount !== 1 ? 's' : ''} e{' '}
          {importResult.participantCount} participante{importResult.participantCount !== 1 ? 's' : ''} criados.
        </div>
      )}

      {/* Validation errors */}
      {hasErrors && (
        <div role="alert" className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-400">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {errors.length} erro{errors.length !== 1 ? 's' : ''} encontrado{errors.length !== 1 ? 's' : ''}
          </div>
          <ul className="space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-red-400/80">
                <span className="font-semibold capitalize">{err.entity}</span> linha {err.row} · {err.field}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview */}
      {hasData && !hasErrors && (
        <div className="space-y-6">
          {mode === 'teams-only' && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9810fa]">
              CSV de times detectado
            </p>
          )}
          {mode === 'participants-only' && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2debb1]">
              CSV de participantes detectado — times derivados automaticamente
            </p>
          )}

          {teams.length > 0 && (
            <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-5">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                Times ({teams.length})
              </h3>
              <div>
                {teams.map((t, i) => (
                  <div
                    key={`${t.Nome ?? ''}-${i}`}
                    className="flex justify-between border-b border-white/[0.06] py-2.5 last:border-0 text-sm"
                  >
                    <span className="font-medium text-white">{t.Nome}</span>
                    <span className="text-[#b2b2b2]">{t.Projeto}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {participants.length > 0 && (
            <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-5">
              <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                Participantes ({participants.length})
              </h3>
              <div>
                {participants.map((p, i) => (
                  <div
                    key={`${p.Nome ?? ''}-${i}`}
                    className="flex justify-between border-b border-white/[0.06] py-2.5 last:border-0 text-sm"
                  >
                    <span className="font-medium text-white">{p.Nome}</span>
                    <span className="text-[#b2b2b2]">{p.Time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="flex cursor-pointer select-none items-center gap-3">
            <input
              type="checkbox"
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="h-4 w-4 rounded accent-[#9810fa]"
            />
            <span className="text-sm text-[#b2b2b2]">Substituir dados existentes deste hackathon</span>
          </label>

          {!selectedId && (
            <p className="text-xs text-amber-400">Selecione um hackathon antes de confirmar.</p>
          )}

          <Button
            onClick={handleConfirm}
            disabled={!selectedId || importing}
            className="w-full rounded-lg bg-[#9810fa] py-3 font-semibold text-white hover:bg-[#9810fa]/90 disabled:opacity-50"
          >
            {importing ? 'Importando…' : 'Confirmar Importação'}
          </Button>
        </div>
      )}
    </div>
  )
}
