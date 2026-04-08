export async function login(password: string): Promise<boolean> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  return res.ok
}

export async function logout(): Promise<void> {
  await fetch('/api/admin/logout', { method: 'POST' })
}
