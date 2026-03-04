import * as XLSX from 'xlsx'
import type { ImportedTeamRow, ImportedParticipantRow } from './types'

type TeamForExport = {
  _id: string
  name: string
  project: string
  position?: number | null
  totalScore: number
  memberNames: string[]
  scores: Array<{ criteriaKey: string; value: number }>
}

type ParticipantForExport = {
  _id: string
  name: string
  teamId: string
  metrics: {
    tasksCompleted: number
    attendance: number
    contributions: number
    totalPoints: number
  }
}

export function parseTeamsSheet(file: File): Promise<ImportedTeamRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<ImportedTeamRow>(ws)
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function parseParticipantsSheet(file: File): Promise<ImportedParticipantRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const sheetName = wb.SheetNames[1] ?? wb.SheetNames[0]
        const ws = wb.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json<ImportedParticipantRow>(ws)
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function detectAndParseCsv(file: File): Promise<{
  type: 'teams' | 'participants'
  teams: ImportedTeamRow[]
  participants: ImportedParticipantRow[]
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target!.result as string
        const wb = XLSX.read(text, { type: 'string' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
        if (rows.length === 0) {
          reject(new Error('Arquivo CSV vazio'))
          return
        }
        const keys = Object.keys(rows[0])
        const isParticipants = keys.some((k) => k === 'Time' || k === 'Tasks' || k === 'Presenca')
        if (isParticipants) {
          resolve({ type: 'participants', teams: [], participants: rows as ImportedParticipantRow[] })
        } else {
          resolve({ type: 'teams', teams: rows as ImportedTeamRow[], participants: [] })
        }
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Falha ao ler arquivo CSV'))
    reader.readAsText(file)
  })
}

export function downloadTemplate(): void {
  if (typeof window === 'undefined') return
  const wb = XLSX.utils.book_new()

  // Teams sheet
  const teamsWs = XLSX.utils.aoa_to_sheet([
    ['Nome', 'Projeto', 'Descricao', 'Membros'],
    ['DevForce', 'BorderBot', 'Descrição do projeto', 'Ana Souza, Bruno Lima'],
  ])
  XLSX.utils.book_append_sheet(wb, teamsWs, 'Times')

  // Participants sheet
  const participantsWs = XLSX.utils.aoa_to_sheet([
    ['Nome', 'Time', 'Tasks', 'Presenca', 'Contribuicoes'],
    ['Ana Souza', 'DevForce', 12, 95, 18],
  ])
  XLSX.utils.book_append_sheet(wb, participantsWs, 'Participantes')

  XLSX.writeFile(wb, 'template-hackathon.xlsx')
}

export function exportReport(
  teams: import('./types').Team[],
  participants: import('./types').Participant[],
  criteria: string[]
): void {
  if (typeof window === 'undefined') return
  const wb = XLSX.utils.book_new()

  // Teams sheet
  const teamsHeaders = ['Posição', 'Nome', 'Projeto', 'Membros', ...criteria, 'Total']
  const teamsRows = teams
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .map(t => [
      t.position ?? '—',
      t.name,
      t.project,
      t.members.map(id => participants.find(p => p.id === id)?.name ?? id).join(', '),
      ...criteria.map(c => t.scores[c] ?? 0),
      t.totalScore,
    ])
  const teamsWs = XLSX.utils.aoa_to_sheet([teamsHeaders, ...teamsRows])
  XLSX.utils.book_append_sheet(wb, teamsWs, 'Times')

  // Participants sheet — Participant type uses teamId for the team reference
  const partHeaders = ['Posição', 'Nome', 'Time', 'Tasks', 'Presença', 'Contribuições', 'Total Pontos']
  const partRows = [...participants]
    .sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)
    .map((p, i) => {
      const team = teams.find(t => t.id === p.teamId)
      return [i + 1, p.name, team?.name ?? '—', p.metrics.tasksCompleted, p.metrics.attendance, p.metrics.contributions, p.metrics.totalPoints]
    })
  const partWs = XLSX.utils.aoa_to_sheet([partHeaders, ...partRows])
  XLSX.utils.book_append_sheet(wb, partWs, 'Participantes')

  XLSX.writeFile(wb, 'relatorio-hackathon.xlsx')
}

export function exportReportFromConvex(
  teams: TeamForExport[],
  participants: ParticipantForExport[],
  criteria: string[]
): void {
  if (typeof window === 'undefined') return
  const wb = XLSX.utils.book_new()

  const teamsHeaders = ['Posição', 'Nome', 'Projeto', 'Membros', ...criteria, 'Total']
  const teamsRows = [...teams]
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .map((t) => [
      t.position ?? '—',
      t.name,
      t.project,
      t.memberNames.join(', '),
      ...criteria.map((c) => t.scores.find((s) => s.criteriaKey === c)?.value ?? 0),
      t.totalScore,
    ])
  const teamsWs = XLSX.utils.aoa_to_sheet([teamsHeaders, ...teamsRows])
  XLSX.utils.book_append_sheet(wb, teamsWs, 'Times')

  const teamMap = new Map(teams.map((t) => [t._id, t.name]))
  const partHeaders = ['Posição', 'Nome', 'Time', 'Tasks', 'Presença', 'Contribuições', 'Total Pontos']
  const partRows = [...participants]
    .sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)
    .map((p, i) => [
      i + 1,
      p.name,
      teamMap.get(p.teamId) ?? '—',
      p.metrics.tasksCompleted,
      p.metrics.attendance,
      p.metrics.contributions,
      p.metrics.totalPoints,
    ])
  const partWs = XLSX.utils.aoa_to_sheet([partHeaders, ...partRows])
  XLSX.utils.book_append_sheet(wb, partWs, 'Participantes')

  XLSX.writeFile(wb, 'relatorio-hackathon.xlsx')
}

export function exportTeamsCsv(teams: TeamForExport[], criteria: string[]): void {
  if (typeof window === 'undefined') return
  const headers = ['Posição', 'Nome', 'Projeto', 'Membros', ...criteria, 'Total']
  const rows = [...teams]
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .map((t) => [
      t.position ?? '—',
      t.name,
      t.project,
      t.memberNames.join(', '),
      ...criteria.map((c) => t.scores.find((s) => s.criteriaKey === c)?.value ?? 0),
      t.totalScore,
    ])
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Times')
  XLSX.writeFile(wb, 'times.csv', { bookType: 'csv' })
}

export function exportParticipantsCsv(
  participants: ParticipantForExport[],
  teams: TeamForExport[]
): void {
  if (typeof window === 'undefined') return
  const teamMap = new Map(teams.map((t) => [t._id, t.name]))
  const headers = ['Posição', 'Nome', 'Time', 'Tasks', 'Presença', 'Contribuições', 'Total Pontos']
  const rows = [...participants]
    .sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)
    .map((p, i) => [
      i + 1,
      p.name,
      teamMap.get(p.teamId) ?? '—',
      p.metrics.tasksCompleted,
      p.metrics.attendance,
      p.metrics.contributions,
      p.metrics.totalPoints,
    ])
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Participantes')
  XLSX.writeFile(wb, 'participantes.csv', { bookType: 'csv' })
}
