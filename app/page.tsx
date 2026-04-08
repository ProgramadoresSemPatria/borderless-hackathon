import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { FadeUp } from '@/components/animated/fade-up'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  live: 'Em andamento',
  upcoming: 'Em breve',
  finished: 'Encerrada',
}

function extractYear(date: string): string {
  return date.match(/\d{4}/)?.[0] ?? ''
}

export default async function HomePage() {
  const hackathons = await fetchQuery(api.hackathons.list, {})

  if (hackathons.length === 0) {
    return <EmptyState />
  }

  const featured =
    hackathons.find((h) => h.votingOpen || h.status === 'live') ?? hackathons[0]
  const statusRank: Record<string, number> = { live: 0, upcoming: 1, finished: 2 }
  const archive = [...hackathons].sort((a, b) => {
    const ra = statusRank[a.status] ?? 3
    const rb = statusRank[b.status] ?? 3
    if (ra !== rb) return ra - rb
    const ya = Number(extractYear(a.date)) || 0
    const yb = Number(extractYear(b.date)) || 0
    return yb - ya
  })
  const currentYear = new Date().getFullYear()

  const yearsSpan = (() => {
    const years = hackathons
      .map((h) => Number(extractYear(h.date)))
      .filter((y) => !Number.isNaN(y) && y > 0)
    if (years.length === 0) return ''
    const min = Math.min(...years)
    const max = Math.max(...years)
    return min === max ? `${min}` : `${min}–${max}`
  })()

  return (
    <main className="min-h-screen bg-[#222] text-white">
      {/* ═══════════════════════ MASTHEAD ═══════════════════════ */}
      <header className="relative border-b border-white/[0.08]">
        {/* Masthead rule — tiny meta row */}
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363] lg:px-12">
          <span>Borderless · Hackathon</span>
          <span className="tabular-nums">{yearsSpan || currentYear}</span>
        </div>
      </header>

      {/* ═══════════════════════ WORDMARK ═══════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-20 lg:px-12 lg:pt-32">
          <FadeUp>
            <p className="mb-10 max-w-md text-[11px] font-bold uppercase tracking-[0.25em] text-[#636363]">
              Todas as edições do hackathon Borderless Coding em um só lugar.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="font-black leading-[0.82] tracking-[-0.04em]">
              <span
                className="block text-white"
                style={{ fontSize: 'clamp(3.5rem, 13vw, 12rem)' }}
              >
                BORDERLESS
              </span>
              <span
                className="mt-2 flex items-baseline gap-[0.15em] text-[#9810fa]"
                style={{ fontSize: 'clamp(3.5rem, 13vw, 12rem)' }}
              >
                ARCHIVE
                <span className="text-white/20">.</span>
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-14 border-t border-white/[0.08] pt-6">
              <div className="flex items-baseline gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363]">
                <span>Nº</span>
                <span className="tabular-nums text-white">
                  {String(hackathons.length).padStart(2, '0')}
                </span>
                <span>edições catalogadas</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════ FEATURED / CURRENT EDITION ═══════════════════ */}
      <section className="border-y border-white/[0.08] bg-[#1b1b1b]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
          <FadeUp>
            <div className="mb-10 flex items-center gap-4">
              <span className="inline-flex h-2 w-2 rounded-full bg-[#2debb1] shadow-[0_0_0_4px_rgba(45,235,177,0.12)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2debb1]">
                {featured.votingOpen
                  ? 'Votação aberta'
                  : featured.status === 'live'
                  ? 'Edição atual'
                  : 'Última edição'}
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363] tabular-nums">
                {featured.edition}
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.05}>
            <Link href={`/${featured.slug}`} className="group block">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="min-w-0">
                  <h2
                    className="font-black leading-[0.88] tracking-tight text-white transition-colors group-hover:text-[#9810fa]"
                    style={{ fontSize: 'clamp(2.25rem, 6.5vw, 5.5rem)' }}
                  >
                    {featured.name}
                  </h2>
                  <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#636363]">
                    {featured.date}
                    <span className="mx-3 text-white/20">/</span>
                    {featured.criteria.length} critérios de avaliação
                  </p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-4 border border-white/10 px-8 py-5 transition-all group-hover:border-[#9810fa] group-hover:bg-[#9810fa]">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                    {featured.votingOpen ? 'Votar agora' : 'Ver edição'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════ INDEX / PAST EDITIONS ═══════════════════ */}
      {archive.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12 lg:py-32">
          <FadeUp>
            <div className="mb-12 flex items-baseline justify-between gap-6 border-b border-white/[0.12] pb-5">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
                Índice de edições
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363] tabular-nums">
                {String(archive.length).padStart(2, '0')} {archive.length === 1 ? 'registro' : 'registros'}
              </span>
            </div>
          </FadeUp>

          <ul>
            {archive.map((h, i) => {
              const year = extractYear(h.date)
              return (
                <FadeUp key={h._id} delay={0.04 + i * 0.03}>
                  <li>
                    <Link
                      href={`/${h.slug}`}
                      className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-6 border-b border-white/[0.06] py-10 transition-colors hover:border-white/[0.24] sm:gap-12"
                    >
                      {/* Year — huge, dominant anchor */}
                      <span
                        className="font-black leading-none tabular-nums text-[#2a2a2b] transition-colors group-hover:text-[#9810fa]"
                        style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}
                      >
                        {year || '—'}
                      </span>

                      {/* Name + edition meta */}
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-black leading-tight text-white transition-colors group-hover:text-white sm:text-3xl">
                          {h.name}
                        </h3>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#636363]">
                          {h.edition}
                          <span className="mx-2 text-white/15">·</span>
                          {h.date}
                          <span className="mx-2 text-white/15">·</span>
                          <span
                            style={{
                              color:
                                h.status === 'live'
                                  ? '#2debb1'
                                  : h.status === 'upcoming'
                                  ? '#9810fa'
                                  : '#636363',
                            }}
                          >
                            {STATUS_LABEL[h.status] ?? h.status}
                          </span>
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight
                        className="hidden h-5 w-5 text-white/20 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#9810fa] sm:block"
                        strokeWidth={2.5}
                      />
                    </Link>
                  </li>
                </FadeUp>
              )
            })}
          </ul>
        </section>
      )}

      {/* ═══════════════════ COLOPHON ═══════════════════ */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363] lg:px-12">
          <span>Borderless Coding</span>
          <span>Embaixadores — {currentYear}</span>
        </div>
      </footer>
    </main>
  )
}

function EmptyState() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363] lg:px-12">
          <span>Borderless · Hackathon</span>
          <span className="tabular-nums">{new Date().getFullYear()}</span>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 py-24 lg:px-12">
        <p className="mb-8 max-w-md text-[11px] font-bold uppercase tracking-[0.25em] text-[#636363]">
          Nenhum hackathon catalogado ainda.
        </p>
        <h1
          className="font-black leading-[0.82] tracking-[-0.04em] text-white"
          style={{ fontSize: 'clamp(3rem, 11vw, 10rem)' }}
        >
          BORDERLESS
          <br />
          <span className="text-[#9810fa]">ARCHIVE<span className="text-white/20">.</span></span>
        </h1>
        <div className="mt-14 border-t border-white/[0.08] pt-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-3 border border-[#9810fa] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#9810fa] transition-all hover:bg-[#9810fa] hover:text-white"
          >
            Criar primeira edição
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
