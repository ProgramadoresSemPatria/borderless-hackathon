import * as XLSX from 'xlsx'
import type { ImportedTeamRow, ImportedParticipantRow } from './types'

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
