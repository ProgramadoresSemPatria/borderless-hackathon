import { AdminSidebar } from './admin-sidebar'
import { AdminGuard } from './admin-guard'
import type { ReactNode } from 'react'

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="ml-60 flex-1 p-8">{children}</main>
      </div>
    </AdminGuard>
  )
}
