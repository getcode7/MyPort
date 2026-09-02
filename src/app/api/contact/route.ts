import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ============================================
// CONFIGURAÇÃO DO TRANSPORTER
// ============================================

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.CONTACT_EMAIL,
    pass: process.env.CONTACT_EMAIL_SECRET,
  },
});

// ============================================
// RATE LIMITING (simples)
// ============================================

const rateLimit = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hora
  const maxRequests = 5;

  const record = rateLimit.get(ip);
  if (record) {
    if (now - record.timestamp < windowMs) {
      if (record.count >= maxRequests) {
        return true;
      }
      record.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }
  } else {
    rateLimit.set(ip, { count: 1, timestamp: now });
  }
  return false;
}

// ============================================
// VALIDAÇÃO DE EMAIL
// ============================================

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================
// HANDLER DA ROTA POST
// ============================================

export async function POST(request: Request) {
  try {
    // 1. Obter IP do cliente
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';

    // 2. Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiados pedidos. Tente novamente mais tarde.' },
        { status: 429 }
      );
    }

    // 3. Parsing do body
    const { name, email, message } = await request.json();

    // 4. Sanitização básica
    const sanitizedName = name?.trim().replace(/[<>]/g, '') || '';
    const sanitizedEmail = email?.trim().toLowerCase() || '';
    const sanitizedMessage = message?.trim().replace(/[<>]/g, '') || '';

    // 5. Validações
    if (!sanitizedName || sanitizedName.length < 2) {
      return NextResponse.json(
        { error: 'Nome deve ter pelo menos 2 caracteres.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Email inválido.' },
        { status: 400 }
      );
    }

    if (!sanitizedMessage || sanitizedMessage.length < 10) {
      return NextResponse.json(
        { error: 'Mensagem deve ter pelo menos 10 caracteres.' },
        { status: 400 }
      );
    }

    // 6. Verificar variáveis de ambiente
    if (!process.env.CONTACT_EMAIL || !process.env.CONTACT_EMAIL_SECRET) {
      console.error('❌ Variáveis de email não configuradas');
      return NextResponse.json(
        { error: 'Erro de configuração do servidor.' },
        { status: 500 }
      );
    }

    // 7. Enviar email
    const info = await transporter.sendMail({
      from: `"${sanitizedName}" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Novo contato do portfólio: ${sanitizedName}`,
      text: `
Nome: ${sanitizedName}
Email: ${sanitizedEmail}
Mensagem:
${sanitizedMessage}
      `,
      html: `
        <h2>📬 Novo contato do portfólio</h2>
        <p><strong>Nome:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Enviado via MyPort</p>
      `,
    });

    console.log(`✅ Email enviado para ${process.env.CONTACT_EMAIL} (ID: ${info.messageId})`);

    return NextResponse.json(
      { success: true, message: 'Email enviado com sucesso!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar email. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}