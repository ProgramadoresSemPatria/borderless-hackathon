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
      <p className="mb-8 text-sm text-[#b2b2b2]">
        Gera um arquivo .xlsx com o ranking completo de times e o leaderboard individual de participantes.
      </p>

      <div className="glass rounded-2xl p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#2debb1]/20">
            <FileSpreadsheet className="h-6 w-6 text-[#2debb1]" aria-hidden="true" />
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
          <div className="rounded-xl bg-white/5 p-3">
            <div className="font-semibold text-white">{teams.length} times</div>
            <div className="text-[#636363]">com {hackathonConfig.criteria.length} critérios</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="font-semibold text-white">{participants.length} participantes</div>
            <div className="text-[#636363]">com métricas individuais</div>
          </div>
        </div>

        <Button
          onClick={handleExport}
          className="w-full gap-2 bg-[#2debb1] hover:bg-[#24c994] text-[#111] font-bold py-6 text-base"
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          Exportar Relatório Excel
        </Button>
      </div>
    </div>
  )
}
