import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verifica de forma robusta a existência de qualquer cookie de sessão 
    // (NextAuth v4 usa "next-auth.session-token", NextAuth v5 usa "authjs.session-token", e tem as versões HTTPS __Secure)
    const hasSessionCookie = request.cookies.getAll().some(cookie =>
        cookie.name.includes('session-token')
    );

    const isLoggedIn = hasSessionCookie;

    // Definição das rotas
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
    const isProtectedRoute = pathname.startsWith('/dashboard');

    // Redirecionamentos
    if (isAuthRoute && isLoggedIn) {
        // Se está logado, não precisa ver login ou registro. Vai para o painel.
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isProtectedRoute && !isLoggedIn) {
        // Se tenta acessar o painel e não está logado, vai para o login.
        // Opcionalmente podemos passar callbackUrl mas vamos manter simples.
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Para todo o resto, permite a requisição seguir normalmente.
    return NextResponse.next();
}

// Configura o matcher (em quais rotas o middleware vai rodar)
// Excluímos rotas de sistema, static files, e imagens
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
