import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './server/_core/auth';
import { setupSecurityHeaders } from './server/_core/security';

// Rotas públicas (sem autenticação)
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/refresh', '/tracking'];

// Rotas protegidas
const protectedRoutes = ['/sales', '/inventory', '/customers', '/financial', '/atv-mob', '/whatsapp', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é rota pública
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.next();
    return setupSecurityHeaders(response);
  }

  // Verificar se é rota protegida
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar token
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Adicionar informações do usuário ao header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return setupSecurityHeaders(response);
  }

  const response = NextResponse.next();
  return setupSecurityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
