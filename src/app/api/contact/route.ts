import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ============================================
// CONFIGURAÇÃO DO TRANSPORTER
// ============================================

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com', // Outlook/Office 365
  port: 587,
  secure: false, // true para porta 465, false para 587
  auth: {
    user: process.env.CONTACT_EMAIL,    
    pass: process.env.CONTACT_EMAIL_SECRET,
  },
});

// ============================================
// HANDLER DA ROTA POST
// ============================================

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validação básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    // Verificar se o transporter está configurado
    if (!process.env.CONTACT_EMAIL || !process.env.CONTACT_EMAIL_SECRET) {
      console.error('❌ Variáveis de email não configuradas');
      return NextResponse.json(
        { error: 'Erro de configuração do servidor.' },
        { status: 500 }
      );
    }

    // Enviar email
    const info = await transporter.sendMail({
      from: `"${name}" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Novo contato do portfólio: ${name}`,
      text: `
Nome: ${name}
Email: ${email}
Mensagem:
${message}
      `,
      html: `
        <h2>Novo contato do portfólio</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('✅ Email enviado:', info.messageId);

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