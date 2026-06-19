import { NextRequest, NextResponse } from 'next/server';

// Simular banco de dados de notificações
const notificationsDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deliveryId, status, driverName, eta, distance, customerId, customerPhone, customerEmail } = body;

    // Validar dados
    if (!deliveryId || !status || !customerId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Criar notificação
    const notification = {
      id: `notif-${Date.now()}`,
      deliveryId,
      customerId,
      status,
      driverName,
      eta,
      distance,
      customerPhone,
      customerEmail,
      timestamp: new Date(),
      channels: {
        whatsapp: { sent: true, timestamp: new Date() },
        email: { sent: true, timestamp: new Date() },
        push: { sent: false, reason: 'Sem app instalado' },
      },
    };

    // Salvar notificação
    notificationsDB.push(notification);

    // Aqui você integraria com os serviços reais de notificação
    console.log('[API] Notificação criada:', notification);

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notificações disparadas com sucesso',
    });
  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar notificação' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deliveryId = searchParams.get('deliveryId');
    const customerId = searchParams.get('customerId');

    let results = notificationsDB;

    if (deliveryId) {
      results = results.filter(n => n.deliveryId === deliveryId);
    }

    if (customerId) {
      results = results.filter(n => n.customerId === customerId);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      notifications: results.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar notificações' },
      { status: 500 }
    );
  }
}
