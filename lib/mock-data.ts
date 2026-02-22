import type { HackathonConfig, Team, Participant } from './types'

export const hackathonConfig: HackathonConfig = {
  name: 'Borderless Hackathon',
  edition: '2026 — 1ª Edição',
  date: '15 de Fevereiro de 2026',
  status: 'finished',
  criteria: ['Inovação', 'Execução', 'Pitch', 'Impacto'],
}

export const participants: Participant[] = [
  {
    id: 'p1',
    name: 'Ana Souza',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    teamId: 't1',
    metrics: { tasksCompleted: 12, attendance: 95, contributions: 18, totalPoints: 980 },
  },
  {
    id: 'p2',
    name: 'Bruno Lima',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno',
    teamId: 't1',
    metrics: { tasksCompleted: 10, attendance: 90, contributions: 15, totalPoints: 870 },
  },
  {
    id: 'p3',
    name: 'Carla Mendes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla',
    teamId: 't2',
    metrics: { tasksCompleted: 11, attendance: 100, contributions: 20, totalPoints: 960 },
  },
  {
    id: 'p4',
    name: 'Diego Alves',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
    teamId: 't2',
    metrics: { tasksCompleted: 9, attendance: 85, contributions: 14, totalPoints: 820 },
  },
  {
    id: 'p5',
    name: 'Eduarda Costa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduarda',
    teamId: 't3',
    metrics: { tasksCompleted: 8, attendance: 80, contributions: 11, totalPoints: 750 },
  },
  {
    id: 'p6',
    name: 'Felipe Rocha',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe',
    teamId: 't3',
    metrics: { tasksCompleted: 7, attendance: 75, contributions: 9, totalPoints: 690 },
  },
  {
    id: 'p7',
    name: 'Gabriela Nunes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriela',
    teamId: 't4',
    metrics: { tasksCompleted: 10, attendance: 90, contributions: 16, totalPoints: 890 },
  },
  {
    id: 'p8',
    name: 'Henrique Dias',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henrique',
    teamId: 't4',
    metrics: { tasksCompleted: 6, attendance: 70, contributions: 8, totalPoints: 620 },
  },
]

export const teams: Team[] = [
  {
    id: 't1',
    name: 'DevForce',
    project: 'BorderBot',
    description: 'Assistente de IA para onboarding de embaixadores internacionais.',
    members: ['p1', 'p2'],
    scores: { Inovação: 9.5, Execução: 9.0, Pitch: 8.5, Impacto: 9.2 },
    totalScore: 9.05,
    position: 1,
    tags: ['IA', 'Onboarding', 'Bot'],
  },
  {
    id: 't2',
    name: 'Nexus',
    project: 'GlobeConnect',
    description: 'Plataforma de networking para embaixadores ao redor do mundo.',
    members: ['p3', 'p4'],
    scores: { Inovação: 8.8, Execução: 9.2, Pitch: 9.0, Impacto: 8.5 },
    totalScore: 8.875,
    position: 2,
    tags: ['Networking', 'Plataforma'],
  },
  {
    id: 't3',
    name: 'Alpha Squad',
    project: 'ImpactTrack',
    description: 'Dashboard de métricas de impacto para programas de aceleração.',
    members: ['p5', 'p6'],
    scores: { Inovação: 8.0, Execução: 7.5, Pitch: 8.2, Impacto: 8.8 },
    totalScore: 8.125,
    position: 3,
    tags: ['Dashboard', 'Métricas'],
  },
  {
    id: 't4',
    name: 'Builders',
    project: 'TalentRadar',
    description: 'Ferramenta de mapeamento de talentos tech na América Latina.',
    members: ['p7', 'p8'],
    scores: { Inovação: 7.5, Execução: 8.0, Pitch: 7.2, Impacto: 7.8 },
    totalScore: 7.625,
    position: 4,
    tags: ['Talentos', 'Mapeamento'],
  },
]

export function getParticipantById(id: string): Participant | undefined {
  return participants.find(p => p.id === id)
}

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id)
}

export function getTeamParticipants(teamId: string): Participant[] {
  return participants.filter(p => p.teamId === teamId)
}

export function getRankedTeams(): Team[] {
  return [...teams].sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
}

export function getRankedParticipants(): Participant[] {
  return [...participants].sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)
}
