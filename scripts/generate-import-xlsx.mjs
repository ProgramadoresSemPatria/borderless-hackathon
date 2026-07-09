#!/usr/bin/env node
/**
 * Gera XLSX prontos para importação no admin (/admin/teams → Importar).
 * Fonte: data/source/2025-editions.json (derivado da planilha auditada)
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'data', 'import')

const source = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'source', '2025-editions.json'), 'utf8'),
)

function teamSortKey(name) {
  return parseInt(String(name).replace(/\D/g, ''), 10) || 0
}

function buildEditionSheets(edition) {
  const teamMap = new Map()

  for (const p of edition.participants) {
    if (!teamMap.has(p.team)) teamMap.set(p.team, [])
    teamMap.get(p.team).push(p)
  }

  const teamsRows = [...teamMap.entries()]
    .sort((a, b) => teamSortKey(a[0]) - teamSortKey(b[0]))
    .map(([teamName, members]) => ({
      Nome: teamName,
      Projeto: '—',
      Descricao: '',
      Membros: members.map((m) => m.name).join(', '),
      Demo: '',
      GitHub: '',
      Apresentacao: '',
    }))

  const participantsRows = edition.participants.map((p) => ({
    Nome: p.name,
    Time: p.team,
    Tasks: 0,
    Presenca: 0,
    Contribuicoes: p.points,
  }))

  return { teamsRows, participantsRows }
}

fs.mkdirSync(OUT_DIR, { recursive: true })

const masterWb = XLSX.utils.book_new()

for (const edition of source.editions) {
  const { teamsRows, participantsRows } = buildEditionSheets(edition)

  const wb = XLSX.utils.book_new()
  const teamsWs = XLSX.utils.json_to_sheet(teamsRows)
  const partsWs = XLSX.utils.json_to_sheet(participantsRows)
  XLSX.utils.book_append_sheet(wb, teamsWs, 'Times')
  XLSX.utils.book_append_sheet(wb, partsWs, 'Participantes')

  const filePath = path.join(OUT_DIR, `${edition.slug}-import.xlsx`)
  XLSX.writeFile(wb, filePath)

  XLSX.utils.book_append_sheet(masterWb, teamsWs, `${edition.label} Times`)
  XLSX.utils.book_append_sheet(masterWb, partsWs, `${edition.label} Participantes`)

  console.log(`✓ ${edition.slug}-import.xlsx — ${teamsRows.length} times, ${participantsRows.length} participantes`)
}

const lbRows = source.annualLeaderboard.map((r, i) => ({
  Posicao: i + 1,
  Nome: r.name,
  '2025.1': r.h1 ?? '',
  '2025.2': r.h2 ?? '',
  '2025.3': r.h3 ?? '',
  Media: r.average ?? '',
  'Pontuação geral': r.total,
}))
XLSX.utils.book_append_sheet(masterWb, XLSX.utils.json_to_sheet(lbRows), 'Ranking Anual 2025')

const masterPath = path.join(OUT_DIR, 'borderless-2025-completo-import.xlsx')
XLSX.writeFile(masterWb, masterPath)
console.log(`✓ borderless-2025-completo-import.xlsx (${masterWb.SheetNames.length} abas)`)
