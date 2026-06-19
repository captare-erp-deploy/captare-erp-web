import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/server/_core/auth';
import { validateInput, sanitizeInput, rateLimit, logAudit, setupSecurityHeaders } from '@/server/_core/security';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || 'unknown';
    if (!rateLimit(ip, 10, 900000)) { // 10 tentativas por 15 minutos
      const response = NextResponse.json(
        { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
        { status: 429 }
      );
      return setupSecurityHeaders(response);
    }

    const body = await request.json();

    // Validar entrada
    const validation = validateInput(body, {
      email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, type: 'string', minLength: 6 },
    });

    if (!validation.valid) {
      logAudit('unknown', 'login', 'auth', 'failure', request, { errors: validation.errors });
      const response = NextResponse.json(
        { error: 'Dados inválidos', details: validation.errors },
        { status: 400 }
      );
      return setupSecurityHeaders(response);
    }

    // Sanitizar entrada
    const email = sanitizeInput(body.email);
    const password = body.password; // Não sanitizar senha

    // Autenticar usuário
    const result = await authenticateUser(email, password);

    if (!result) {
      logAudit('unknown', 'login', 'auth', 'failure', request, { email });
      const response = NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      );
      return setupSecurityHeaders(response);
    }

    // Login bem-sucedido
    logAudit(result.user.id, 'login', 'auth', 'success', request, { email: result.user.email });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        tokens: result.tokens,
      },
      { status: 200 }
    );

    // Adicionar token ao cookie (httpOnly)
    response.cookies.set('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: result.tokens.expiresIn,
    });

    response.cookies.set('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 dias
    });

    return setupSecurityHeaders(response);
  } catch (error) {
    console.error('[Auth Login] Erro:', error);
    const response = NextResponse.json(
      { error: 'Erro ao processar login' },
      { status: 500 }
    );
    return setupSecurityHeaders(response);
  }
}
