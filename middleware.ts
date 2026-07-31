import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Pega o token de autenticação dos cookies
    const token = request.cookies.get('bplanner-token')?.value;

    // 2. Descobre para qual rota o usuário está tentando ir
    const pathname = request.nextUrl.pathname;
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/registrar');

    // 3. Se NÃO tem token e está tentando acessar área logada, expulsa pro login
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Se TEM token e está tentando acessar tela de login/registro, joga pro dashboard
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Se estiver tudo certo, deixa passar
    return NextResponse.next();
}

// Configura em quais rotas esse middleware vai agir
export const config = {
    matcher: [
        '/dashboard',
        '/dashboard/:path*',
        '/gestao',
        '/gestao/:path*',
        '/login',
        '/registrar',
    ],
};