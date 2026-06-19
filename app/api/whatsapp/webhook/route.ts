import { NextRequest, NextResponse } from 'next/server';
import { processWhatsAppMessage } from '@/server/_core/whatsapp-bot-ai';

// Webhook para receber mensagens do WhatsApp Business API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar estrutura da mensagem
    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json({ success: true });
    }

    const message = body.messages[0];
    const { from, text } = message;

    if (!from || !text) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Processar mensagem com IA
    const response = await processWhatsAppMessage(from, text.body);

    // Aqui você enviaria a resposta via WhatsApp Business API
    console.log(`[WhatsApp] Resposta para ${from}: ${response}`);

    return NextResponse.json({
      success: true,
      from,
      response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('[WhatsApp Webhook] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}

// Verificar webhook (requerido pelo WhatsApp)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'captare_erp_webhook_token';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json(
    { error: 'Token de verificação inválido' },
    { status: 403 }
  );
}
