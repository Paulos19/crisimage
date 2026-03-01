import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verifica a existência do cookie de sessão do NextAuth.
    // Em produção (HTTPS), o cookie ganha o prefixo __Secure-
    const sessionToken =
        request.cookies.get('next-auth.session-token') ||
        request.cookies.get('__Secure-next-auth.session-token');

    const isLoggedIn = !!sessionToken;

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
