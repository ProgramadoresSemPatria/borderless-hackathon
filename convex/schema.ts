import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  hackathons: defineTable({
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
    votingOpen: v.optional(v.boolean()),
  }).index('by_slug', ['slug']),

  teams: defineTable({
    hackathonId: v.id('hackathons'),
    name: v.string(),
    project: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    position: v.optional(v.number()),
  }).index('by_hackathon', ['hackathonId']),

  participants: defineTable({
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
  })
    .index('by_hackathon', ['hackathonId'])
    .index('by_team', ['teamId']),

  scores: defineTable({
    hackathonId: v.id('hackathons'),
    teamId: v.id('teams'),
    criteriaKey: v.string(),
    value: v.number(),
  })
    .index('by_team', ['teamId'])
    .index('by_hackathon_team', ['hackathonId', 'teamId']),

  votes: defineTable({
    hackathonId: v.id('hackathons'),
    teamId: v.id('teams'),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index('by_hackathon', ['hackathonId'])
    .index('by_hackathon_user', ['hackathonId', 'userId'])
    .index('by_hackathon_team', ['hackathonId', 'teamId']),
})
