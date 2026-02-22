# Borderless Hackathon v2 — Design Doc

**Data**: 2026-02-22
**Branch**: feat/hackathon-frontend
**Status**: Aprovado

---

## Escopo

Duas melhorias paralelas:

1. **Hero editorial** — substituir o `radial-gradient` estático por grain + edge bleed com assets oficiais da Borderless
2. **Backend multi-hackathon** — trocar mock-data por Convex, com schema relacional e rotas por slug

---

## 1. Hero Section — Grain + Edge Bleed Editorial

### Problema atual

O hero usa um `radial-gradient(ellipse 90% 100% at 50% 0%, ...)` estático no topo — efeito genérico, sem personalidade visual.

### Solução

Substituir por três camadas independentes:

**Camada 1 — Film grain (SVG feTurbulence)**
- `<svg>` com `feTurbulence` + `feColorMatrix` renderizado como fundo via CSS `filter` ou `background`
- Parâmetros: `baseFrequency="0.65"`, `numOctaves="3"`, opacidade ~0.04
- CSS puro, zero runtime JS, zero bundle impact

**Camada 2 — Purple edge glow (esquerda/top)**
- `position: absolute`, `left: -20%`, `top: -10%`
- `width: 60%`, `height: 60%`
- `background: radial-gradient(circle, rgba(152,16,250,0.3), transparent 70%)`
- `filter: blur(80px)`

**Camada 3 — Teal edge glow (direita/bottom)**
- `position: absolute`, `right: -20%`, `bottom: 10%`
- `width: 50%`, `height: 50%`
- `background: radial-gradient(circle, rgba(45,235,177,0.2), transparent 70%)`
- `filter: blur(100px)`

**Assets da Borderless**

Baixar e commitar em `/public/brand/`:

| Arquivo | Fonte | Uso |
|---|---|---|
| `cover-thumb.webp` | `https://borderless.com.br/wp-content/uploads/2024/10/cover-thumb.webp` | Logo mark (circular) acima do título |

O logo fica acima do badge de edição, `48px × 48px`, `border-radius: 50%`, `border: 1px solid rgba(255,255,255,0.1)`.

**Remove**
- `radial-gradient` estático atual
- Watermark "HACK" (o grain já fornece textura)

### Componente

Novo `components/animated/hero-grain.tsx` — client component com:
- `useEffect` para montar o SVG grain no mount
- Props: nenhuma (encapsulado)
- Render: camadas absolutas, pointer-events none, aria-hidden

---

## 2. Backend Multi-Hackathon — Convex

### Por que Convex

- Real-time by default: scores ao vivo sem polling
- Type-safe end-to-end: schema → queries → client sem cast manual
- Substitui ao mesmo tempo API routes e banco de dados
- Free tier generoso para o volume de um hackathon

### Schema

```typescript
// convex/schema.ts
hackathons: defineTable({
  slug: v.string(),          // "bl-hackathon-2026-1"
  name: v.string(),          // "Borderless Hackathon"
  edition: v.string(),       // "2026 — 1ª Edição"
  date: v.string(),          // "15 de Fevereiro de 2026"
  status: v.union(           // "upcoming" | "live" | "finished"
    v.literal("upcoming"),
    v.literal("live"),
    v.literal("finished")
  ),
  criteria: v.array(v.string()),  // ["Inovação", "Execução", ...]
})
  .index("by_slug", ["slug"]),

teams: defineTable({
  hackathonId: v.id("hackathons"),
  name: v.string(),
  project: v.string(),
  description: v.optional(v.string()),
  tags: v.array(v.string()),
  position: v.optional(v.number()),
})
  .index("by_hackathon", ["hackathonId"]),

participants: defineTable({
  hackathonId: v.id("hackathons"),
  teamId: v.id("teams"),
  name: v.string(),
  avatar: v.optional(v.string()),
  metrics: v.object({
    tasksCompleted: v.number(),
    attendance: v.number(),
    contributions: v.number(),
    totalPoints: v.number(),
  }),
})
  .index("by_team", ["teamId"])
  .index("by_hackathon", ["hackathonId"]),

scores: defineTable({
  hackathonId: v.id("hackathons"),
  teamId: v.id("teams"),
  criteriaKey: v.string(),
  value: v.number(),
})
  .index("by_team", ["teamId"]),
```

### Funções Convex

**Queries públicas**
- `listHackathons()` → todos hackathons ordenados por data desc
- `getHackathon(slug)` → hackathon + teams ranqueados + participants
- `getTeam(teamId)` → time + participants + scores detalhados

**Mutations admin**
- `createHackathon(data)` → cria hackathon
- `updateHackathon(id, data)` → atualiza config
- `createTeam(data)` → cria time em um hackathon
- `updateTeam(id, data)` → atualiza time / posição
- `upsertScore(teamId, criteriaKey, value)` → lança/atualiza nota
- `createParticipant(data)` → adiciona participante
- `updateParticipant(id, data)` → edita participante

### Estrutura de rotas (reestruturada)

```
app/
  page.tsx                          → lista de hackathons
  [slug]/
    page.tsx                        → landing de uma edição
    resultados/page.tsx             → resultados
    times/page.tsx                  → lista de times
    times/[id]/page.tsx             → time detalhe
  admin/
    page.tsx                        → login
    dashboard/page.tsx              → overview (todos hackathons)
    [hackathonId]/
      teams/page.tsx                → times do hackathon
      participants/page.tsx         → participantes
      scores/page.tsx               → lançamento de notas
    import/page.tsx                 → import Excel
    export/page.tsx                 → export Excel
```

**Compatibilidade**: as rotas antigas (`/resultados`, `/times`) podem redirecionar para o slug do hackathon mais recente durante a migração.

### Seed data

Um script `convex/seed.ts` que popula o banco com os dados de `lib/mock-data.ts` para desenvolvimento.

---

## Fases de Implementação

| Fase | Escopo | Dependências |
|---|---|---|
| 1 | Assets Borderless + hero grain visual | Nenhuma |
| 2 | Setup Convex + schema + seed | Nenhuma |
| 3 | Queries públicas + migrar páginas públicas | Fase 2 |
| 4 | Admin CRUD via mutations | Fase 2 |
| 5 | Restructure de rotas para /[slug] | Fases 2, 3 |
| 6 | Homepage lista de hackathons | Fase 5 |

As fases 1 e 2 são paralelas e independentes.

---

## Assets a baixar

| Destino | URL |
|---|---|
| `public/brand/cover-thumb.webp` | `https://borderless.com.br/wp-content/uploads/2024/10/cover-thumb.webp` |

---

## Decisões descartadas

- **Watermark "HACK"**: removido — grain provê textura suficiente sem o clichê
- **SQLite/Prisma**: descartado em favor de Convex por real-time e DX
- **JSON files**: descartado por falta de querying e sem relacional
- **Rotas sem slug**: descartado — impede acesso a edições anteriores
