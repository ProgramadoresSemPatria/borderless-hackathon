import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Vote, BarChart3 } from 'lucide-react'

type Status = 'upcoming' | 'live' | 'finished'
type Edition = Awaited<
  ReturnType<typeof fetchQuery<typeof api.hackathons.listEditions>>
>[number]

const STATUS = {
  live: { label: 'Ao vivo', dot: 'bg-[#2debb1]', text: 'text-[#2debb1]' },
  upcoming: { label: 'Em breve', dot: 'bg-amber-400', text: 'text-amber-300' },
  finished: { label: 'Finalizado', dot: 'bg-[#9810fa]', text: 'text-[#b06bff]' },
} satisfies Record<Status, { label: string; dot: string; text: string }>

function editionCode(h: Edition): string {
  const src = (h.githubPrefix || h.slug || h.edition || '').toUpperCase()
  const hb = src.match(/HB\s*0*(\d+)\D*(\d{4})/)
  if (hb) return `HB${hb[1].padStart(2, '0')}·${hb[2]}`
  return h.edition
}

export default async function HomePage() {
  let editions: Edition[]
  try {
    editions = await fetchQuery(api.hackathons.listEditions, {})
  } catch (err) {
    console.error('[HomePage] listEditions failed:', err)
    throw err
  }

  if (editions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#636363]">Borderless · Hackathon</p>
          <h1 className="mb-3 text-3xl font-black">Nenhuma edição ainda</h1>
          <p className="mb-8 text-[#9a9a9a]">Entre no painel administrativo para criar a primeira edição.</p>
          <Link href="/admin" className="text-sm font-semibold text-[#b06bff] hover:underline">Acessar admin →</Link>
        </div>
      </main>
    )
  }

  const featured =
    editions.find((e) => e.status === 'live') ??
    editions.find((e) => e.status === 'upcoming') ??
    editions[0]
  const past = editions.filter((e) => e._id !== featured._id)
  const votingOpen = featured.votingOpen === true
  const fLive = featured.status === 'live'

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-8">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#636363]">Borderless · Hackathon</p>
        <h1 className="text-3xl font-black text-white">Edições</h1>
      </header>

      {/* ── Edição atual ─────────────────────────────────────── */}
      <section className="mb-12 rounded-2xl border border-white/[0.08] bg-[#2a2a2b] p-7 sm:p-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1">
            <span className="relative flex h-2 w-2">
              {fLive && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2debb1] opacity-75" />}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${fLive ? 'bg-[#2debb1]' : 'bg-[#9810fa]'}`} />
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${fLive ? 'text-[#2debb1]' : 'text-[#b06bff]'}`}>
              {fLive ? 'Ao vivo' : 'Edição atual'}
            </span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7a7a7a] tabular-nums">{editionCode(featured)}</span>
        </div>

        <h2 className="text-3xl font-black text-white sm:text-4xl">{featured.name}</h2>
        <p className="mt-2 text-sm text-[#9a9a9a]">
          {featured.edition} · {featured.date}
        </p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <span className="text-xl font-black tabular-nums text-white">{featured.teamCount}</span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a7a7a]">{featured.teamCount === 1 ? 'projeto' : 'projetos'}</span>
          </div>
          <div>
            <span className={`text-xl font-black ${votingOpen ? 'text-[#2debb1]' : 'text-white/70'}`}>{votingOpen ? 'Aberta' : 'Fechada'}</span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a7a7a]">votação</span>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/${featured.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-[#9810fa] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#a835ff]">
            Entrar na edição <ArrowRight className="h-4 w-4" />
          </Link>
          {votingOpen && (
            <Link href={`/${featured.slug}/votar`} className="inline-flex items-center gap-2 rounded-lg border border-[#2debb1]/40 px-4 py-2.5 text-sm font-bold text-[#2debb1] transition-colors hover:bg-[#2debb1]/10">
              <Vote className="h-4 w-4" /> Votar
            </Link>
          )}
          <Link href={`/${featured.slug}/resultados`} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-[#9a9a9a] transition-colors hover:text-white">
            <BarChart3 className="h-4 w-4" /> Resultados
          </Link>
        </div>
      </section>

      {/* ── Edições anteriores (cards) ───────────────────────── */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#636363]">Edições anteriores</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((ed) => {
              const meta = STATUS[(ed.status as Status) ?? 'finished']
              return (
                <Link
                  key={ed._id}
                  href={`/${ed.slug}`}
                  className="data-card group flex flex-col p-5 transition-colors hover:border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black uppercase tracking-[0.06em] text-[#9a9a9a] tabular-nums">{editionCode(ed)}</span>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${meta.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold text-white">{ed.name}</h3>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#7a7a7a]">
                    <span className="tabular-nums">{ed.teamCount} {ed.teamCount === 1 ? 'time' : 'times'}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#5a5a5a] transition-colors group-hover:text-white" />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
