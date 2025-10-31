import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rediriger /admin vers /dashboard (interface React custom)
  // L'interface Payload native est désactivée (admin.disable = true)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Laisser passer toutes les autres requêtes
  return NextResponse.next()
}

/*
// 📝 CODE ORIGINAL (À RÉACTIVER PLUS TARD SI BESOIN)
// Routes qui nécessitent une authentification
const protectedRoutes = ['/admin', '/dashboard']

// Routes Payload CMS (ne pas intercepter)
const payloadRoutes = ['/admin', '/api']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ne pas intercepter les routes Payload
  if (payloadRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Vérifier si l'utilisateur a un cookie de session Payload
    const payloadToken = request.cookies.get('payload-token')

    if (!payloadToken) {
      // Rediriger vers la page de login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}
*/

// Configuration des routes à intercepter
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
