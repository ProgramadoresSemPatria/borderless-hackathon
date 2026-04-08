import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-[#222] text-white">
      {/* Masthead */}
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363] lg:px-12">
          <span>Borderless · Hackathon</span>
          <span className="tabular-nums">404</span>
        </div>
      </header>

      {/* Content */}
      <section className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 py-24 lg:px-12">
        <p className="mb-10 max-w-md text-[11px] font-bold uppercase tracking-[0.25em] text-[#636363]">
          A página que você procura saiu do ar, foi renomeada, ou nunca existiu.
        </p>

        <h1
          className="font-black leading-[0.82] tracking-[-0.04em] text-white"
          style={{ fontSize: 'clamp(3.5rem, 13vw, 12rem)' }}
        >
          NOT
          <br />
          <span className="flex items-baseline gap-[0.15em] text-[#9810fa]">
            FOUND
            <span className="text-white/20">.</span>
          </span>
        </h1>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.08] pt-6">
          <div className="flex items-baseline gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363]">
            <span>Erro</span>
            <span className="tabular-nums text-white">404</span>
            <span>·</span>
            <span>Página não encontrada</span>
          </div>

          <Link
            href="/"
            className="group inline-flex items-center gap-3 border border-[#9810fa] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#9810fa] transition-all hover:bg-[#9810fa] hover:text-white"
          >
            Voltar ao início
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Colophon */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#636363] lg:px-12">
          <span>Borderless · Hackathon</span>
          <span className="tabular-nums">{new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  )
}
