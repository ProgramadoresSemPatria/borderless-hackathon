import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware can't access sessionStorage (server-side).
  // Protection is handled client-side in admin layout via AdminGuard component.
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
