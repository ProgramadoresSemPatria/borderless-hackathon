# Borderless Hackathon Platform — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete frontend for the Borderless hackathon management platform with public results pages and a protected admin backoffice, using mocked data.

**Architecture:** Next.js 16 App Router with TypeScript and Tailwind CSS 4. All data is mocked in `lib/mock-data.ts`. Admin auth is simulated via `sessionStorage` with a password from `.env.local`. Public pages use rich animations (React Bits, Animate UI, Framer Motion); admin pages use shadcn/ui for clean, functional UIs.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, xlsx, React Bits (copy-paste), Animate UI (copy-paste)

**Design system reference:** `docs/plans/2026-02-21-hackathon-design.md`

---

## Task 1: Install dependencies & init shadcn/ui

**Files:**
- Modify: `package.json`
- Create: `components.json` (shadcn config)
- Modify: `app/globals.css`

**Step 1: Install npm packages**

```bash
pnpm add framer-motion xlsx
pnpm add -D @types/node
```

**Step 2: Initialize shadcn/ui**

```bash
pnpm dlx shadcn@latest init
```

When prompted, choose:
- Style: Default
- Base color: Slate
- CSS variables: Yes

**Step 3: Install all shadcn components needed**

```bash
pnpm dlx shadcn@latest add button card badge table dialog input label tabs sheet dropdown-menu scroll-area separator avatar progress sidebar tooltip
```

**Step 4: Verify install**

```bash
npx tsc --noEmit
```
Expected: no errors

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: install dependencies and init shadcn/ui"
```

---

## Task 2: Design system — globals.css, fonts, CSS variables

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Update globals.css with Borderless design tokens**

Replace the contents of `app/globals.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Borderless brand */
  --brand-purple: #9810fa;
  --brand-teal: #2debb1;

  /* Surfaces */
  --background: #222222;
  --surface: #2a2a2b;
  --surface-raised: #2f2f30;
  --border: #363636;
  --border-subtle: #2e2e2f;

  /* Text */
  --foreground: #ededed;
  --muted: #b2b2b2;
  --subtle: #636363;

  /* shadcn overrides */
  --card: var(--surface);
  --card-foreground: var(--foreground);
  --popover: var(--surface);
  --popover-foreground: var(--foreground);
  --primary: var(--brand-purple);
  --primary-foreground: #ffffff;
  --secondary: var(--surface-raised);
  --secondary-foreground: var(--foreground);
  --muted: var(--surface);
  --muted-foreground: #b2b2b2;
  --accent: var(--surface-raised);
  --accent-foreground: var(--foreground);
  --destructive: #ef4444;
  --input: var(--border);
  --ring: var(--brand-purple);
  --radius: 0.75rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-purple: var(--brand-purple);
  --color-brand-teal: var(--brand-teal);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --font-sans: var(--font-montserrat);
  --font-serif: var(--font-ivy-presto);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Gradient utilities */
.gradient-brand {
  background: linear-gradient(135deg, #9810fa 0%, #2debb1 100%);
}

.gradient-brand-text {
  background: linear-gradient(135deg, #9810fa 0%, #2debb1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass card */
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--brand-purple); }
```

**Step 2: Update root layout with Montserrat font**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Borderless Hackathon',
  description: 'Plataforma oficial do hackathon da comunidade Borderless',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

**Step 3: Type check**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: configure Borderless design system and fonts"
```

---

## Task 3: TypeScript types

**Files:**
- Create: `lib/types.ts`

**Step 1: Create lib/types.ts**

```ts
export interface HackathonConfig {
  name: string
  edition: string
  date: string
  status: 'ongoing' | 'finished'
  criteria: string[]
}

export interface Team {
  id: string
  name: string
  project: string
  description: string
  members: string[]       // participant IDs
  scores: Record<string, number>  // criterion -> score 0-10
  totalScore: number
  position: number | null
  coverImage?: string
  tags?: string[]
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  teamId: string
  metrics: {
    tasksCompleted: number
    attendance: number    // 0-100
    contributions: number
    totalPoints: number
  }
}

export type ImportedTeamRow = {
  Nome: string
  Projeto: string
  Descricao: string
  Membros: string         // comma-separated participant names
}

export type ImportedParticipantRow = {
  Nome: string
  Time: string
  Tasks: number
  Presenca: number
  Contribuicoes: number
}
```

**Step 2: Type check**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript types"
```

---

## Task 4: Mock data

**Files:**
- Create: `lib/mock-data.ts`

**Step 1: Create lib/mock-data.ts**

```ts
import type { HackathonConfig, Team, Participant } from './types'

export const hackathonConfig: HackathonConfig = {
  name: 'Borderless Hackathon',
  edition: '2026 — 1ª Edição',
  date: '15 de Fevereiro de 2026',
  status: 'finished',
  criteria: ['Inovação', 'Execução', 'Pitch', 'Impacto'],
}

export const participants: Participant[] = [
  {
    id: 'p1',
    name: 'Ana Souza',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    teamId: 't1',
    metrics: { tasksCompleted: 12, attendance: 95, contributions: 18, totalPoints: 980 },
  },
  {
    id: 'p2',
    name: 'Bruno Lima',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno',
    teamId: 't1',
    metrics: { tasksCompleted: 10, attendance: 90, contributions: 15, totalPoints: 870 },
  },
  {
    id: 'p3',
    name: 'Carla Mendes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carla',
    teamId: 't2',
    metrics: { tasksCompleted: 11, attendance: 100, contributions: 20, totalPoints: 960 },
  },
  {
    id: 'p4',
    name: 'Diego Alves',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
    teamId: 't2',
    metrics: { tasksCompleted: 9, attendance: 85, contributions: 14, totalPoints: 820 },
  },
  {
    id: 'p5',
    name: 'Eduarda Costa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduarda',
    teamId: 't3',
    metrics: { tasksCompleted: 8, attendance: 80, contributions: 11, totalPoints: 750 },
  },
  {
    id: 'p6',
    name: 'Felipe Rocha',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe',
    teamId: 't3',
    metrics: { tasksCompleted: 7, attendance: 75, contributions: 9, totalPoints: 690 },
  },
  {
    id: 'p7',
    name: 'Gabriela Nunes',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriela',
    teamId: 't4',
    metrics: { tasksCompleted: 10, attendance: 90, contributions: 16, totalPoints: 890 },
  },
  {
    id: 'p8',
    name: 'Henrique Dias',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henrique',
    teamId: 't4',
    metrics: { tasksCompleted: 6, attendance: 70, contributions: 8, totalPoints: 620 },
  },
]

export const teams: Team[] = [
  {
    id: 't1',
    name: 'DevForce',
    project: 'BorderBot',
    description: 'Assistente de IA para onboarding de embaixadores internacionais.',
    members: ['p1', 'p2'],
    scores: { Inovação: 9.5, Execução: 9.0, Pitch: 8.5, Impacto: 9.2 },
    totalScore: 9.05,
    position: 1,
    tags: ['IA', 'Onboarding', 'Bot'],
  },
  {
    id: 't2',
    name: 'Nexus',
    project: 'GlobeConnect',
    description: 'Plataforma de networking para embaixadores ao redor do mundo.',
    members: ['p3', 'p4'],
    scores: { Inovação: 8.8, Execução: 9.2, Pitch: 9.0, Impacto: 8.5 },
    totalScore: 8.875,
    position: 2,
    tags: ['Networking', 'Plataforma'],
  },
  {
    id: 't3',
    name: 'Alpha Squad',
    project: 'ImpactTrack',
    description: 'Dashboard de métricas de impacto para programas de aceleração.',
    members: ['p5', 'p6'],
    scores: { Inovação: 8.0, Execução: 7.5, Pitch: 8.2, Impacto: 8.8 },
    totalScore: 8.125,
    position: 3,
    tags: ['Dashboard', 'Métricas'],
  },
  {
    id: 't4',
    name: 'Builders',
    project: 'TalentRadar',
    description: 'Ferramenta de mapeamento de talentos tech na América Latina.',
    members: ['p7', 'p8'],
    scores: { Inovação: 7.5, Execução: 8.0, Pitch: 7.2, Impacto: 7.8 },
    totalScore: 7.625,
    position: 4,
    tags: ['Talentos', 'Mapeamento'],
  },
]

export function getParticipantById(id: string): Participant | undefined {
  return participants.find(p => p.id === id)
}

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id)
}

export function getTeamParticipants(teamId: string): Participant[] {
  return participants.filter(p => p.teamId === teamId)
}

export function getRankedTeams(): Team[] {
  return [...teams].sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
}

export function getRankedParticipants(): Participant[] {
  return [...participants].sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)
}
```

**Step 2: Type check**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add mock data for teams and participants"
```

---

## Task 5: Auth utilities + middleware

**Files:**
- Create: `lib/auth.ts`
- Create: `middleware.ts`
- Create: `.env.local`

**Step 1: Create .env.local**

```bash
echo "NEXT_PUBLIC_ADMIN_PASSWORD=borderless2026" > .env.local
```

**Step 2: Create lib/auth.ts**

```ts
const SESSION_KEY = 'bl_admin_auth'

export function login(password: string): boolean {
  const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'borderless2026'
  if (password === correct) {
    sessionStorage.setItem(SESSION_KEY, 'true')
    return true
  }
  return false
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}
```

**Step 3: Create middleware.ts (at project root)**

```ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware can't access sessionStorage (server-side).
  // Protection is handled client-side in admin layout.
  // This middleware just ensures /admin routes exist.
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

**Step 4: Type check**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/auth.ts middleware.ts
git commit -m "feat: add auth utilities and middleware"
```

---

## Task 6: Animated components — copy from React Bits & Animate UI

**Files:**
- Create: `components/animated/blur-text.tsx`
- Create: `components/animated/spotlight-card.tsx`
- Create: `components/animated/tilted-card.tsx`
- Create: `components/animated/counting-number.tsx`
- Create: `components/animated/gradient-text.tsx`
- Create: `components/animated/aurora-background.tsx`

**Step 1: Create components/animated/blur-text.tsx**

Source: https://www.reactbits.dev/text-animations/blur-text

```tsx
'use client'
import { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'characters'
}

export function BlurText({
  text,
  delay = 0.05,
  className = '',
  animateBy = 'words',
}: BlurTextProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [inView, controls])

  const tokens = animateBy === 'words' ? text.split(' ') : text.split('')

  return (
    <motion.p
      ref={ref}
      className={`flex flex-wrap gap-[0.25em] ${className}`}
      initial="hidden"
      animate={controls}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
            visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
          }}
          transition={{ duration: 0.5, delay: i * delay, ease: 'easeOut' }}
        >
          {token}
        </motion.span>
      ))}
    </motion.p>
  )
}
```

**Step 2: Create components/animated/spotlight-card.tsx**

```tsx
'use client'
import { useRef, useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(152, 16, 250, 0.15)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setOpacity(1)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}
      style={{ '--spotlight-color': spotlightColor } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}
```

**Step 3: Create components/animated/tilted-card.tsx**

```tsx
'use client'
import { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'

interface TiltedCardProps {
  children: ReactNode
  className?: string
}

export function TiltedCard({ children, className = '' }: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, { stiffness: 300, damping: 30 })
  const rotateY = useSpring(0, { stiffness: 300, damping: 30 })
  const scale = useSpring(1, { stiffness: 300, damping: 30 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    rotateX.set(-y * 15)
    rotateY.set(x * 15)
    scale.set(1.02)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}
```

**Step 4: Create components/animated/counting-number.tsx**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, animate } from 'framer-motion'

interface CountingNumberProps {
  value: number
  duration?: number
  className?: string
  decimals?: number
}

export function CountingNumber({
  value,
  duration = 1.5,
  className = '',
  decimals = 0,
}: CountingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = latest.toFixed(decimals)
        }
      },
    })
    return controls.stop
  }, [inView, value, duration, decimals, motionValue])

  return <span ref={ref} className={className}>0</span>
}
```

**Step 5: Create components/animated/gradient-text.tsx**

```tsx
'use client'
import type { ReactNode } from 'react'

interface GradientTextProps {
  children: ReactNode
  className?: string
  from?: string
  to?: string
}

export function GradientText({
  children,
  className = '',
  from = '#9810fa',
  to = '#2debb1',
}: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      {children}
    </span>
  )
}
```

**Step 6: Create components/animated/aurora-background.tsx**

```tsx
'use client'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function AuroraBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-[#222]">
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #9810fa 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #2debb1 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #9810fa 0%, transparent 70%)' }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
```

**Step 7: Type check**

```bash
npx tsc --noEmit
```

**Step 8: Commit**

```bash
git add components/animated/
git commit -m "feat: add animated components (blur-text, spotlight-card, tilted-card, counting-number, gradient-text, aurora-background)"
```

---

## Task 7: Public navigation bar

**Files:**
- Create: `components/public/navbar.tsx`

**Step 1: Create components/public/navbar.tsx**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Início' },
  { href: '/resultados', label: 'Resultados' },
  { href: '/times', label: 'Times' },
]

export function PublicNavbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#222]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">
            Borderless <span className="gradient-brand-text">Hackathon</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-white/10 text-white'
                  : 'text-[#b2b2b2] hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
```

**Step 2: Type check**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/public/navbar.tsx
git commit -m "feat: add public navigation bar"
```

---

## Task 8: Home page (/)

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace app/page.tsx**

```tsx
import { AuroraBackground } from '@/components/animated/aurora-background'
import { BlurText } from '@/components/animated/blur-text'
import { SpotlightCard } from '@/components/animated/spotlight-card'
import { CountingNumber } from '@/components/animated/counting-number'
import { GradientText } from '@/components/animated/gradient-text'
import { PublicNavbar } from '@/components/public/navbar'
import { getRankedTeams, getRankedParticipants, hackathonConfig, participants, teams } from '@/lib/mock-data'
import Link from 'next/link'
import { Trophy, Users, Code2, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const rankedTeams = getRankedTeams()
  const rankedParticipants = getRankedParticipants()
  const topTeam = rankedTeams[0]
  const mvp = rankedParticipants[0]

  return (
    <>
      <PublicNavbar />
      <main>
        {/* Hero */}
        <AuroraBackground>
          <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
            <span className="mb-4 inline-block rounded-full border border-[#9810fa]/30 bg-[#9810fa]/10 px-4 py-1.5 text-sm font-medium text-[#9810fa]">
              {hackathonConfig.edition}
            </span>

            <BlurText
              text={hackathonConfig.name}
              className="mb-4 justify-center text-5xl font-extrabold leading-tight text-white sm:text-7xl"
              animateBy="words"
            />

            <p className="mb-8 max-w-xl text-lg text-[#b2b2b2]">
              {hackathonConfig.date} · Comunidade de Embaixadores Borderless
            </p>

            {/* Stats */}
            <div className="mb-12 flex flex-wrap justify-center gap-8">
              {[
                { label: 'Times', value: teams.length, icon: Code2 },
                { label: 'Participantes', value: participants.length, icon: Users },
                { label: 'Critérios', value: hackathonConfig.criteria.length, icon: Trophy },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5 text-[#9810fa]" />
                  <span className="text-4xl font-bold text-white">
                    <CountingNumber value={value} />
                  </span>
                  <span className="text-sm text-[#b2b2b2]">{label}</span>
                </div>
              ))}
            </div>

            <Link
              href="/resultados"
              className="group flex items-center gap-2 rounded-full bg-[#9810fa] px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-[#b040ff] hover:shadow-lg hover:shadow-[#9810fa]/30"
            >
              Ver Resultados
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </section>
        </AuroraBackground>

        {/* Highlights */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Destaques do Evento
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 1st place */}
            <SpotlightCard className="p-6" spotlightColor="rgba(152,16,250,0.2)">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9810fa]">
                🥇 1º Lugar
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{topTeam?.name}</h3>
              <p className="mb-3 text-sm text-[#b2b2b2]">{topTeam?.project}</p>
              <div className="gradient-brand-text text-3xl font-extrabold">
                {topTeam?.totalScore.toFixed(2)}
              </div>
            </SpotlightCard>

            {/* 2nd place */}
            <SpotlightCard className="p-6" spotlightColor="rgba(45,235,177,0.2)">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2debb1]">
                🥈 2º Lugar
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{rankedTeams[1]?.name}</h3>
              <p className="mb-3 text-sm text-[#b2b2b2]">{rankedTeams[1]?.project}</p>
              <div className="text-3xl font-extrabold text-[#2debb1]">
                {rankedTeams[1]?.totalScore.toFixed(2)}
              </div>
            </SpotlightCard>

            {/* MVP Ambassador */}
            <SpotlightCard className="p-6" spotlightColor="rgba(152,16,250,0.15)">
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9810fa]">
                ⭐ Embaixador MVP
              </div>
              <h3 className="mb-1 text-xl font-bold text-white">{mvp?.name}</h3>
              <p className="mb-3 text-sm text-[#b2b2b2]">
                {mvp?.metrics.totalPoints} pontos totais
              </p>
              <div className="gradient-brand-text text-3xl font-extrabold">
                {mvp?.metrics.attendance}% presença
              </div>
            </SpotlightCard>
          </div>
        </section>
      </main>
    </>
  )
}
```

**Step 2: Install lucide-react**

```bash
pnpm add lucide-react
```

**Step 3: Type check and run dev**

```bash
npx tsc --noEmit
pnpm dev
```

Open http://localhost:3000 and verify the home page renders with aurora background, blur text, stats counters, and spotlight cards.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build home page with aurora hero, stats, and highlights"
```

---

## Task 9: Score bar component + Results page (/resultados)

**Files:**
- Create: `components/public/score-bar.tsx`
- Create: `components/public/podium.tsx`
- Create: `app/resultados/page.tsx`

**Step 1: Create components/public/score-bar.tsx**

```tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScoreBarProps {
  label: string
  value: number
  max?: number
  color?: 'purple' | 'teal'
}

export function ScoreBar({ label, value, max = 10, color = 'purple' }: ScoreBarProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const pct = (value / max) * 100
  const bg = color === 'purple' ? '#9810fa' : '#2debb1'

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-[#b2b2b2]">{label}</span>
        <span className="font-semibold text-white">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: bg }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}
```

**Step 2: Create components/public/podium.tsx**

```tsx
'use client'
import { motion } from 'framer-motion'
import type { Team } from '@/lib/types'
import { GradientText } from '@/components/animated/gradient-text'

interface PodiumProps {
  teams: Team[]
}

export function Podium({ teams }: PodiumProps) {
  const [first, second, third] = [teams[0], teams[1], teams[2]]
  const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }

  const PodiumBlock = ({ team, position, height }: { team: Team; position: 1 | 2 | 3; height: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: position * 0.15 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="text-center">
        <div className="mb-1 text-2xl">{MEDAL[position]}</div>
        <div className="text-sm font-bold text-white">{team.name}</div>
        <div className="text-xs text-[#b2b2b2]">{team.project}</div>
        <div className="mt-1 text-lg font-extrabold">
          {position === 1 ? (
            <GradientText>{team.totalScore.toFixed(2)}</GradientText>
          ) : (
            <span className="text-[#2debb1]">{team.totalScore.toFixed(2)}</span>
          )}
        </div>
      </div>
      <div
        className={`flex w-24 items-center justify-center rounded-t-lg text-xl font-black text-white ${
          position === 1 ? 'bg-gradient-to-b from-[#9810fa] to-[#6c0bb8]' :
          position === 2 ? 'bg-[#2a2a2b] border border-white/20' :
          'bg-[#232322] border border-white/10'
        }`}
        style={{ height }}
      >
        {position}
      </div>
    </motion.div>
  )

  return (
    <div className="flex items-end justify-center gap-4">
      {second && <PodiumBlock team={second} position={2} height="80px" />}
      {first && <PodiumBlock team={first} position={1} height="120px" />}
      {third && <PodiumBlock team={third} position={3} height="60px" />}
    </div>
  )
}
```

**Step 3: Create app/resultados/page.tsx**

```tsx
import { PublicNavbar } from '@/components/public/navbar'
import { Podium } from '@/components/public/podium'
import { ScoreBar } from '@/components/public/score-bar'
import { GradientText } from '@/components/animated/gradient-text'
import { getRankedTeams, getRankedParticipants, hackathonConfig, getParticipantById } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'

export default function ResultadosPage() {
  const teams = getRankedTeams()
  const participants = getRankedParticipants()

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-white sm:text-5xl">
            <GradientText>Resultados Finais</GradientText>
          </h1>
          <p className="text-[#b2b2b2]">{hackathonConfig.edition} · {hackathonConfig.date}</p>
        </div>

        {/* Podium */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-xl font-semibold text-white">Pódio</h2>
          <Podium teams={teams} />
        </section>

        {/* Teams Ranking */}
        <section className="mb-20">
          <h2 className="mb-6 text-2xl font-bold text-white">Ranking de Times</h2>
          <div className="space-y-4">
            {teams.map((team, i) => (
              <div
                key={team.id}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-[#636363]">#{team.position}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{team.name}</h3>
                      <p className="text-sm text-[#b2b2b2]">{team.project}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {team.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-[#b2b2b2]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold">
                      {i === 0 ? (
                        <GradientText>{team.totalScore.toFixed(2)}</GradientText>
                      ) : (
                        <span className="text-white">{team.totalScore.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="text-xs text-[#636363]">pontuação total</div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {hackathonConfig.criteria.map((criterion, ci) => (
                    <ScoreBar
                      key={criterion}
                      label={criterion}
                      value={team.scores[criterion] ?? 0}
                      color={ci % 2 === 0 ? 'purple' : 'teal'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Individual Leaderboard */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-white">Leaderboard Individual</h2>
          <div className="glass overflow-hidden rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-widest text-[#636363]">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Embaixador</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Presença</th>
                  <th className="px-6 py-4">Tasks</th>
                  <th className="px-6 py-4">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const team = getRankedTeams().find(t => t.id === p.teamId)
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                        i % 2 === 0 ? 'bg-[#2a2a2b]/50' : 'bg-[#232322]/50'
                      }`}
                    >
                      <td className="px-6 py-4 text-[#636363] font-bold">{i + 1}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${i === 0 ? 'gradient-brand-text' : 'text-white'}`}>
                          {p.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#b2b2b2]">{team?.name ?? '—'}</td>
                      <td className="px-6 py-4 text-[#2debb1]">{p.metrics.attendance}%</td>
                      <td className="px-6 py-4 text-[#b2b2b2]">{p.metrics.tasksCompleted}</td>
                      <td className="px-6 py-4 font-bold text-white">{p.metrics.totalPoints}</td>
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

**Step 4: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

Open http://localhost:3000/resultados — verify podium, ranking cards with score bars, and leaderboard table.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build results page with podium, team ranking, and individual leaderboard"
```

---

## Task 10: Teams list page (/times)

**Files:**
- Create: `app/times/page.tsx`

**Step 1: Create app/times/page.tsx**

```tsx
import { PublicNavbar } from '@/components/public/navbar'
import { TiltedCard } from '@/components/animated/tilted-card'
import { GradientText } from '@/components/animated/gradient-text'
import { getRankedTeams, getTeamParticipants } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, ArrowRight } from 'lucide-react'

export default function TimesPage() {
  const teams = getRankedTeams()

  return (
    <>
      <PublicNavbar />
      {/* Hexagon background via CSS */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='98'%3E%3Cpath d='M28 66L0 49V16L28 0l28 16v33L28 66zm0-2l26-15V18L28 2 2 18v30l26 15z' fill='%239810fa' opacity='0.15'/%3E%3C/svg%3E")`,
        }}
      />
      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-white sm:text-5xl">
            <GradientText>Times</GradientText>
          </h1>
          <p className="text-[#b2b2b2]">Todos os times participantes do hackathon</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {teams.map((team) => {
            const members = getTeamParticipants(team.id)
            return (
              <TiltedCard key={team.id}>
                <Link href={`/times/${team.id}`}>
                  <div className="glass rounded-2xl p-6 transition-colors hover:border-[#9810fa]/40">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        {team.position && (
                          <span className="mb-2 inline-block text-xs font-bold text-[#9810fa]">
                            #{team.position} no ranking
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-white">{team.name}</h3>
                        <p className="text-base font-semibold text-[#2debb1]">{team.project}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-white">
                          {team.totalScore.toFixed(2)}
                        </div>
                        <div className="text-xs text-[#636363]">score</div>
                      </div>
                    </div>

                    <p className="mb-4 text-sm text-[#b2b2b2] line-clamp-2">{team.description}</p>

                    <div className="mb-4 flex flex-wrap gap-1">
                      {team.tags?.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/10 text-xs text-[#b2b2b2]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-[#b2b2b2]">
                        <Users className="h-4 w-4" />
                        {members.map(m => m.name).join(', ')}
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#9810fa]" />
                    </div>
                  </div>
                </Link>
              </TiltedCard>
            )
          })}
        </div>
      </main>
    </>
  )
}
```

**Step 2: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

Open http://localhost:3000/times — verify tilted cards with team info.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: build teams list page with tilted cards"
```

---

## Task 11: Team detail page (/times/[id])

**Files:**
- Create: `app/times/[id]/page.tsx`

**Step 1: Create app/times/[id]/page.tsx**

```tsx
import { PublicNavbar } from '@/components/public/navbar'
import { ScoreBar } from '@/components/public/score-bar'
import { GradientText } from '@/components/animated/gradient-text'
import { getTeamById, getTeamParticipants, hackathonConfig } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = getTeamById(params.id)
  if (!team) return notFound()

  const members = getTeamParticipants(team.id)

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <Link
          href="/times"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#b2b2b2] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para times
        </Link>

        {/* Header */}
        <div className="glass mb-8 rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {team.position && (
                <span className="mb-2 inline-block rounded-full bg-[#9810fa]/20 px-3 py-1 text-xs font-bold text-[#9810fa]">
                  #{team.position} lugar
                </span>
              )}
              <h1 className="mb-1 text-3xl font-extrabold text-white">{team.name}</h1>
              <p className="mb-3 text-xl font-semibold text-[#2debb1]">{team.project}</p>
              <p className="mb-4 text-[#b2b2b2]">{team.description}</p>
              <div className="flex flex-wrap gap-2">
                {team.tags?.map(tag => (
                  <Badge key={tag} className="bg-white/10 text-[#b2b2b2]">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black">
                <GradientText>{team.totalScore.toFixed(2)}</GradientText>
              </div>
              <div className="text-sm text-[#636363]">pontuação final</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Scores */}
          <div className="glass rounded-2xl p-6">
            <h2 className="mb-6 text-lg font-bold text-white">Critérios de Avaliação</h2>
            <div className="space-y-4">
              {hackathonConfig.criteria.map((criterion, i) => (
                <ScoreBar
                  key={criterion}
                  label={criterion}
                  value={team.scores[criterion] ?? 0}
                  color={i % 2 === 0 ? 'purple' : 'teal'}
                />
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="glass rounded-2xl p-6">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
              <Users className="h-5 w-5 text-[#9810fa]" />
              Membros ({members.length})
            </h2>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-xs text-[#b2b2b2]">
                      {member.metrics.tasksCompleted} tasks · {member.metrics.attendance}% presença
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#2debb1]">{member.metrics.totalPoints}</div>
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

**Step 2: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

Open http://localhost:3000/times/t1 — verify team detail with scores and members.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: build team detail page with score breakdown and members"
```

---

## Task 12: Admin layout + login page

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`
- Create: `components/admin/admin-guard.tsx`

**Step 1: Create components/admin/admin-guard.tsx**

```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/admin')
    }
  }, [router])

  if (!isAuthenticated()) return null

  return <>{children}</>
}
```

**Step 2: Create app/admin/layout.tsx**

```tsx
import type { ReactNode } from 'react'

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#1a1a1b]">{children}</div>
}
```

**Step 3: Create app/admin/page.tsx (login)**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GradientText } from '@/components/animated/gradient-text'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Small delay for UX
    await new Promise(r => setTimeout(r, 300))

    if (login(password)) {
      router.push('/admin/dashboard')
    } else {
      setError('Senha incorreta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="glass rounded-2xl p-8">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9810fa]/20">
              <Lock className="h-6 w-6 text-[#9810fa]" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              <GradientText>Backoffice</GradientText>
            </h1>
            <p className="text-sm text-[#b2b2b2]">Borderless Hackathon</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#b2b2b2]">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-white/10 bg-white/5 text-white placeholder:text-[#636363] focus:border-[#9810fa]"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9810fa] hover:bg-[#b040ff] text-white font-semibold"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

Open http://localhost:3000/admin — verify login form. Try password `borderless2026` — should redirect to `/admin/dashboard` (404 for now, that's fine).

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add admin login page with sessionStorage auth"
```

---

## Task 13: Admin dashboard layout + dashboard page

**Files:**
- Create: `app/admin/dashboard/layout.tsx`
- Create: `app/admin/dashboard/page.tsx`
- Create: `components/admin/admin-sidebar.tsx`

**Step 1: Create components/admin/admin-sidebar.tsx**

```tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import {
  LayoutDashboard, Users, Trophy, Upload, Download, LogOut
} from 'lucide-react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/teams', label: 'Times', icon: Trophy },
  { href: '/admin/participants', label: 'Participantes', icon: Users },
  { href: '/admin/import', label: 'Importar', icon: Upload },
  { href: '/admin/export', label: 'Exportar', icon: Download },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/admin')
  }

  return (
    <aside className="fixed left-0 top-0 flex h-full w-60 flex-col border-r border-white/10 bg-[#1e1e1f] px-4 py-6">
      <div className="mb-8 px-2">
        <div className="text-sm font-bold text-white">Borderless</div>
        <div className="text-xs text-[#636363]">Hackathon · Admin</div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-[#9810fa]/20 text-[#9810fa]'
                : 'text-[#b2b2b2] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#636363] transition-colors hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </aside>
  )
}
```

**Step 2: Create app/admin/dashboard/layout.tsx**

```tsx
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminGuard } from '@/components/admin/admin-guard'
import type { ReactNode } from 'react'

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="ml-60 flex-1 p-8">{children}</main>
      </div>
    </AdminGuard>
  )
}
```

**Step 3: Create app/admin/dashboard/page.tsx**

```tsx
import { teams, participants, hackathonConfig } from '@/lib/mock-data'
import { GradientText } from '@/components/animated/gradient-text'
import { Trophy, Users, Code2, Star } from 'lucide-react'

const rankedTeams = [...teams].sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
const rankedParticipants = [...participants].sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">
        <GradientText>Dashboard</GradientText>
      </h1>
      <p className="mb-8 text-[#b2b2b2]">{hackathonConfig.name} · {hackathonConfig.edition}</p>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Times', value: teams.length, icon: Code2, color: '#9810fa' },
          { label: 'Participantes', value: participants.length, icon: Users, color: '#2debb1' },
          { label: 'Critérios', value: hackathonConfig.criteria.length, icon: Star, color: '#9810fa' },
          { label: 'Status', value: hackathonConfig.status === 'finished' ? 'Finalizado' : 'Em andamento', icon: Trophy, color: '#2debb1', isText: true },
        ].map(({ label, value, icon: Icon, color, isText }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className={`font-bold text-white ${isText ? 'text-base' : 'text-3xl'}`}>{value}</div>
            <div className="mt-1 text-sm text-[#636363]">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Teams */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-white">Top Times</h2>
          <div className="space-y-3">
            {rankedTeams.slice(0, 5).map((team) => (
              <div key={team.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm font-bold text-[#636363]">#{team.position}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{team.name}</div>
                    <div className="text-xs text-[#b2b2b2]">{team.project}</div>
                  </div>
                </div>
                <span className="font-bold text-[#9810fa]">{team.totalScore.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Participants */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-white">Top Participantes</h2>
          <div className="space-y-3">
            {rankedParticipants.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm font-bold text-[#636363]">#{i + 1}</span>
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                </div>
                <span className="font-bold text-[#2debb1]">{p.metrics.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 4: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

Login at http://localhost:3000/admin → redirects to dashboard. Verify sidebar navigation and summary cards.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build admin dashboard with sidebar layout and summary cards"
```

---

## Task 14: Admin teams management page

**Files:**
- Create: `app/admin/teams/page.tsx`
- Create: `components/admin/team-edit-dialog.tsx`

**Step 1: Create components/admin/team-edit-dialog.tsx**

```tsx
'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Team } from '@/lib/types'
import { hackathonConfig } from '@/lib/mock-data'

interface TeamEditDialogProps {
  team: Team | null
  open: boolean
  onClose: () => void
  onSave: (team: Team) => void
}

export function TeamEditDialog({ team, open, onClose, onSave }: TeamEditDialogProps) {
  const [scores, setScores] = useState<Record<string, number>>(team?.scores ?? {})

  if (!team) return null

  function handleSave() {
    const total = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    onSave({ ...team!, scores, totalScore: parseFloat(total.toFixed(3)) })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-[#2a2a2b] text-white">
        <DialogHeader>
          <DialogTitle>Editar Notas — {team.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-[#b2b2b2]">Projeto: {team.project}</p>
          <div className="space-y-3">
            {hackathonConfig.criteria.map((criterion) => (
              <div key={criterion} className="space-y-1">
                <Label className="text-[#b2b2b2]">{criterion} (0–10)</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={scores[criterion] ?? 0}
                  onChange={e => setScores(prev => ({ ...prev, [criterion]: parseFloat(e.target.value) || 0 }))}
                  className="border-white/10 bg-white/5 text-white"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2]">Cancelar</Button>
            <Button onClick={handleSave} className="bg-[#9810fa] hover:bg-[#b040ff] text-white">Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Create app/admin/teams/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import { teams as initialTeams, hackathonConfig } from '@/lib/mock-data'
import { TeamEditDialog } from '@/components/admin/team-edit-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Team } from '@/lib/types'
import { Pencil } from 'lucide-react'
import { GradientText } from '@/components/animated/gradient-text'

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  function handleSave(updated: Team) {
    setTeams(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">
        <GradientText>Times</GradientText>
      </h1>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-widest text-[#636363]">
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Projeto</th>
              {hackathonConfig.criteria.map(c => (
                <th key={c} className="px-4 py-4">{c}</th>
              ))}
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => (
              <tr
                key={team.id}
                className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#2a2a2b]/50' : 'bg-[#232322]/50'}`}
              >
                <td className="px-6 py-4 font-semibold text-white">{team.name}</td>
                <td className="px-6 py-4 text-[#b2b2b2]">{team.project}</td>
                {hackathonConfig.criteria.map(c => (
                  <td key={c} className="px-4 py-4 text-center text-[#2debb1]">
                    {team.scores[c]?.toFixed(1) ?? '—'}
                  </td>
                ))}
                <td className="px-6 py-4 font-bold text-[#9810fa]">{team.totalScore.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingTeam(team)}
                    className="h-8 w-8 p-0 text-[#b2b2b2] hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TeamEditDialog
        team={editingTeam}
        open={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        onSave={handleSave}
      />
    </div>
  )
}
```

**Note:** These pages need `layout.tsx` with the admin guard. Since `app/admin/dashboard/layout.tsx` already has the guard and sidebar, other admin pages should be inside the same layout group. To avoid duplication, restructure routes using a route group:

After creating teams page, move the layout to cover all admin sub-routes by adding `/admin/teams/layout.tsx` that re-uses the same sidebar, OR use a route group. For simplicity, add the following file to reuse the layout:

Create `app/admin/teams/layout.tsx`:
```tsx
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminGuard } from '@/components/admin/admin-guard'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="ml-60 flex-1 p-8">{children}</main>
      </div>
    </AdminGuard>
  )
}
```

Do the same for `participants`, `import`, `export` pages.

**Step 3: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

Navigate to http://localhost:3000/admin/teams — verify table with score columns and edit button opens dialog.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build admin teams management with edit dialog"
```

---

## Task 15: Admin participants management page

**Files:**
- Create: `app/admin/participants/page.tsx`
- Create: `app/admin/participants/layout.tsx`
- Create: `components/admin/participant-edit-dialog.tsx`

**Step 1: Create components/admin/participant-edit-dialog.tsx**

```tsx
'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Participant } from '@/lib/types'

interface Props {
  participant: Participant | null
  open: boolean
  onClose: () => void
  onSave: (p: Participant) => void
}

export function ParticipantEditDialog({ participant, open, onClose, onSave }: Props) {
  const [metrics, setMetrics] = useState(participant?.metrics ?? {
    tasksCompleted: 0, attendance: 0, contributions: 0, totalPoints: 0,
  })

  if (!participant) return null

  const fields: { key: keyof typeof metrics; label: string }[] = [
    { key: 'tasksCompleted', label: 'Tasks Completadas' },
    { key: 'attendance', label: 'Presença (0–100%)' },
    { key: 'contributions', label: 'Contribuições' },
    { key: 'totalPoints', label: 'Pontos Totais' },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-white/10 bg-[#2a2a2b] text-white">
        <DialogHeader>
          <DialogTitle>Editar Métricas — {participant.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {fields.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-[#b2b2b2]">{label}</Label>
              <Input
                type="number"
                min={0}
                value={metrics[key]}
                onChange={e => setMetrics(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} className="text-[#b2b2b2]">Cancelar</Button>
            <Button
              onClick={() => { onSave({ ...participant, metrics }); onClose() }}
              className="bg-[#9810fa] hover:bg-[#b040ff] text-white"
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Create app/admin/participants/layout.tsx** (same as teams layout — copy it)

**Step 3: Create app/admin/participants/page.tsx**

```tsx
'use client'
import { useState } from 'react'
import { participants as initialParticipants, teams } from '@/lib/mock-data'
import { ParticipantEditDialog } from '@/components/admin/participant-edit-dialog'
import { Button } from '@/components/ui/button'
import type { Participant } from '@/lib/types'
import { Pencil } from 'lucide-react'
import { GradientText } from '@/components/animated/gradient-text'

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [editing, setEditing] = useState<Participant | null>(null)

  function handleSave(updated: Participant) {
    setParticipants(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  const sorted = [...participants].sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">
        <GradientText>Participantes</GradientText>
      </h1>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs font-semibold uppercase tracking-widest text-[#636363]">
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Tasks</th>
              <th className="px-6 py-4">Presença</th>
              <th className="px-6 py-4">Contribuições</th>
              <th className="px-6 py-4">Pontos</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const team = teams.find(t => t.id === p.teamId)
              return (
                <tr key={p.id} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#2a2a2b]/50' : 'bg-[#232322]/50'}`}>
                  <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                  <td className="px-6 py-4 text-[#b2b2b2]">{team?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-center text-[#b2b2b2]">{p.metrics.tasksCompleted}</td>
                  <td className="px-6 py-4 text-center text-[#2debb1]">{p.metrics.attendance}%</td>
                  <td className="px-6 py-4 text-center text-[#b2b2b2]">{p.metrics.contributions}</td>
                  <td className="px-6 py-4 font-bold text-[#9810fa]">{p.metrics.totalPoints}</td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(p)} className="h-8 w-8 p-0 text-[#b2b2b2] hover:text-white">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ParticipantEditDialog
        participant={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </div>
  )
}
```

**Step 4: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build admin participants management with edit dialog"
```

---

## Task 16: Excel utilities + Import page

**Files:**
- Create: `lib/excel.ts`
- Create: `app/admin/import/page.tsx`
- Create: `app/admin/import/layout.tsx`

**Step 1: Create lib/excel.ts**

```ts
import * as XLSX from 'xlsx'
import type { ImportedTeamRow, ImportedParticipantRow } from './types'

export function parseTeamsSheet(file: File): Promise<ImportedTeamRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<ImportedTeamRow>(ws)
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

export function parseParticipantsSheet(file: File): Promise<ImportedParticipantRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const sheetName = wb.SheetNames[1] ?? wb.SheetNames[0]
        const ws = wb.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json<ImportedParticipantRow>(ws)
        resolve(rows)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

export function downloadTemplate(): void {
  const wb = XLSX.utils.book_new()

  // Teams sheet
  const teamsWs = XLSX.utils.aoa_to_sheet([
    ['Nome', 'Projeto', 'Descricao', 'Membros'],
    ['DevForce', 'BorderBot', 'Descrição do projeto', 'Ana Souza, Bruno Lima'],
  ])
  XLSX.utils.book_append_sheet(wb, teamsWs, 'Times')

  // Participants sheet
  const participantsWs = XLSX.utils.aoa_to_sheet([
    ['Nome', 'Time', 'Tasks', 'Presenca', 'Contribuicoes'],
    ['Ana Souza', 'DevForce', 12, 95, 18],
  ])
  XLSX.utils.book_append_sheet(wb, participantsWs, 'Participantes')

  XLSX.writeFile(wb, 'template-hackathon.xlsx')
}

export function exportReport(
  teams: import('./types').Team[],
  participants: import('./types').Participant[],
  criteria: string[]
): void {
  const wb = XLSX.utils.book_new()

  // Teams sheet
  const teamsHeaders = ['Posição', 'Nome', 'Projeto', 'Membros', ...criteria, 'Total']
  const teamsRows = teams
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .map(t => [
      t.position ?? '—',
      t.name,
      t.project,
      t.members.join(', '),
      ...criteria.map(c => t.scores[c] ?? 0),
      t.totalScore,
    ])
  const teamsWs = XLSX.utils.aoa_to_sheet([teamsHeaders, ...teamsRows])
  XLSX.utils.book_append_sheet(wb, teamsWs, 'Times')

  // Participants sheet
  const partHeaders = ['Posição', 'Nome', 'Time', 'Tasks', 'Presença', 'Contribuições', 'Total Pontos']
  const partRows = [...participants]
    .sort((a, b) => b.metrics.totalPoints - a.metrics.totalPoints)
    .map((p, i) => {
      const team = teams.find(t => t.id === p.teamId)
      return [i + 1, p.name, team?.name ?? '—', p.metrics.tasksCompleted, p.metrics.attendance, p.metrics.contributions, p.metrics.totalPoints]
    })
  const partWs = XLSX.utils.aoa_to_sheet([partHeaders, ...partRows])
  XLSX.utils.book_append_sheet(wb, partWs, 'Participantes')

  XLSX.writeFile(wb, 'relatorio-hackathon.xlsx')
}
```

**Step 2: Create app/admin/import/layout.tsx** (same admin layout with guard — copy from teams)

**Step 3: Create app/admin/import/page.tsx**

```tsx
'use client'
import { useState, useRef } from 'react'
import { parseTeamsSheet, parseParticipantsSheet, downloadTemplate } from '@/lib/excel'
import { GradientText } from '@/components/animated/gradient-text'
import { Button } from '@/components/ui/button'
import type { ImportedTeamRow, ImportedParticipantRow } from '@/lib/types'
import { Upload, Download, CheckCircle } from 'lucide-react'

export default function ImportPage() {
  const [teams, setTeams] = useState<ImportedTeamRow[]>([])
  const [participants, setParticipants] = useState<ImportedParticipantRow[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError('')
    setSuccess(false)
    try {
      const [t, p] = await Promise.all([parseTeamsSheet(file), parseParticipantsSheet(file)])
      setTeams(t)
      setParticipants(p)
    } catch {
      setError('Erro ao ler o arquivo. Verifique se está no formato correto.')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleConfirm() {
    // In a real app, this would call an API. For now, just show success.
    setSuccess(true)
    setTeams([])
    setParticipants([])
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          <GradientText>Importar Dados</GradientText>
        </h1>
        <Button
          variant="ghost"
          onClick={downloadTemplate}
          className="gap-2 text-[#b2b2b2] hover:text-white"
        >
          <Download className="h-4 w-4" />
          Baixar Template
        </Button>
      </div>
      <p className="mb-8 text-sm text-[#b2b2b2]">
        Importe a planilha com times e participantes. Use o template acima para garantir o formato correto.
      </p>

      {/* Dropzone */}
      <div
        className="glass mb-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 p-12 transition-colors hover:border-[#9810fa]/50"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="mb-3 h-10 w-10 text-[#636363]" />
        <p className="text-sm font-medium text-[#b2b2b2]">Arraste o arquivo .xlsx ou clique para selecionar</p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#2debb1]/10 p-4 text-sm text-[#2debb1]">
          <CheckCircle className="h-4 w-4" />
          Dados importados com sucesso!
        </div>
      )}

      {/* Preview */}
      {teams.length > 0 && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold text-white">Times ({teams.length})</h3>
            <div className="space-y-2">
              {teams.map((t, i) => (
                <div key={i} className="flex justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="font-medium text-white">{t.Nome}</span>
                  <span className="text-[#b2b2b2]">{t.Projeto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="mb-3 font-semibold text-white">Participantes ({participants.length})</h3>
            <div className="space-y-2">
              {participants.map((p, i) => (
                <div key={i} className="flex justify-between rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="font-medium text-white">{p.Nome}</span>
                  <span className="text-[#b2b2b2]">{p.Time}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full bg-[#9810fa] hover:bg-[#b040ff] text-white font-semibold py-6"
          >
            Confirmar Importação
          </Button>
        </div>
      )}
    </div>
  )
}
```

**Step 4: Type check**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: build Excel import page with dropzone and preview"
```

---

## Task 17: Export page

**Files:**
- Create: `app/admin/export/page.tsx`
- Create: `app/admin/export/layout.tsx`

**Step 1: Create app/admin/export/layout.tsx** (same admin layout — copy from teams)

**Step 2: Create app/admin/export/page.tsx**

```tsx
'use client'
import { exportReport } from '@/lib/excel'
import { teams, participants, hackathonConfig } from '@/lib/mock-data'
import { GradientText } from '@/components/animated/gradient-text'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet } from 'lucide-react'

export default function ExportPage() {
  function handleExport() {
    exportReport(teams, participants, hackathonConfig.criteria)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-white">
        <GradientText>Exportar Relatório</GradientText>
      </h1>
      <p className="mb-8 text-sm text-[#b2b2b2]">
        Gera um arquivo .xlsx com o ranking completo de times e o leaderboard individual de participantes.
      </p>

      <div className="glass rounded-2xl p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#2debb1]/20">
            <FileSpreadsheet className="h-6 w-6 text-[#2debb1]" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-white">relatorio-hackathon.xlsx</h3>
            <p className="text-sm text-[#b2b2b2]">
              Contém 2 abas: <strong className="text-white">Times</strong> (posição, nome, projeto, critérios, total) e{' '}
              <strong className="text-white">Participantes</strong> (posição, nome, time, métricas, pontos).
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="font-semibold text-white">{teams.length} times</div>
            <div className="text-[#636363]">com {hackathonConfig.criteria.length} critérios</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <div className="font-semibold text-white">{participants.length} participantes</div>
            <div className="text-[#636363]">com métricas individuais</div>
          </div>
        </div>

        <Button
          onClick={handleExport}
          className="w-full gap-2 bg-[#2debb1] hover:bg-[#24c994] text-[#111] font-bold py-6 text-base"
        >
          <Download className="h-5 w-5" />
          Exportar Relatório Excel
        </Button>
      </div>
    </div>
  )
}
```

**Step 3: Type check and verify**

```bash
npx tsc --noEmit
pnpm dev
```

Navigate to http://localhost:3000/admin/export. Click "Exportar" — verify that a `.xlsx` file downloads.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build Excel export page"
```

---

## Task 18: CLAUDE.md + final polish

**Files:**
- Create: `CLAUDE.md`

**Step 1: Create CLAUDE.md**

```markdown
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
- Gradient text utility: `.gradient-brand-text` class

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
pnpm dev       # start dev server
npx tsc --noEmit  # type check
```
```

**Step 2: Final type check and lint**

```bash
npx tsc --noEmit && pnpm lint
```

Fix any remaining lint errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Borderless Hackathon frontend

Public pages: home, results, teams, team detail
Admin backoffice: dashboard, teams, participants, import, export
Design system: Borderless branding (purple/teal/dark)
Animations: aurora hero, blur text, spotlight cards, score bars, podium
Excel: import with preview + export report"
```

---

## Summary

| Task | What it builds |
|---|---|
| 1 | Dependencies + shadcn init |
| 2 | Design system (CSS vars, Montserrat font) |
| 3 | TypeScript types |
| 4 | Mock data |
| 5 | Auth + middleware |
| 6 | Animated components (blur, spotlight, tilted, counting, gradient, aurora) |
| 7 | Public navbar |
| 8 | Home page (aurora hero, stats, highlights) |
| 9 | Results page (podium, ranking, leaderboard) |
| 10 | Teams list (tilted cards, hexagon bg) |
| 11 | Team detail (scores, members) |
| 12 | Admin login |
| 13 | Admin dashboard + sidebar layout |
| 14 | Admin teams management + edit dialog |
| 15 | Admin participants management + edit dialog |
| 16 | Excel import with dropzone + preview |
| 17 | Excel export |
| 18 | CLAUDE.md + polish |
