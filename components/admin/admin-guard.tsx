'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const authenticated = isAuthenticated()

  useEffect(() => {
    if (!authenticated) {
      router.replace('/admin')
    }
  }, [router, authenticated])

  if (!authenticated) return null

  return <>{children}</>
}
