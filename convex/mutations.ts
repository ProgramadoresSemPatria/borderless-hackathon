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
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch)
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
