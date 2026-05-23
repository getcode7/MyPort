import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting simples
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export async function POST(request: Request) {
  try {
    // Obter IP do cliente
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'anonymous';
    
    // Rate limiting
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hora
    const maxRequests = 3; // 3 emails por hora
    
    const record = rateLimit.get(ip);
    if (record && now - record.timestamp < windowMs) {
      if (record.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      rateLimit.set(ip, { count: record.count + 1, timestamp: record.timestamp });
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }
    
    // Obter dados do formulário
    const { name, email, message } = await request.json();
    
    // Validação
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Sanitização básica
    const sanitizedName = name.replace(/[<>]/g, '');
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedMessage = message.replace(/[<>]/g, '');
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Aqui você enviaria o email
    console.log('Form submission:', { sanitizedName, sanitizedEmail, sanitizedMessage });
    
    // Simular envio de email
    // await sendEmail({ name: sanitizedName, email: sanitizedEmail, message: sanitizedMessage });
    
    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}