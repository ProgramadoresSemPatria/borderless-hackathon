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
- Admin password: `.env.local` → `NEXT_PUBLIC_ADMIN_PASSWORD`
- Auth state: `sessionStorage` key `bl_admin_auth`
- Client-side guard: `components/admin/admin-guard.tsx`

## Data
- All data mocked in `lib/mock-data.ts`
- Types in `lib/types.ts`
- Excel utilities in `lib/excel.ts`

## Routes
### Public
- `/` — Home
- `/resultados` — Results
- `/times` — Teams list
- `/times/[id]` — Team detail

### Admin (password-protected)
- `/admin` — Login
- `/admin/dashboard` — Overview
- `/admin/teams` — Manage teams + scores
- `/admin/participants` — Manage participants
- `/admin/import` — Excel import
- `/admin/export` — Excel export

## Dev
```bash
pnpm dev          # start dev server
npx tsc --noEmit  # type check
pnpm lint         # lint check
```
