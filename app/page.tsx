import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const hackathons = await fetchQuery(api.hackathons.list, {})

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: '#222' }}>
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
        {/* Editorial header image */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-white/[0.08]" style={{ aspectRatio: '21/9' }}>
          <img
            src="/brand/hackathon-event.webp"
            alt="Borderless Hackathon"
            width={1200}
            height={514}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mb-10 flex items-center gap-3">
          <img
            src="/brand/logo.png"
            alt="Borderless"
            width={28}
            height={28}
            className="object-contain"
            style={{ width: 28, height: 28 }}
          />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#636363]">Borderless Coding</span>
        </div>
        <h1 className="mb-3 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl">Hackathons</h1>
        <p className="mb-16 text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">{hackathons.length} {hackathons.length === 1 ? 'edição' : 'edições'}</p>

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
