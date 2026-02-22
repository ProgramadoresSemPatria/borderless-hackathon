'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
        <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded border border-[#9810fa]/30 bg-[#9810fa]/10">
              <Lock className="h-5 w-5 text-[#9810fa]" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Backoffice
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Borderless Hackathon</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Senha</Label>
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
              <p className="rounded border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9810fa] hover:bg-[#9810fa]/90 text-white font-semibold"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
