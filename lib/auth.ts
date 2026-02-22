const SESSION_KEY = 'bl_admin_auth'

export function login(password: string): boolean {
  const correct = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'borderless2026'
  if (password === correct) {
    sessionStorage.setItem(SESSION_KEY, 'true')
    return true
  }
  return false
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}
