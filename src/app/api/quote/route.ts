// src/app/api/quote/route.ts
import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL; // variável de ambiente (no servidor)

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Opcional: validar body.name, body.email, etc.

    // Encaminhar para o n8n (se quiser manter a automação)
    const n8nResponse = await fetch(N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await n8nResponse.json();

    return NextResponse.json({ estimatedBudget: data.estimatedBudget });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}