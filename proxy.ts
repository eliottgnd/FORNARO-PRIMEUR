import { NextResponse, type NextRequest } from 'next/server'

const SITE_PAUSED = true

export function proxy(request: NextRequest) {
  if (!SITE_PAUSED) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { message: 'Le site est momentanément en pause.' },
      { status: 503, headers: { 'Retry-After': '3600' } },
    )
  }

  if (request.nextUrl.pathname !== '/pause') {
    return NextResponse.rewrite(new URL('/pause', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)'],
}
