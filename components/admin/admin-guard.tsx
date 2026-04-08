// Auth is enforced server-side via middleware.ts + signed httpOnly cookie.
// This component is kept as a pass-through for backwards compatibility.
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
