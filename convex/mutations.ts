import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const createHackathon = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    edition: v.string(),
    date: v.string(),
    status: v.union(
      v.literal('upcoming'),
      v.literal('live'),
      v.literal('finished'),
    ),
    criteria: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('hackathons', args)
  },
})

export const updateHackathon = mutation({
  args: {
    id: v.id('hackathons'),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    edition: v.optional(v.string()),
    date: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('upcoming'),
        v.literal('live'),
        v.literal('finished'),
      ),
    ),
    criteria: v.optional(v.array(v.string())),
    votingOpen: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...patch }) => {
    if (patch.slug) {
      const existing = await ctx.db
        .query('hackathons')
        .withIndex('by_slug', (q) => q.eq('slug', patch.slug!))
        .unique()
      if (existing && existing._id !== id) {
        throw new Error('Já existe um hackathon com esse slug')
      }
    }
    await ctx.db.patch(id, patch)
  },
})

export const deleteHackathon = mutation({
  args: { id: v.id('hackathons') },
  handler: async (ctx, { id }) => {
    const teams = await ctx.db
      .query('teams')
      .withIndex('by_hackathon', (q) => q.eq('hackathonId', id))
      .collect()
    for (const team of teams) {
      const scores = await ctx.db
        .query('scores')
        .withIndex('by_team', (q) => q.eq('teamId', team._id))
        .collect()
      for (const s of scores) await ctx.db.delete(s._id)

      const parts = await ctx.db
        .query('participants')
        .withIndex('by_team', (q) => q.eq('teamId', team._id))
        .collect()
      for (const p of parts) await ctx.db.delete(p._id)

      await ctx.db.delete(team._id)
    }

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_hackathon', (q) => q.eq('hackathonId', id))
      .collect()
    for (const vote of votes) await ctx.db.delete(vote._id)

    await ctx.db.delete(id)
  },
})

export const createTeam = mutation({
  args: {
    hackathonId: v.id('hackathons'),
    name: v.string(),
    project: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    position: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('teams', args)
  },
})

export const updateTeam = mutation({
  args: {
    id: v.id('teams'),
    name: v.optional(v.string()),
    project: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    position: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch)
  },
})

export const deleteTeam = mutation({
  args: { id: v.id('teams') },
  handler: async (ctx, { id }) => {
    const scores = await ctx.db
      .query('scores')
      .withIndex('by_team', (q) => q.eq('teamId', id))
      .collect()
    await Promise.all(scores.map((s) => ctx.db.delete(s._id)))

    const participants = await ctx.db
      .query('participants')
      .withIndex('by_team', (q) => q.eq('teamId', id))
      .collect()
    await Promise.all(participants.map((p) => ctx.db.delete(p._id)))

    await ctx.db.delete(id)
  },
})

export const createParticipant = mutation({
  args: {
    hackathonId: v.id('hackathons'),
    teamId: v.id('teams'),
    name: v.string(),
    avatar: v.optional(v.string()),
    role: v.optional(v.string()),
    experienceYears: v.optional(v.number()),
    metrics: v.object({
      tasksCompleted: v.number(),
      attendance: v.number(),
      contributions: v.number(),
      totalPoints: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('participants', args)
  },
})

export const updateParticipant = mutation({
  args: {
    id: v.id('participants'),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.optional(v.string()),
    experienceYears: v.optional(v.number()),
    teamId: v.optional(v.id('teams')),
    metrics: v.optional(
      v.object({
        tasksCompleted: v.number(),
        attendance: v.number(),
        contributions: v.number(),
        totalPoints: v.number(),
      }),
    ),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch)
  },
})

export const deleteParticipant = mutation({
  args: { id: v.id('participants') },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id)
  },
})

export const upsertScore = mutation({
  args: {
    hackathonId: v.id('hackathons'),
    teamId: v.id('teams'),
    criteriaKey: v.string(),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('scores')
      .withIndex('by_hackathon_team', (q) =>
        q.eq('hackathonId', args.hackathonId).eq('teamId', args.teamId),
      )
      .filter((q) => q.eq(q.field('criteriaKey'), args.criteriaKey))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value })
    } else {
      await ctx.db.insert('scores', args)
    }
  },
})

export const bulkImport = mutation({
  args: {
    hackathonId: v.id('hackathons'),
    clearExisting: v.boolean(),
    teams: v.array(v.object({
      name: v.string(),
      project: v.string(),
      description: v.optional(v.string()),
      tags: v.array(v.string()),
      members: v.array(v.object({
        name: v.string(),
        metrics: v.object({
          tasksCompleted: v.number(),
          attendance: v.number(),
          contributions: v.number(),
          totalPoints: v.number(),
        }),
      })),
    })),
  },
  handler: async (ctx, { hackathonId, clearExisting, teams }) => {
    if (clearExisting) {
      const existing = await ctx.db
        .query('teams')
        .withIndex('by_hackathon', (q) => q.eq('hackathonId', hackathonId))
        .collect()
      for (const team of existing) {
        const parts = await ctx.db
          .query('participants')
          .withIndex('by_team', (q) => q.eq('teamId', team._id))
          .collect()
        for (const p of parts) await ctx.db.delete(p._id)
        const scores = await ctx.db
          .query('scores')
          .withIndex('by_team', (q) => q.eq('teamId', team._id))
          .collect()
        for (const s of scores) await ctx.db.delete(s._id)
        await ctx.db.delete(team._id)
      }
    }
    let teamCount = 0
    let participantCount = 0
    for (const t of teams) {
      const teamId = await ctx.db.insert('teams', {
        hackathonId,
        name: t.name,
        project: t.project,
        description: t.description,
        tags: t.tags,
      })
      teamCount++
      for (const m of t.members) {
        await ctx.db.insert('participants', {
          hackathonId,
          teamId,
          name: m.name,
          metrics: m.metrics,
        })
        participantCount++
      }
    }
    return { teamCount, participantCount }
  },
})

export const toggleVoting = mutation({
  args: {
    hackathonId: v.id('hackathons'),
    votingOpen: v.boolean(),
  },
  handler: async (ctx, { hackathonId, votingOpen }) => {
    await ctx.db.patch(hackathonId, { votingOpen })
  },
})

export const castVote = mutation({
  args: {
    hackathonId: v.id('hackathons'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, { hackathonId, teamId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Você precisa estar logado para votar')
    const userId = identity.subject

    const hackathon = await ctx.db.get(hackathonId)
    if (!hackathon) throw new Error('Hackathon não encontrado')
    if (!hackathon.votingOpen) throw new Error('Votação não está aberta')

    const existing = await ctx.db
      .query('votes')
      .withIndex('by_hackathon_user', (q) =>
        q.eq('hackathonId', hackathonId).eq('userId', userId),
      )
      .unique()
    if (existing) throw new Error('Você já votou neste hackathon')

    const team = await ctx.db.get(teamId)
    if (!team || team.hackathonId !== hackathonId) {
      throw new Error('Time não encontrado neste hackathon')
    }

    await ctx.db.insert('votes', {
      hackathonId,
      teamId,
      userId,
      createdAt: Date.now(),
    })
  },
})
