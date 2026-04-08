# Borderless Hackathon — Dev Context

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- shadcn/ui for admin UI components
- Framer Motion for animations
- xlsx for Excel import/export

## Key Conventions
- Dark theme only: background `#222`, surface `#2a2a2b`, brand purple `#9810fa`, brand teal `#2debb1`
- Font: Montserrat (via `next/font/google`)
- Glass card utility: `.glass` class in globals.css
- Gradient text utility: `.gradient-brand-text` class (or `<GradientText>` component)

## Auth
- Admin password: `.env.local` → `ADMIN_PASSWORD` (server-only, never `NEXT_PUBLIC_*`)
- Session secret: `.env.local` → `ADMIN_SESSION_SECRET` (HMAC key, min 16 chars)
- Auth flow: POST `/api/admin/login` → httpOnly signed cookie `bl_admin_session` → verified in `middleware.ts` via `lib/admin-session.ts`
- Logout: POST `/api/admin/logout`

## Data
- Backend: Convex (`convex/schema.ts`, `convex/hackathons.ts`, `convex/mutations.ts`)
- Types in `lib/types.ts`
- Excel utilities in `lib/excel.ts`
- Anonymous voter id: `lib/visitor.ts` (cookie-based, used to block double-vote)

## Routes
### Public (per-hackathon by slug)
- `/` — Home (lists hackathons or empty state)
- `/[slug]` — Hackathon home
- `/[slug]/resultados` — Pódio + ranking de times + leaderboard individual
- `/[slug]/times` — Lista de times
- `/[slug]/times/[id]` — Detalhe do time
- `/[slug]/votar` — Voto popular (gated by `votingOpen` flag toggled in admin dashboard)

### Admin (password-protected)
- `/admin` — Login (honors `?next=` query param for post-login redirect)
- `/admin/dashboard` — Overview, criar hackathon, toggle votação
- `/admin/teams` — CRUD times, scores (sliders na tab "Notas"), Importar/Exportar Excel (botões na própria página)
- `/admin/participants` — CRUD participantes

## Dev
```bash
pnpm dev          # start dev server
npx tsc --noEmit  # type check
pnpm lint         # lint check
```
