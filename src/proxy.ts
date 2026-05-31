// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const currentUser = request.cookies.get('@gCorporate.token')?.value

  // Rotas protegidas
  const protectedRoutes = [
    '/dashboard',
    '/dashboard/:path*'
  ]

  // Rotas públicas
  const authRoutes = [
    '/login',
    '/register',
    'activate',
    '/'
  ]

  // Verifica se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some((route) => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Verifica se é uma rota de autenticação
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  // Se tentar acessar rota protegida sem estar autenticado
  if (isProtectedRoute && !currentUser) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se tentar acessar rota de autenticação já estando logado
  if (isAuthRoute && currentUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
}
