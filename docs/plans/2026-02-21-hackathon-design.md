# Borderless Hackathon — Design Document

**Date:** 2026-02-21
**Status:** Approved
**Scope:** Frontend only (mocked data — backend to be implemented separately)

---

## Overview

Web platform for managing and displaying results of the Borderless community hackathon (ambassador-only event). The app has two distinct surfaces: a **public-facing site** for anyone to view results, and a **protected backoffice** for admins to manage data.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4
- **Component base:** shadcn/ui
- **Animations:** React Bits, Animate UI, Framer Motion
- **Data:** Mocked in `lib/mock-data.ts` (backend TBD)
- **Excel:** `xlsx` library for import/export

---

## Design System (Borderless Coding)

### Colors
```
Background:    #222222
Surface:       #2a2a2b  (cards, panels)
Border:        #363636  (subtle separators)

Brand Purple:  #9810fa  (primary CTAs, highlights, badges)
Brand Teal:    #2debb1  (metrics, success, secondary accent)

Text primary:  #ededed
Text muted:    #b2b2b2
Text subtle:   #636363
```

### Typography
- **Primary:** Montserrat (Google Fonts) — 400/500/700/800
- **Accent:** ivyPresto (serif) — hero titles only
- **Fallback:** system-ui, Arial, sans-serif

### Visual Language
- Dark theme first
- Cards: subtle glassmorphism (`bg-white/5`, `backdrop-blur-sm`, `border-white/10`)
- Buttons primary: `#9810fa` with brighter hover
- Buttons secondary: teal outline
- Position badges (1st/2nd/3rd): purple→teal gradient
- Tables: zebra rows in `#2a2a2b` / `#232322`

---

## Data Models (Mocked)

### HackathonConfig
```ts
{
  name: string
  edition: string
  date: string
  status: 'ongoing' | 'finished'
  criteria: string[]  // e.g. ['Inovação', 'Execução', 'Pitch', 'Impacto']
}
```

### Team
```ts
{
  id: string
  name: string
  project: string
  description: string
  members: string[]        // participant IDs
  scores: Record<string, number>  // criteria → score (0–10)
  totalScore: number
  position: number | null
  coverImage?: string
}
```

### Participant
```ts
{
  id: string
  name: string
  avatar?: string
  team: string             // team ID
  metrics: {
    tasksCompleted: number
    attendance: number     // 0–100%
    contributions: number
    totalPoints: number
  }
}
```

---

## Routes

### Public
| Route | Description |
|---|---|
| `/` | Home — event presentation, stats, top highlights |
| `/resultados` | Final results — team ranking + individual leaderboard |
| `/times` | Public grid of all teams |
| `/times/[id]` | Individual team page — project, members, score breakdown |

### Admin (protected)
| Route | Description |
|---|---|
| `/admin` | Login page |
| `/admin/dashboard` | Overview — summary cards + quick tables |
| `/admin/teams` | Manage teams + criteria scores |
| `/admin/participants` | Manage ambassadors + engagement metrics |
| `/admin/import` | Excel import (teams + participants initial load) |
| `/admin/export` | Excel export (full report) |

### Auth
- Simulated auth via `sessionStorage`
- Password hardcoded in `.env.local` as `NEXT_PUBLIC_ADMIN_PASSWORD`
- Middleware redirects unauthenticated users away from `/admin/*`

---

## Pages — Visual Breakdown

### `/` — Home
- **Hero:** React Bits Aurora/Particles background (purple→teal), ivyPresto title with React Bits Blur Text reveal
- **Stats bar:** Animate UI Counting Number (teams count, participants count, projects count) with inView trigger
- **Highlights:** React Bits Spotlight Cards for top 3 teams + MVP ambassador
- **CTA:** Animate UI Liquid Button → `/resultados`

### `/resultados` — Results
- **Tabs:** shadcn Tabs (Times | Embaixadores)
- **Podium (top 3 teams):** CSS animated podium + Animate UI Fireworks on mount + Counting Number for positions
- **Full ranking table:** shadcn Data Table — sortable by total score + per-criterion score bars in teal/purple
- **Individual leaderboard:** shadcn Data Table — sortable, Animate UI Gradient Text for #1 entry
- **Score breakdown bars:** Framer Motion animated width bars per criterion

### `/times` — Teams Grid
- **Background:** Animate UI Hexagon Background (dark purple)
- **Cards:** React Bits Tilted Card with glassmorphism — team name, project, member count, total score

### `/times/[id]` — Team Detail
- **Members:** Animate UI Flip Cards (front = avatar + name, back = bio + metrics)
- **Score breakdown:** Framer Motion animated bars per criterion
- **Project showcase:** Animate UI Motion Carousel

### `/admin` — Login
- Centered card, dark theme, email + password, Borderless logo

### `/admin/dashboard`
- Summary cards (total teams, participants, event status, top team)
- Quick tables: top 5 teams, top 5 participants

### `/admin/teams`
- shadcn Data Table with row actions (edit via dialog, delete)
- Edit dialog: inputs for all score criteria (0–10 sliders or number inputs)

### `/admin/participants`
- shadcn Data Table with row actions
- Edit dialog: inputs for all engagement metrics

### `/admin/import`
- Dropzone for `.xlsx` file
- Template download button
- Preview table of parsed data before confirming import

### `/admin/export`
- Single "Exportar Relatório" button → generates `.xlsx` with teams sheet + participants sheet

---

## Component Library Map

| Component | Source | Used In |
|---|---|---|
| Sidebar | shadcn/ui | All admin pages |
| Data Table | shadcn/ui + TanStack | results, admin tables |
| Dialog/Modal | shadcn/ui | Edit forms |
| Tabs | shadcn/ui | /resultados |
| Blur Text | React Bits | Home hero |
| Spotlight Card | React Bits | Home highlights |
| Tilted Card | React Bits | /times grid |
| Aurora/Particles | React Bits | Home background |
| Counting Number | Animate UI | Home stats, podium |
| Gradient Text | Animate UI | Leaderboard #1 |
| Liquid Button | Animate UI | CTAs |
| Flip Card | Animate UI | Team member cards |
| Motion Carousel | Animate UI | Team detail |
| Hexagon Background | Animate UI | /times background |
| Fireworks | Animate UI | Results podium reveal |
| Page transitions | Framer Motion | All public pages |
| Score bars | Framer Motion | Results + team detail |

---

## Excel Templates

### Import template columns
**Teams sheet:** Nome, Projeto, Descrição, Membros (comma-separated)
**Participants sheet:** Nome, Time, Tasks Completadas, Presença (%), Contribuições

### Export report columns
**Teams sheet:** Posição, Nome, Projeto, Membros, [Criteria...], Total
**Participants sheet:** Posição, Nome, Time, Tasks, Presença, Contribuições, Total Pontos

---

## File Structure (planned)

```
app/
  (public)/
    page.tsx                    # Home
    resultados/page.tsx
    times/page.tsx
    times/[id]/page.tsx
  admin/
    page.tsx                    # Login
    dashboard/page.tsx
    teams/page.tsx
    participants/page.tsx
    import/page.tsx
    export/page.tsx
    layout.tsx                  # Admin shell (sidebar)
  layout.tsx                    # Root layout (fonts, globals)
  globals.css

components/
  ui/                           # shadcn components
  public/                       # Public-facing components
    Hero.tsx
    SpotlightTeamCard.tsx
    Podium.tsx
    TeamCard.tsx
    ScoreBar.tsx
    LeaderboardTable.tsx
  admin/                        # Admin components
    AdminSidebar.tsx
    TeamEditDialog.tsx
    ParticipantEditDialog.tsx
    ImportDropzone.tsx

lib/
  mock-data.ts                  # All mocked data
  types.ts                      # TypeScript interfaces
  excel.ts                      # Import/export helpers
  auth.ts                       # Simulated auth helpers

middleware.ts                   # Protect /admin/* routes
```
