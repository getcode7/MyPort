import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (em produção, use Redis)
const rateLimit = new Map<string, { count: number; startTime: number }>();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Bloquear IPs maliciosos (adicione conforme necessidade)
  const blockedIps = ['1.2.3.4'];
  const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  if (blockedIps.includes(clientIp)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Rate limiting
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuto
  const maxRequests = 60; // 60 requisições por minuto
  
  const record = rateLimit.get(clientIp);
  
  if (record) {
    if (now - record.startTime < windowMs) {
      if (record.count > maxRequests) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
      rateLimit.set(clientIp, { count: record.count + 1, startTime: record.startTime });
    } else {
      rateLimit.set(clientIp, { count: 1, startTime: now });
    }
  } else {
    rateLimit.set(clientIp, { count: 1, startTime: now });
  }
  
  // Adicionar headers de segurança adicionais
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};