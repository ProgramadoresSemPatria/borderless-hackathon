'use client'
import { exportReport } from '@/lib/excel'
import { teams, participants, hackathonConfig } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet } from 'lucide-react'

export default function ExportPage() {
  function handleExport() {
    exportReport(teams, participants, hackathonConfig.criteria)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">
        Exportar Relatório
      </h1>
      <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
        Gera um arquivo .xlsx com o ranking completo de times e o leaderboard individual de participantes.
      </p>

      <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded border border-white/15 bg-white/[0.05]">
            <FileSpreadsheet className="h-6 w-6 text-[#b2b2b2]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-white">relatorio-hackathon.xlsx</h3>
            <p className="text-sm text-[#b2b2b2]">
              Contém 2 abas: <strong className="text-white">Times</strong> (posição, nome, projeto, critérios, total) e{' '}
              <strong className="text-white">Participantes</strong> (posição, nome, time, métricas, pontos).
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded border border-white/[0.08] bg-white/[0.03] p-3">
            <div className="font-semibold text-white">{teams.length} times</div>
            <div className="text-[#636363]">com {hackathonConfig.criteria.length} critérios</div>
          </div>
          <div className="rounded border border-white/[0.08] bg-white/[0.03] p-3">
            <div className="font-semibold text-white">{participants.length} participantes</div>
            <div className="text-[#636363]">com métricas individuais</div>
          </div>
        </div>

        <Button
          onClick={handleExport}
          className="w-full gap-2 bg-[#9810fa] hover:bg-[#9810fa]/90 text-white font-bold rounded-lg py-3 text-base"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Exportar Relatório Excel
        </Button>
      </div>
    </div>
  )
}
