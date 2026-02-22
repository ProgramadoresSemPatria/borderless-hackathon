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
