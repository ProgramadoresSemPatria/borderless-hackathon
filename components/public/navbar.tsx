'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

interface PublicNavbarProps {
  slug?: string
}

export function PublicNavbar({ slug }: PublicNavbarProps = {}) {
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  const base = slug ? `/${slug}` : ''
  const links = [
    { href: `${base}/`, label: 'Início' },
    { href: `${base}/resultados`, label: 'Resultados' },
    { href: `${base}/times`, label: 'Times' },
    { href: `${base}/votar`, label: 'Votar' },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#222]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="whitespace-nowrap text-xs font-black uppercase tracking-[0.12em] text-white sm:text-sm">
            Borderless<span className="hidden sm:inline"> · Hackathon</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <nav className="flex items-center gap-0.5 sm:gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] sm:text-xs font-semibold uppercase tracking-[0.06em] sm:tracking-[0.08em] rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 transition-colors ${
                  (link.href === `${base}/` ? pathname === link.href : pathname.startsWith(link.href))
                    ? 'bg-white/12 text-white font-semibold'
                    : 'text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center pl-2">
            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: 'h-7 w-7' } }} />
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:px-3 sm:py-1.5 sm:text-xs sm:tracking-[0.08em]">
                  Entrar
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
