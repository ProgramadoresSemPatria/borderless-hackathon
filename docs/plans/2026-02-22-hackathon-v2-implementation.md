# Hackathon v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Trocar o spotlight genérico por hero editorial grain+bleed e migrar todos os dados para Convex com rotas multi-hackathon `/[slug]/*`.

**Architecture:** Duas tracks paralelas e independentes. Track A é puramente visual (zero backend). Track B instala Convex, cria schema relacional, migra dados do mock e reestrutura as rotas públicas e admin para suportar múltiplas edições identificadas por slug.

**Tech Stack:** Next.js 16 App Router, TypeScript 5, Tailwind CSS 4, Framer Motion, Convex (database + realtime), React 19 Server/Client components

---

## Track A — Hero Editorial (sem dependência de backend)

### Task 1: Baixar asset oficial Borderless

**Files:**
- Create: `public/brand/cover-thumb.webp` (download)

**Step 1: Baixar o logo**

```bash
mkdir -p public/brand
curl -L "https://borderless.com.br/wp-content/uploads/2024/10/cover-thumb.webp" \
  -o public/brand/cover-thumb.webp
```

**Step 2: Verificar que o arquivo existe e tem tamanho razoável**

```bash
ls -lh public/brand/cover-thumb.webp
```

Esperado: arquivo ~50-200KB existe.

**Step 3: Commit**

```bash
git add public/brand/cover-thumb.webp
git commit -m "feat: add borderless official logo asset"
```

---

### Task 2: Criar componente HeroGrain

**Files:**
- Create: `components/animated/hero-grain.tsx`

**Step 1: Criar o componente**

```tsx
// components/animated/hero-grain.tsx
import { useId } from 'react'

export function HeroGrain() {
  const id = useId()
  const filterId = `grain-${id.replace(/:/g, '')}`

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {/* Film grain via SVG feTurbulence */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${filterId})`} />
      </svg>

      {/* Purple edge bleed — top-left */}
      <div
        className="absolute -left-[15%] -top-[5%] h-[55%] w-[55%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(152,16,250,0.28) 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Teal edge bleed — bottom-right */}
      <div
        className="absolute -right-[15%] bottom-[0%] h-[50%] w-[50%] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(45,235,177,0.16) 0%, transparent 70%)',
          filter: 'blur(110px)',
        }}
      />
    </div>
  )
}
```

**Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

**Step 3: Commit**

```bash
git add components/animated/hero-grain.tsx
git commit -m "feat: hero grain + edge bleed editorial component"
```

---

### Task 3: Atualizar hero section em app/page.tsx

**Files:**
- Modify: `app/page.tsx`

**Step 1: Aplicar as mudanças no hero**

Substituir toda a section `{/* Hero */}` por:

```tsx
{/* Hero */}
<section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center">
  <HeroGrain />

  <div className="relative z-10 flex flex-col items-center">
    {/* Borderless logo mark */}
    <div className="mb-8">
      <img
        src="/brand/cover-thumb.webp"
        alt="Borderless"
        width={56}
        height={56}
        className="rounded-full border border-white/10 object-cover"
        style={{ width: 56, height: 56 }}
      />
    </div>

    <div className="mb-6 flex items-center justify-center gap-4">
      <span className="h-px w-8 bg-[#9810fa]/50" />
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9810fa]">
        {hackathonConfig.edition}
      </span>
      <span className="h-px w-8 bg-[#9810fa]/50" />
    </div>

    <HeroReveal
      text={hackathonConfig.name}
      className="mb-6 text-6xl font-black leading-none tracking-tight text-white sm:text-8xl lg:text-9xl"
    />

    <p className="mb-10 max-w-xl text-lg text-[#b2b2b2]">
      {hackathonConfig.date} · Comunidade de Embaixadores Borderless
    </p>

    <div className="mb-12 grid w-full max-w-xs grid-cols-3 divide-x divide-white/10 border border-white/10">
      <div className="px-4 py-5 text-center">
        <div className="text-3xl font-black tabular-nums text-white">{participants.length}</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">Participantes</div>
      </div>
      <div className="px-4 py-5 text-center">
        <div className="text-3xl font-black tabular-nums text-white">{teams.length}</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">Times</div>
      </div>
      <div className="px-4 py-5 text-center">
        <div className="text-3xl font-black tabular-nums text-white">{hackathonConfig.criteria.length}</div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">Critérios</div>
      </div>
    </div>

    <Link
      href="/resultados"
      className="group inline-flex items-center gap-3 border border-[#9810fa] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#9810fa] transition-all duration-200 hover:bg-[#9810fa] hover:text-white active:scale-[0.98]"
    >
      Ver Resultados
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
</section>
```

Adicionar import no topo do arquivo:
```tsx
import { HeroGrain } from '@/components/animated/hero-grain'
```

Remover os dois divs antigos do hero (radial-gradient e watermark "HACK").

**Step 2: Verificar tipos e lint**

```bash
npx tsc --noEmit && pnpm lint
```

Esperado: sem erros.

**Step 3: Subir dev server e checar visualmente**

```bash
pnpm dev
```

Abrir `http://localhost:3000` e verificar:
- Grain visível (textura sutil)
- Glow roxo no canto superior esquerdo
- Glow teal no canto inferior direito
- Logo da Borderless (círculo) acima do badge de edição
- Sem radial-gradient genérico no topo

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: editorial hero — grain + bleed + borderless logo"
```

---

## Track B — Convex Backend (pode rodar em paralelo com Track A)

### Task 4: Instalar e inicializar Convex

**Files:**
- Modify: `package.json` (automático via install)
- Create: `convex/` directory (automático via init)
- Create: `.env.local` (adicionar variáveis Convex)

**Step 1: Instalar o pacote**

```bash
pnpm add convex
```

**Step 2: Inicializar o projeto Convex**

```bash
npx convex dev
```

Isso vai:
- Pedir login (browser abre automaticamente)
- Criar um projeto novo no dashboard Convex
- Criar a pasta `convex/` com arquivos base
- Adicionar `NEXT_PUBLIC_CONVEX_URL` no `.env.local` automaticamente

Sair do `convex dev` com `Ctrl+C` após a inicialização (voltamos depois).

**Step 3: Verificar estrutura criada**

```bash
ls convex/
```

Esperado: `_generated/`, `README.md` ou similar.

**Step 4: Commit**

```bash
git add convex/ .env.local
git commit -m "chore: initialize convex project"
```

Nota: `.env.local` só tem a URL pública, sem secrets. OK comitar.

---

### Task 5: Escrever o schema Convex

**Files:**
- Create: `convex/schema.ts`

**Step 1: Criar o schema**

```typescript
// convex/schema.ts
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
})
```

**Step 2: Rodar convex dev para gerar types**

```bash
npx convex dev
```

Deixar rodar alguns segundos até aparecer "Ready!" ou "Schema synced", depois Ctrl+C.

**Step 3: Verificar que types foram gerados**

```bash
ls convex/_generated/
```

Esperado: `api.d.ts`, `dataModel.d.ts`, `server.d.ts` (ou similar).

**Step 4: Commit**

```bash
git add convex/schema.ts convex/_generated/
git commit -m "feat: convex schema — hackathons, teams, participants, scores"
```

---

### Task 6: Escrever queries públicas

**Files:**
- Create: `convex/hackathons.ts`

**Step 1: Criar as queries**

```typescript
// convex/hackathons.ts
import { query } from './_generated/server'
import { v } from 'convex/values'

// Lista todos hackathons ordenados por data desc (para homepage)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('hackathons')
      .order('desc')
      .collect()
  },
})

// Retorna um hackathon pelo slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query('hackathons')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
  },
})

// Retorna times de um hackathon com scores calculados, ordenados por posição
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

        const scoreMap: Record<string, number> = {}
        for (const s of scores) {
          scoreMap[s.criteriaKey] = s.value
        }

        const values = Object.values(scoreMap)
        const totalScore =
          values.length > 0
            ? parseFloat(
                (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(3),
              )
            : 0

        return { ...team, scores: scoreMap, totalScore }
      }),
    )

    return teamsWithScores.sort(
      (a, b) => (a.position ?? 99) - (b.position ?? 99),
    )
  },
})

// Retorna participantes de um hackathon ordenados por totalPoints desc
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

// Retorna um time específico pelo _id
export const getTeam = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, { teamId }) => {
    const team = await ctx.db.get(teamId)
    if (!team) return null

    const scores = await ctx.db
      .query('scores')
      .withIndex('by_team', (q) => q.eq('teamId', teamId))
      .collect()

    const scoreMap: Record<string, number> = {}
    for (const s of scores) {
      scoreMap[s.criteriaKey] = s.value
    }

    const values = Object.values(scoreMap)
    const totalScore =
      values.length > 0
        ? parseFloat(
            (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(3),
          )
        : 0

    const members = await ctx.db
      .query('participants')
      .withIndex('by_team', (q) => q.eq('teamId', teamId))
      .collect()

    return { ...team, scores: scoreMap, totalScore, members }
  },
})
```

**Step 2: Sincronizar com convex dev**

```bash
npx convex dev
```

Aguardar "Ready!" e Ctrl+C. Verificar no terminal que não há erros de validação.

**Step 3: Commit**

```bash
git add convex/hackathons.ts convex/_generated/
git commit -m "feat: convex public queries — list, getBySlug, teams, participants"
```

---

### Task 7: Escrever mutations admin

**Files:**
- Create: `convex/mutations.ts`

**Step 1: Criar as mutations**

```typescript
// convex/mutations.ts
import { mutation } from './_generated/server'
import { v } from 'convex/values'

// ── Hackathons ──────────────────────────────────────────────────────────────

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

// ── Teams ───────────────────────────────────────────────────────────────────

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
    // Deletar scores e participants vinculados
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

// ── Participants ─────────────────────────────────────────────────────────────

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

// ── Scores ──────────────────────────────────────────────────────────────────

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
```

**Step 2: Sincronizar**

```bash
npx convex dev
```

Aguardar "Ready!" e Ctrl+C.

**Step 3: Commit**

```bash
git add convex/mutations.ts convex/_generated/
git commit -m "feat: convex mutations — hackathon/team/participant/score CRUD"
```

---

### Task 8: Seed — popular banco com dados do mock

**Files:**
- Create: `convex/seed.ts`

**Step 1: Criar o script de seed**

```typescript
// convex/seed.ts
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const seedFromMock = mutation({
  args: {},
  handler: async (ctx) => {
    // Verificar se já existe dados
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

    // Times
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

    // Scores
    const scoreData = [
      { teamId: t1Id, scores: { Inovação: 9.5, Execução: 9.0, Pitch: 8.5, Impacto: 9.2 } },
      { teamId: t2Id, scores: { Inovação: 8.8, Execução: 9.2, Pitch: 9.0, Impacto: 8.5 } },
      { teamId: t3Id, scores: { Inovação: 8.0, Execução: 7.5, Pitch: 8.2, Impacto: 8.8 } },
      { teamId: t4Id, scores: { Inovação: 7.5, Execução: 8.0, Pitch: 7.2, Impacto: 7.8 } },
    ]
    for (const { teamId, scores } of scoreData) {
      for (const [criteriaKey, value] of Object.entries(scores)) {
        await ctx.db.insert('scores', { hackathonId, teamId, criteriaKey, value })
      }
    }

    // Participantes
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
```

**Step 2: Sincronizar e rodar o seed via dashboard Convex**

```bash
npx convex dev
```

Abrir o dashboard Convex → Functions → `seed:seedFromMock` → Run.

Ou via CLI:
```bash
npx convex run seed:seedFromMock
```

**Step 3: Verificar dados no dashboard**

Abrir dashboard Convex → Data → checar tabelas `hackathons`, `teams`, `participants`, `scores`.

**Step 4: Commit**

```bash
git add convex/seed.ts convex/_generated/
git commit -m "feat: convex seed — populate from mock data"
```

---

### Task 9: Adicionar ConvexProvider ao layout

**Files:**
- Create: `components/convex-provider.tsx`
- Modify: `app/layout.tsx`

**Step 1: Criar o provider client component**

```tsx
// components/convex-provider.tsx
'use client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import type { ReactNode } from 'react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
```

**Step 2: Wrapping no layout**

```tsx
// app/layout.tsx — adicionar import e wrapping
import { ConvexClientProvider } from '@/components/convex-provider'

// No body, envolver children:
<body className={`${montserrat.variable} antialiased`}>
  <ConvexClientProvider>
    {children}
  </ConvexClientProvider>
</body>
```

**Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add components/convex-provider.tsx app/layout.tsx
git commit -m "feat: convex provider wired to root layout"
```

---

### Task 10: Criar estrutura de rotas /[slug]/*

**Files:**
- Create: `app/[slug]/page.tsx`
- Create: `app/[slug]/resultados/page.tsx`
- Create: `app/[slug]/times/page.tsx`
- Create: `app/[slug]/times/[id]/page.tsx`
- Create: `app/[slug]/layout.tsx`

**Step 1: Layout do slug (passa slug via context)**

```tsx
// app/[slug]/layout.tsx
export default function SlugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

**Step 2: Landing de uma edição — app/[slug]/page.tsx**

Esta página substitui `app/page.tsx` mas recebe dados do Convex via slug:

```tsx
// app/[slug]/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { HeroGrain } from '@/components/animated/hero-grain'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { PublicNavbar } from '@/components/public/navbar'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HackathonLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const teams = await fetchQuery(api.hackathons.getTeamsRanked, {
    hackathonId: hackathon._id,
  })
  const participants = await fetchQuery(api.hackathons.getParticipantsRanked, {
    hackathonId: hackathon._id,
  })

  const topTeam = teams[0]
  const secondTeam = teams[1]
  const mvp = participants[0]

  return (
    <>
      <PublicNavbar slug={slug} />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center">
          <HeroGrain />
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8">
              <img
                src="/brand/cover-thumb.webp"
                alt="Borderless"
                width={56}
                height={56}
                className="rounded-full border border-white/10 object-cover"
                style={{ width: 56, height: 56 }}
              />
            </div>
            <div className="mb-6 flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-[#9810fa]/50" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9810fa]">
                {hackathon.edition}
              </span>
              <span className="h-px w-8 bg-[#9810fa]/50" />
            </div>
            <HeroReveal
              text={hackathon.name}
              className="mb-6 text-6xl font-black leading-none tracking-tight text-white sm:text-8xl lg:text-9xl"
            />
            <p className="mb-10 max-w-xl text-lg text-[#b2b2b2]">
              {hackathon.date} · Comunidade de Embaixadores Borderless
            </p>
            <div className="mb-12 grid w-full max-w-xs grid-cols-3 divide-x divide-white/10 border border-white/10">
              <div className="px-4 py-5 text-center">
                <div className="text-3xl font-black tabular-nums text-white">{participants.length}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">Participantes</div>
              </div>
              <div className="px-4 py-5 text-center">
                <div className="text-3xl font-black tabular-nums text-white">{teams.length}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">Times</div>
              </div>
              <div className="px-4 py-5 text-center">
                <div className="text-3xl font-black tabular-nums text-white">{hackathon.criteria.length}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#636363]">Critérios</div>
              </div>
            </div>
            <Link
              href={`/${slug}/resultados`}
              className="group inline-flex items-center gap-3 border border-[#9810fa] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-[#9810fa] transition-all duration-200 hover:bg-[#9810fa] hover:text-white active:scale-[0.98]"
            >
              Ver Resultados
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* Highlights — top team + MVP */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">
            Destaques do Evento
          </p>
          {topTeam && (
            <div className="mb-3">
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8 transition-colors hover:border-white/[0.15]">
                <span aria-hidden="true" className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 select-none font-black tabular-nums text-white" style={{ fontSize: '9rem', opacity: 0.04, lineHeight: 1 }}>1</span>
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">1º Lugar</div>
                    <h3 className="text-3xl font-black leading-tight text-white sm:text-4xl">{topTeam.name}</h3>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{topTeam.project}</p>
                    {topTeam.description && <p className="mt-3 line-clamp-2 max-w-lg text-sm text-[#b2b2b2]">{topTeam.description}</p>}
                  </div>
                  <div className="flex-shrink-0 sm:text-right">
                    <div className="text-5xl font-black tabular-nums text-[#9810fa]">{topTeam.totalScore.toFixed(2)}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">pontuação final</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {secondTeam && (
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none font-black tabular-nums text-white" style={{ fontSize: '6rem', opacity: 0.04, lineHeight: 1 }}>2</span>
                <div className="relative">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">2º Lugar</div>
                  <h3 className="text-2xl font-black leading-tight text-white">{secondTeam.name}</h3>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{secondTeam.project}</p>
                  {secondTeam.description && <p className="mt-2 line-clamp-2 text-sm text-[#b2b2b2]">{secondTeam.description}</p>}
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <div className="text-3xl font-black tabular-nums text-[#2debb1]">{secondTeam.totalScore.toFixed(2)}</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">pontuação final</div>
                  </div>
                </div>
              </div>
            )}
            {mvp && (
              <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Embaixador MVP</div>
                <h3 className="text-2xl font-black leading-tight text-white">{mvp.name}</h3>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">Maior pontuação individual</p>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4">
                  <div>
                    <div className="text-2xl font-black tabular-nums text-[#9810fa]">{mvp.metrics.totalPoints}</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">Pontos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black tabular-nums text-white">{mvp.metrics.attendance}%</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">Presença</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
```

**Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add app/[slug]/
git commit -m "feat: hackathon landing page via [slug] route with convex"
```

---

### Task 11: Migrar página /resultados para /[slug]/resultados

**Files:**
- Create: `app/[slug]/resultados/page.tsx`

**Step 1: Criar a página**

O código é idêntico à `app/resultados/page.tsx` existente, mas:
- Recebe `slug` dos params
- Usa `fetchQuery(api.hackathons.getBySlug, { slug })` + `getTeamsRanked` + `getParticipantsRanked`
- Link de voltar aponta para `/${slug}`

```tsx
// app/[slug]/resultados/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { Podium } from '@/components/public/podium'
import { ScoreBar } from '@/components/public/score-bar'

function rankColor(position: number | null) {
  if (position === null) return 'text-[#636363]'
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default async function ResultadosPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const teams = await fetchQuery(api.hackathons.getTeamsRanked, {
    hackathonId: hackathon._id,
  })
  const participants = await fetchQuery(api.hackathons.getParticipantsRanked, {
    hackathonId: hackathon._id,
  })

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">
            Resultados <span className="text-[#9810fa]">Finais</span>
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">
            {hackathon.edition} · {hackathon.date}
          </p>
        </div>

        <section className="mb-20">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#9810fa]">Pódio</p>
          <Podium teams={teams} />
        </section>

        <section className="mb-20">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Ranking de Times</h2>
          <div className="space-y-3">
            {teams.map((team) => (
              <div key={team._id} className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <span className={`flex-shrink-0 font-black tabular-nums leading-none ${
                      team.position === 1 ? 'text-4xl text-[#9810fa]' :
                      team.position === 2 ? 'text-3xl text-[#2debb1]' :
                      team.position === 3 ? 'text-2xl text-white/60' :
                      'text-xl text-[#636363]'
                    }`}>{team.position}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <h3 className="text-lg font-black text-white leading-tight">{team.name}</h3>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{team.project}</span>
                      </div>
                      {team.description && <p className="mt-1.5 line-clamp-1 text-sm text-[#b2b2b2]">{team.description}</p>}
                      {team.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {team.tags.map(tag => (
                            <span key={tag} className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className={`font-black tabular-nums leading-none ${
                      team.position === 1 ? 'text-3xl' : team.position === 2 ? 'text-2xl' : 'text-xl'
                    } ${rankColor(team.position ?? null)}`}>
                      {team.totalScore.toFixed(2)}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">pontuação total</div>
                  </div>
                </div>
                <div className="mt-5 border-t border-white/[0.06] pt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                  {hackathon.criteria.map((criterion) => (
                    <ScoreBar key={criterion} label={criterion} value={team.scores[criterion] ?? 0} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Leaderboard Individual</h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">#</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Embaixador</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Time</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Presença</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Tasks</th>
                  <th scope="col" className="px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const team = teams.find(t => t._id === p.teamId)
                  return (
                    <tr key={p._id} className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.06]">
                      <td className="px-6 py-4 text-sm font-black tabular-nums"><span className={rankColor(i + 1)}>{i + 1}</span></td>
                      <td className="px-6 py-4"><span className="font-semibold text-white">{p.name}</span></td>
                      <td className="px-6 py-4 text-sm text-[#636363]">{team?.name ?? '—'}</td>
                      <td className="px-6 py-4 font-semibold tabular-nums text-white">{p.metrics.attendance}%</td>
                      <td className="px-6 py-4 text-[#b2b2b2]">{p.metrics.tasksCompleted}</td>
                      <td className="px-6 py-4 font-black tabular-nums text-white">{p.metrics.totalPoints}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}
```

**Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add "app/[slug]/resultados/"
git commit -m "feat: resultados page via [slug]/resultados route with convex"
```

---

### Task 12: Migrar /times e /times/[id] para /[slug]/times/*

**Files:**
- Create: `app/[slug]/times/page.tsx`
- Create: `app/[slug]/times/[id]/page.tsx`

**Step 1: Página de lista de times**

```tsx
// app/[slug]/times/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

function rankColor(position: number | null) {
  if (position === null) return 'text-[#636363]'
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default async function TimesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const teams = await fetchQuery(api.hackathons.getTeamsRanked, {
    hackathonId: hackathon._id,
  })

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">Times</h1>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">Todos os times participantes</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teams.map((team) => (
            <Link key={team._id} href={`/${slug}/times/${team._id}`} className="group block">
              <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    {team.position && (
                      <div className={`mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] ${rankColor(team.position)}`}>
                        #{team.position} no ranking
                      </div>
                    )}
                    <h3 className="font-black text-xl text-white leading-tight">{team.name}</h3>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{team.project}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-extrabold tabular-nums ${rankColor(team.position ?? null)}`}>{team.totalScore.toFixed(2)}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">score</div>
                  </div>
                </div>
                <p className="mb-4 text-sm text-[#b2b2b2] line-clamp-2">{team.description}</p>
                <div className="mb-4 flex flex-wrap gap-1">
                  {team.tags.map(tag => (
                    <span key={tag} className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <div className="flex items-center gap-1.5 text-sm text-[#636363]">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{team.members?.map((m: { name: string }) => m.name).join(', ') ?? ''}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[#636363] transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
```

Nota: `getTeamsRanked` não retorna members. Adicionar na query `getTeamsRanked` um campo `memberNames` ou criar query separada. Opção mais simples: adicionar `memberNames: string[]` ao retorno de `getTeamsRanked` em `convex/hackathons.ts`.

Atualizar `getTeamsRanked` para incluir nomes dos participantes:

```typescript
// Em convex/hackathons.ts, dentro do getTeamsRanked handler, após calcular totalScore:
const members = await ctx.db
  .query('participants')
  .withIndex('by_team', (q) => q.eq('teamId', team._id))
  .collect()

return { ...team, scores: scoreMap, totalScore, memberNames: members.map(m => m.name) }
```

Atualizar a página times para usar `team.memberNames`.

**Step 2: Página de detalhe de time**

```tsx
// app/[slug]/times/[id]/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { type Id } from '@/convex/_generated/dataModel'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { ScoreBar } from '@/components/public/score-bar'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'

function rankTextClass(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const team = await fetchQuery(api.hackathons.getTeam, {
    teamId: id as Id<'teams'>,
  })
  if (!team) return notFound()

  const pos = team.position ?? 4

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <Link
          href={`/${slug}/times`}
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#636363] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para times
        </Link>

        <div className="mb-8 rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {team.position && (
                <div className={`mb-2 text-[10px] font-black uppercase tracking-[0.15em] ${rankTextClass(pos)}`}>
                  #{team.position} lugar
                </div>
              )}
              <h1 className="mb-1 text-3xl font-extrabold text-white">{team.name}</h1>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{team.project}</p>
              <p className="mb-4 text-[#b2b2b2]">{team.description}</p>
              <div className="flex flex-wrap gap-1">
                {team.tags.map(tag => (
                  <span key={tag} className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]">{tag}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-black ${rankTextClass(pos)}`}>{team.totalScore.toFixed(2)}</div>
              <div className="text-sm text-[#636363]">pontuação final</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Critérios de Avaliação</h2>
            <div className="space-y-4">
              {hackathon.criteria.map((criterion) => (
                <ScoreBar key={criterion} label={criterion} value={team.scores[criterion] ?? 0} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
              <Users className="h-3.5 w-3.5" />
              Membros ({team.members.length})
            </h2>
            <div>
              {team.members.map((member: { _id: string; name: string; metrics: { tasksCompleted: number; attendance: number; totalPoints: number } }) => (
                <div key={member._id} className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0">
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      {member.metrics.tasksCompleted} tasks · {member.metrics.attendance}% presença
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black tabular-nums text-white">{member.metrics.totalPoints}</div>
                    <div className="text-xs text-[#636363]">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
```

**Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add "app/[slug]/times/"
git commit -m "feat: times + team detail pages via [slug]/times/* with convex"
```

---

### Task 13: Homepage — lista de hackathons

**Files:**
- Modify: `app/page.tsx` (substituir conteúdo atual por lista de hackathons)

**Step 1: Reescrever a homepage**

```tsx
// app/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const hackathons = await fetchQuery(api.hackathons.list, {})

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Subtle background glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div
          className="absolute -left-[10%] top-[10%] h-[50%] w-[50%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(152,16,250,0.12) 0%, transparent 70%)', filter: 'blur(100px)' }}
        />
        <div
          className="absolute -right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,235,177,0.08) 0%, transparent 70%)', filter: 'blur(120px)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 pt-32">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <img src="/brand/cover-thumb.webp" alt="Borderless" width={40} height={40} className="rounded-full border border-white/10 object-cover" style={{ width: 40, height: 40 }} />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#636363]">Borderless</span>
        </div>
        <h1 className="mb-2 text-4xl font-black leading-none tracking-tight text-white sm:text-6xl">Hackathons</h1>
        <p className="mb-16 text-sm text-[#636363]">Todas as edições do hackathon da comunidade.</p>

        {hackathons.length === 0 ? (
          <p className="text-[#636363]">Nenhum hackathon registrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {hackathons.map((hackathon) => (
              <Link key={hackathon._id} href={`/${hackathon.slug}`} className="group block">
                <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9810fa]">{hackathon.edition}</div>
                      <h2 className="text-xl font-black text-white">{hackathon.name}</h2>
                      <p className="mt-0.5 text-sm text-[#636363]">{hackathon.date}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${
                        hackathon.status === 'live' ? 'bg-[#9810fa]/15 text-[#9810fa]' :
                        hackathon.status === 'finished' ? 'bg-white/5 text-[#636363]' :
                        'bg-[#2debb1]/10 text-[#2debb1]'
                      }`}>
                        {hackathon.status === 'live' ? 'Ao vivo' : hackathon.status === 'finished' ? 'Encerrado' : 'Em breve'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#636363] transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
```

**Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage — hackathon list with convex data"
```

---

### Task 14: Adicionar redirects das rotas antigas

**Files:**
- Create: `app/resultados/page.tsx` (redirect)
- Create: `app/times/page.tsx` (redirect)

**Step 1: Redirect /resultados → /[ultimo-slug]/resultados**

```tsx
// app/resultados/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'

export default async function ResultadosRedirect() {
  const hackathons = await fetchQuery(api.hackathons.list, {})
  const latest = hackathons[0]
  if (latest) {
    redirect(`/${latest.slug}/resultados`)
  }
  redirect('/')
}
```

```tsx
// app/times/page.tsx
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'

export default async function TimesRedirect() {
  const hackathons = await fetchQuery(api.hackathons.list, {})
  const latest = hackathons[0]
  if (latest) {
    redirect(`/${latest.slug}/times`)
  }
  redirect('/')
}
```

**Step 2: Verificar tipos**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add app/resultados/page.tsx app/times/page.tsx
git commit -m "feat: legacy route redirects to latest hackathon slug"
```

---

### Task 15: Atualizar PublicNavbar para aceitar slug

**Files:**
- Modify: `components/public/navbar.tsx`

**Step 1: Ler o arquivo atual**

```bash
cat components/public/navbar.tsx
```

**Step 2: Adicionar prop slug opcional e atualizar links internos**

Adicionar `slug?: string` como prop. Quando `slug` está presente, links internos apontam para `/${slug}/resultados` e `/${slug}/times`. Quando ausente (homepage da lista), links apontam para `/`.

**Step 3: Verificar tipos**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add components/public/navbar.tsx
git commit -m "feat: navbar accepts slug prop for multi-hackathon links"
```

---

### Task 16: Smoke test completo

**Step 1: Subir convex dev + next dev em terminais separados**

Terminal 1:
```bash
npx convex dev
```

Terminal 2:
```bash
pnpm dev
```

**Step 2: Checar cada rota**

| URL | Esperado |
|---|---|
| `http://localhost:3000/` | Lista com "Borderless Hackathon 2026 — 1ª Edição" |
| `http://localhost:3000/bl-hackathon-2026-1` | Hero com grain + logo Borderless |
| `http://localhost:3000/bl-hackathon-2026-1/resultados` | Podium + ranking com dados reais |
| `http://localhost:3000/bl-hackathon-2026-1/times` | Grid de 4 times |
| `http://localhost:3000/bl-hackathon-2026-1/times/[id-do-time]` | Detalhe com scores e membros |
| `http://localhost:3000/resultados` | Redirect para `/bl-hackathon-2026-1/resultados` |

**Step 3: Type check final**

```bash
npx tsc --noEmit && pnpm lint
```

Esperado: zero erros.

**Step 4: Commit de finalização**

```bash
git add -A
git commit -m "chore: all routes verified, convex + multi-hackathon complete"
```
