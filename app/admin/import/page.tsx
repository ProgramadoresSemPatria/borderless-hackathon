'use client'
import { useState, useRef } from 'react'
import { parseTeamsSheet, parseParticipantsSheet, downloadTemplate } from '@/lib/excel'
import { Button } from '@/components/ui/button'
import type { ImportedTeamRow, ImportedParticipantRow } from '@/lib/types'
import { Upload, Download, CheckCircle } from 'lucide-react'

export default function ImportPage() {
  const [teams, setTeams] = useState<ImportedTeamRow[]>([])
  const [participants, setParticipants] = useState<ImportedParticipantRow[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError('')
    setSuccess(false)
    try {
      const [t, p] = await Promise.all([parseTeamsSheet(file), parseParticipantsSheet(file)])
      setTeams(t)
      setParticipants(p)
    } catch {
      setError('Erro ao ler o arquivo. Verifique se está no formato correto.')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleConfirm() {
    setSuccess(true)
    setTeams([])
    setParticipants([])
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Importar Dados
        </h1>
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
        Importe a planilha com times e participantes. Use o template acima para garantir o formato correto.
      </p>

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Área de upload — arraste um arquivo .xlsx ou clique para selecionar"
        className="mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-[#2a2a2b] p-12 transition-colors hover:bg-[#9810fa]/[0.03] hover:border-[#9810fa]/50 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
      >
        <Upload className="mb-3 h-10 w-10 text-[#636363]" aria-hidden="true" />
        <p className="text-sm font-medium text-[#b2b2b2]">Arraste o arquivo .xlsx ou clique para selecionar</p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">{error}</div>
      )}

      {success && (
        <div role="status" className="mb-4 flex items-center gap-2 rounded border border-green-500/20 bg-green-500/10 p-3 text-xs text-green-400">
          <CheckCircle className="h-4 w-4" aria-hidden="true" />
          Dados importados com sucesso!
        </div>
      )}

      {/* Preview */}
      {teams.length > 0 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Times ({teams.length})</h3>
            <div>
              {teams.map((t, i) => (
                <div key={`${t.Nome ?? ''}-${i}`} className="flex justify-between border-b border-white/[0.06] py-2.5 last:border-0 text-sm">
                  <span className="font-medium text-white">{t.Nome}</span>
                  <span className="text-[#b2b2b2]">{t.Projeto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Participantes ({participants.length})</h3>
            <div>
              {participants.map((p, i) => (
                <div key={`${p.Nome ?? ''}-${i}`} className="flex justify-between border-b border-white/[0.06] py-2.5 last:border-0 text-sm">
                  <span className="font-medium text-white">{p.Nome}</span>
                  <span className="text-[#b2b2b2]">{p.Time}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full bg-[#9810fa] hover:bg-[#9810fa]/90 text-white font-semibold rounded-lg py-3"
          >
            Confirmar Importação
          </Button>
        </div>
      )}
    </div>
  )
}
