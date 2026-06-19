// Sistema de Autenticação JWT com Firebird

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'operator' | 'driver';
  permissions: string[];
  createdAt: Date;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'captare-erp-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'captare-erp-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = 3600; // 1 hora
const REFRESH_TOKEN_EXPIRY = 604800; // 7 dias

// Hash de senha
export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, process.env.PASSWORD_SALT || 'captare-salt', 1000, 64, 'sha512')
    .toString('hex');
}

// Verificar senha
export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
}

// Gerar tokens JWT
export function generateTokens(user: User): AuthToken {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
}

// Verificar token de acesso
export function verifyAccessToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    console.error('[Auth] Token inválido:', error);
    return null;
  }
}

// Verificar token de refresh
export function verifyRefreshToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    console.error('[Auth] Refresh token inválido:', error);
    return null;
  }
}

// Autenticar usuário (com Firebird)
export async function authenticateUser(email: string, password: string): Promise<{ user: User; tokens: AuthToken } | null> {
  try {
    // Aqui você consultaria o Firebird
    // const user = await firebirdClient.getUserByEmail(email);
    
    // Usuário de demonstração
    if (email === 'admin@captare.com' && password === 'admin123') {
      const user: User = {
        id: 'user-1',
        email: 'admin@captare.com',
        name: 'Administrador',
        role: 'admin',
        permissions: ['*'],
        createdAt: new Date(),
      };

      const tokens = generateTokens(user);
      return { user, tokens };
    }

    return null;
  } catch (error) {
    console.error('[Auth] Erro ao autenticar:', error);
    return null;
  }
}

// Verificar permissão
export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    manager: ['read', 'write', 'delete', 'export'],
    operator: ['read', 'write'],
    driver: ['read'],
  };

  const permissions = rolePermissions[userRole] || [];
  return permissions.includes('*') || permissions.includes(requiredPermission);
}

// Middleware de autenticação
export function authMiddleware(token: string | undefined): AuthPayload | null {
  if (!token) {
    console.error('[Auth] Token não fornecido');
    return null;
  }

  // Remover "Bearer " se presente
  const cleanToken = token.replace('Bearer ', '');
  return verifyAccessToken(cleanToken);
}

// Gerar token de recuperação de senha
export function generatePasswordResetToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'password_reset' },
    JWT_SECRET,
    { expiresIn: 3600 } // 1 hora
  );
}

// Verificar token de recuperação
export function verifyPasswordResetToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type === 'password_reset') {
      return { userId: decoded.userId };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Gerar token de verificação de email
export function generateEmailVerificationToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'email_verification' },
    JWT_SECRET,
    { expiresIn: 86400 } // 24 horas
  );
}

// Verificar token de email
export function verifyEmailToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.type === 'email_verification') {
      return { userId: decoded.userId };
    }
    return null;
  } catch (error) {
    return null;
  }
}
