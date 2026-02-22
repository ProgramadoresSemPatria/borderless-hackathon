'use client'
import { useState, useRef } from 'react'
import { parseTeamsSheet, parseParticipantsSheet, downloadTemplate } from '@/lib/excel'
import { GradientText } from '@/components/animated/gradient-text'
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
    // In a real app, this would call an API. For now, just show success.
    setSuccess(true)
    setTeams([])
    setParticipants([])
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          <GradientText>Importar Dados</GradientText>
        </h1>
        <Button
          variant="ghost"
          onClick={downloadTemplate}
          className="gap-2 text-[#b2b2b2] hover:text-white"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Baixar Template
        </Button>
      </div>
      <p className="mb-8 text-sm text-[#b2b2b2]">
        Importe a planilha com times e participantes. Use o template acima para garantir o formato correto.
      </p>

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Área de upload — arraste um arquivo .xlsx ou clique para selecionar"
        className="glass mb-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 p-12 transition-colors hover:border-[#9810fa]/50 focus:outline-none focus:ring-2 focus:ring-[#9810fa]"
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
        <div role="alert" className="mb-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      )}

      {success && (
        <div role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-[#2debb1]/10 p-4 text-sm text-[#2debb1]">
          <CheckCircle className="h-4 w-4" aria-hidden="true" />
          Dados importados com sucesso!
        </div>
      )}

      {/* Preview */}
      {teams.length > 0 && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold text-white">Times ({teams.length})</h3>
            <div className="space-y-2">
              {teams.map((t, i) => (
                <div key={t.Nome ?? i} className="flex justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="font-medium text-white">{t.Nome}</span>
                  <span className="text-[#b2b2b2]">{t.Projeto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold text-white">Participantes ({participants.length})</h3>
            <div className="space-y-2">
              {participants.map((p, i) => (
                <div key={p.Nome ?? i} className="flex justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="font-medium text-white">{p.Nome}</span>
                  <span className="text-[#b2b2b2]">{p.Time}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full bg-[#9810fa] hover:bg-[#b040ff] text-white font-semibold py-6"
          >
            Confirmar Importação
          </Button>
        </div>
      )}
    </div>
  )
}
