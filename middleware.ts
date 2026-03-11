import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rotas que NUNCA devem ser interceptadas pelo middleware
    // (API do NextAuth, rotas públicas, assets estáticos)
    if (
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/download') ||
        pathname.startsWith('/portfolio') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon')
    ) {
        return NextResponse.next();
    }

    // Verifica de forma robusta a existência de qualquer cookie de sessão 
    const hasSessionCookie = request.cookies.getAll().some(cookie =>
        cookie.name.includes('session-token')
    );

    const isLoggedIn = hasSessionCookie;

    // Definição das rotas
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isProtectedRoute = pathname.startsWith('/dashboard');

    // Redirecionamentos
    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};

