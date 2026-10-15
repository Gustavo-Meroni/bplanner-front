import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_TOKEN = 'bplanner-token';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  const { pathname, searchParams } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/registrar');

  // Sem sessão tentando acessar área logada → login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Com sessão na tela de login/cadastro → painel (ou de volta ao convite, se veio de um)
  if (token && isAuthPage) {
    const convite = searchParams.get('convite');
    const destino = convite ? `/convite/${encodeURIComponent(convite)}` : '/dashboard';
    return NextResponse.redirect(new URL(destino, request.url));
  }

  return NextResponse.next();
}

// /convite/[codigo] fica de fora: é pública
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/gestao/:path*',
    '/onboarding/:path*',
    '/login',
    '/registrar',
  ],
};
