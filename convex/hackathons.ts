import { query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('hackathons')
      .order('desc')
      .collect()
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query('hackathons')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
  },
})

export const getTeamsRanked = query({
  args: { hackathonId: v.id('hackathons') },
  handler: async (ctx, { hackathonId }) => {
    const teams = await ctx.db
      .query('teams')
      .withIndex('by_hackathon', (q) => q.eq('hackathonId', hackathonId))
      .collect()

    const teamsWithScores = await Promise.all(
      teams.map(async (team) => {
        const scores = await ctx.db
          .query('scores')
          .withIndex('by_team', (q) => q.eq('teamId', team._id))
          .collect()

        const totalScore =
          scores.length > 0
            ? parseFloat(
                (scores.reduce((sum, s) => sum + s.value, 0) / scores.length).toFixed(3),
              )
            : 0

        const members = await ctx.db
          .query('participants')
          .withIndex('by_team', (q) => q.eq('teamId', team._id))
          .collect()

        const scoresArray = scores.map(s => ({ criteriaKey: s.criteriaKey, value: s.value }))

        return { ...team, scores: scoresArray, totalScore, memberNames: members.map(m => m.name), members: members.map(m => ({ _id: m._id, name: m.name, role: m.role })) }
      }),
    )

    return teamsWithScores.sort(
      (a, b) => (a.position ?? 99) - (b.position ?? 99),
    )
  },
})

export const getParticipantsRanked = query({
  args: { hackathonId: v.id('hackathons') },
  handler: async (ctx, { hackathonId }) => {
    const participants = await ctx.db
      .query('participants')
      .withIndex('by_hackathon', (q) => q.eq('hackathonId', hackathonId))
      .collect()

    return participants.sort(
      (a, b) => b.metrics.totalPoints - a.metrics.totalPoints,
    )
  },
})

export const getTeam = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db.get(teamId)
    if (!team) return null

    const scores = await ctx.db
      .query('scores')
      .withIndex('by_team', (q) => q.eq('teamId', teamId))
      .collect()

    const totalScore =
      scores.length > 0
        ? parseFloat(
            (scores.reduce((sum, s) => sum + s.value, 0) / scores.length).toFixed(3),
          )
        : 0

    const members = await ctx.db
      .query('participants')
      .withIndex('by_team', (q) => q.eq('teamId', teamId))
      .collect()

    const scoresArray = scores.map(s => ({ criteriaKey: s.criteriaKey, value: s.value }))

    return { ...team, scores: scoresArray, totalScore, members }
  },
})
