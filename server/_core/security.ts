// Middleware de Segurança

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Rate Limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (limit.count >= maxRequests) {
    return false;
  }

  limit.count++;
  return true;
}

// Validação de entrada
export function validateInput(data: any, schema: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && !value) {
      errors.push(`${field} é obrigatório`);
      continue;
    }

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} deve ser do tipo ${rules.type}`);
    }

    if (rules.minLength && value?.length < rules.minLength) {
      errors.push(`${field} deve ter no mínimo ${rules.minLength} caracteres`);
    }

    if (rules.maxLength && value?.length > rules.maxLength) {
      errors.push(`${field} deve ter no máximo ${rules.maxLength} caracteres`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} tem formato inválido`);
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} deve ser um dos valores: ${rules.enum.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// Sanitizar entrada (prevenir XSS)
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Gerar CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verificar CSRF token
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken));
}

// Configurar CORS
export function setupCORS(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL || 'https://captare-erp.example.com',
  ];

  const isAllowed = !origin || allowedOrigins.includes(origin);

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

// Headers de segurança
export function setupSecurityHeaders(response: NextResponse): NextResponse {
  // Prevenir clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevenir MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Habilitar XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  );

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // HSTS (HTTPS Strict Transport Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

// Logs de auditoria
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  details?: any;
}

const auditLogs: AuditLog[] = [];

export function logAudit(
  userId: string,
  action: string,
  resource: string,
  status: 'success' | 'failure',
  request: NextRequest,
  details?: any
): void {
  const log: AuditLog = {
    id: `audit-${Date.now()}`,
    userId,
    action,
    resource,
    timestamp: new Date(),
    ipAddress: request.ip || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    status,
    details,
  };

  auditLogs.push(log);
  console.log(`[Audit] ${action} ${resource} - ${status}`, log);

  // Aqui você salvaria no Firebird
  // await firebirdClient.logAudit(log);
}

// Obter logs de auditoria
export function getAuditLogs(filters?: { userId?: string; action?: string; status?: string }): AuditLog[] {
  let results = auditLogs;

  if (filters?.userId) {
    results = results.filter(log => log.userId === filters.userId);
  }

  if (filters?.action) {
    results = results.filter(log => log.action === filters.action);
  }

  if (filters?.status) {
    results = results.filter(log => log.status === filters.status);
  }

  return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Validação de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de telefone
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Criptografar dados sensíveis
export function encryptData(data: string, key: string = process.env.ENCRYPTION_KEY || 'default-key'): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0')), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Descriptografar dados
export function decryptData(encryptedData: string, key: string = process.env.ENCRYPTION_KEY || 'default-key'): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key.padEnd(32, '0')), iv);
  let decrypted = decipher.update(parts[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
