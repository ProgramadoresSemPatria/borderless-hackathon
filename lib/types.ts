export interface HackathonConfig {
  name: string
  edition: string
  date: string
  status: 'ongoing' | 'finished'
  criteria: string[]
}

export interface Team {
  id: string
  name: string
  project: string
  description: string
  members: string[]       // participant IDs
  scores: Record<string, number>  // criterion -> score 0-10
  totalScore: number
  position: number | null
  coverImage?: string
  tags?: string[]
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  teamId: string
  metrics: {
    tasksCompleted: number
    attendance: number    // 0-100
    contributions: number
    totalPoints: number
  }
}

export type ImportedTeamRow = {
  Nome: string
  Projeto: string
  Descricao: string
  Membros: string         // comma-separated participant names
}

export type ImportedParticipantRow = {
  Nome: string
  Time: string
  Tasks: number
  Presenca: number
  Contribuicoes: number
}
