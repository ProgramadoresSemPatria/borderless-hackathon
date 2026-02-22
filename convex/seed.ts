import { mutation } from './_generated/server'

export const seedFromMock = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('hackathons').first()
    if (existing) return { message: 'Already seeded', hackathonId: existing._id }

    const hackathonId = await ctx.db.insert('hackathons', {
      slug: 'bl-hackathon-2026-1',
      name: 'Borderless Hackathon',
      edition: '2026 — 1ª Edição',
      date: '15 de Fevereiro de 2026',
      status: 'finished',
      criteria: ['Inovação', 'Execução', 'Pitch', 'Impacto'],
    })

    const t1Id = await ctx.db.insert('teams', {
      hackathonId,
      name: 'DevForce',
      project: 'BorderBot',
      description: 'Assistente de IA para onboarding de embaixadores internacionais.',
      tags: ['IA', 'Onboarding', 'Bot'],
      position: 1,
    })
    const t2Id = await ctx.db.insert('teams', {
      hackathonId,
      name: 'Nexus',
      project: 'GlobeConnect',
      description: 'Plataforma de networking para embaixadores ao redor do mundo.',
      tags: ['Networking', 'Plataforma'],
      position: 2,
    })
    const t3Id = await ctx.db.insert('teams', {
      hackathonId,
      name: 'Alpha Squad',
      project: 'ImpactTrack',
      description: 'Dashboard de métricas de impacto para programas de aceleração.',
      tags: ['Dashboard', 'Métricas'],
      position: 3,
    })
    const t4Id = await ctx.db.insert('teams', {
      hackathonId,
      name: 'Builders',
      project: 'TalentRadar',
      description: 'Ferramenta de mapeamento de talentos tech na América Latina.',
      tags: ['Talentos', 'Mapeamento'],
      position: 4,
    })

    const scoreData = [
      { teamId: t1Id, scores: { 'Inovação': 9.5, 'Execução': 9.0, 'Pitch': 8.5, 'Impacto': 9.2 } },
      { teamId: t2Id, scores: { 'Inovação': 8.8, 'Execução': 9.2, 'Pitch': 9.0, 'Impacto': 8.5 } },
      { teamId: t3Id, scores: { 'Inovação': 8.0, 'Execução': 7.5, 'Pitch': 8.2, 'Impacto': 8.8 } },
      { teamId: t4Id, scores: { 'Inovação': 7.5, 'Execução': 8.0, 'Pitch': 7.2, 'Impacto': 7.8 } },
    ]
    for (const { teamId, scores } of scoreData) {
      for (const [criteriaKey, value] of Object.entries(scores)) {
        await ctx.db.insert('scores', { hackathonId, teamId, criteriaKey, value })
      }
    }

    const participantData = [
      { teamId: t1Id, name: 'Ana Souza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', metrics: { tasksCompleted: 12, attendance: 95, contributions: 18, totalPoints: 980 } },
      { teamId: t1Id, name: 'Bruno Lima', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno', metrics: { tasksCompleted: 10, attendance: 90, contributions: 15, totalPoints: 870 } },
      { teamId: t2Id, name: 'Carla Mendes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla', metrics: { tasksCompleted: 11, attendance: 100, contributions: 20, totalPoints: 960 } },
      { teamId: t2Id, name: 'Diego Alves', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego', metrics: { tasksCompleted: 9, attendance: 85, contributions: 14, totalPoints: 820 } },
      { teamId: t3Id, name: 'Eduarda Costa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduarda', metrics: { tasksCompleted: 8, attendance: 80, contributions: 11, totalPoints: 750 } },
      { teamId: t3Id, name: 'Felipe Rocha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe', metrics: { tasksCompleted: 7, attendance: 75, contributions: 9, totalPoints: 690 } },
      { teamId: t4Id, name: 'Gabriela Nunes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriela', metrics: { tasksCompleted: 10, attendance: 90, contributions: 16, totalPoints: 890 } },
      { teamId: t4Id, name: 'Henrique Dias', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henrique', metrics: { tasksCompleted: 6, attendance: 70, contributions: 8, totalPoints: 620 } },
    ]
    for (const p of participantData) {
      await ctx.db.insert('participants', { hackathonId, ...p })
    }

    return { message: 'Seeded successfully', hackathonId }
  },
})
