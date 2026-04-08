'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout } from '@/lib/auth'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Trophy, LogOut
} from 'lucide-react'

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/teams', label: 'Times', icon: Trophy },
  { href: '/admin/participants', label: 'Participantes', icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/admin')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 flex h-full w-60 flex-col border-r border-white/10 bg-[#1e1e1f] px-4 py-6">
      <div className="mb-8 px-2">
        <div className="text-sm font-bold gradient-brand-text">Borderless</div>
        <div className="text-xs text-[#636363]">Hackathon · Admin</div>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-[#b2b2b2] hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 rounded-xl bg-white/[0.08]"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" aria-hidden="true" />
              <span className="relative z-10">{label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#636363] transition-colors hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sair
      </button>
    </aside>
  )
}
