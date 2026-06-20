/**
 * API Route: /api/sync/firebird
 * 
 * Sincroniza dados do CaptarePro (Firebird) com o Captare ERP
 */

import { NextRequest, NextResponse } from 'next/server';
import { createFirebirdConnection } from '@/server/integrations/firebird';

/**
 * GET /api/sync/firebird
 * Retorna status da sincronização
 */
export async function GET(request: NextRequest) {
  try {
    const fb = createFirebirdConnection();
    
    // Testar conexão
    await fb.connect();
    await fb.disconnect();

    return NextResponse.json({
      success: true,
      message: 'Conexão com Firebird estabelecida com sucesso',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Erro ao conectar ao Firebird: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sync/firebird
 * Inicia sincronização de dados
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = 'all' } = body;

    const fb = createFirebirdConnection();
    let result;

    switch (type) {
      case 'clientes':
        result = await fb.syncClientes();
        break;
      case 'produtos':
        result = await fb.syncProdutos();
        break;
      case 'pedidos':
        result = await fb.syncPedidos();
        break;
      case 'estoque':
        result = await fb.syncEstoque();
        break;
      case 'financeiro':
        result = await fb.syncFinanceiro();
        break;
      case 'all':
      default:
        result = await fb.syncAll();
    }

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: `Erro na sincronização: ${error.message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
