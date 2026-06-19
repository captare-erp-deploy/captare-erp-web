// Bot WhatsApp com IA para atender clientes
// Integra com LLM para respostas conversacionais

import { firebirdClient } from './firebird-client';

interface WhatsAppMessage {
  from: string;
  to: string;
  message: string;
  timestamp: Date;
}

interface ConversationContext {
  customerId: string;
  customerPhone: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  lastUpdate: Date;
}

// Armazenar contexto de conversas
const conversationContexts = new Map<string, ConversationContext>();

// Prompts do sistema para a IA
const SYSTEM_PROMPTS = {
  delivery: `Você é um assistente de atendimento ao cliente especializado em entregas. 
Você ajuda clientes a rastrear pedidos, responder perguntas sobre entregas e fornecer suporte.
Seja amigável, profissional e sempre ofereça soluções.
Se o cliente perguntar sobre um pedido, tente ajudar com informações sobre status, ETA e motorista.`,

  support: `Você é um assistente de suporte ao cliente da empresa de logística.
Responda perguntas sobre políticas de entrega, horários, cobertura geográfica e outras dúvidas.
Seja conciso e direto nas respostas.`,

  sales: `Você é um assistente de vendas que ajuda clientes a fazer pedidos e consultar produtos.
Seja persuasivo mas honesto sobre os produtos e serviços.`,
};

// Classificar tipo de mensagem
function classifyMessage(message: string): 'delivery' | 'support' | 'sales' {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('rastrear') || lowerMsg.includes('entrega') || lowerMsg.includes('pedido') || lowerMsg.includes('onde')) {
    return 'delivery';
  }
  if (lowerMsg.includes('como') || lowerMsg.includes('quando') || lowerMsg.includes('horário') || lowerMsg.includes('cobertura')) {
    return 'support';
  }
  if (lowerMsg.includes('comprar') || lowerMsg.includes('preço') || lowerMsg.includes('produto')) {
    return 'sales';
  }

  return 'support';
}

// Extrair informações da mensagem
async function extractDeliveryInfo(message: string, customerPhone: string) {
  // Tentar extrair número do pedido
  const pedidoMatch = message.match(/PED-\d+|#\d+/);
  const pedidoId = pedidoMatch ? pedidoMatch[0] : null;

  return { pedidoId, customerPhone };
}

// Buscar informações de entrega no Firebird
async function getDeliveryInfo(pedidoId: string) {
  try {
    // Aqui você consultaria o Firebird
    // const delivery = await firebirdClient.getDeliveries({ id: pedidoId });
    
    // Retornar dados simulados
    return {
      id: pedidoId,
      status: 'in_transit',
      driverName: 'Carlos Silva',
      eta: '14:30',
      distance: '2.5 km',
      address: 'Rua A, 123 - São Paulo, SP',
    };
  } catch (error) {
    console.error('[WhatsApp Bot] Erro ao buscar entrega:', error);
    return null;
  }
}

// Gerar resposta com IA
async function generateAIResponse(
  userMessage: string,
  context: ConversationContext,
  messageType: 'delivery' | 'support' | 'sales'
): Promise<string> {
  try {
    // Aqui você integraria com LLM (Claude, GPT-4, etc)
    // const response = await llm.generateText({
    //   system: SYSTEM_PROMPTS[messageType],
    //   messages: context.messages,
    //   userMessage,
    // });

    // Respostas pré-definidas para demonstração
    const responses: Record<string, string> = {
      delivery: `Ótimo! Vou ajudar você a rastrear sua entrega. 📍\n\nSeu pedido está em trânsito!\n🚗 Motorista: Carlos Silva\n⏰ Previsão: 14:30\n📍 Distância: 2.5 km\n\nVocê pode acompanhar em tempo real no nosso app ou aqui no WhatsApp.`,
      
      support: `Claro! Estou aqui para ajudar. 😊\n\nNossos horários de atendimento são:\n📞 Segunda a Sexta: 8h às 18h\n📞 Sábado: 9h às 14h\n\nTem mais alguma dúvida?`,
      
      sales: `Ótimo! Temos várias opções de entrega. 🚚\n\nQual tipo de produto você gostaria de enviar?\n- Pequeno (até 5kg)\n- Médio (5-20kg)\n- Grande (acima de 20kg)\n\nMe diga e vou calcular o melhor preço!`,
    };

    return responses[messageType] || `Entendi sua mensagem! Como posso ajudar? 😊`;
  } catch (error) {
    console.error('[WhatsApp Bot] Erro ao gerar resposta:', error);
    return 'Desculpe, tive um problema. Tente novamente ou fale com um atendente.';
  }
}

// Processar mensagem do WhatsApp
export async function processWhatsAppMessage(
  from: string,
  message: string
): Promise<string> {
  try {
    console.log(`[WhatsApp Bot] Mensagem de ${from}: ${message}`);

    // Obter ou criar contexto de conversa
    let context = conversationContexts.get(from);
    if (!context) {
      context = {
        customerId: from,
        customerPhone: from,
        messages: [],
        lastUpdate: new Date(),
      };
    }

    // Classificar mensagem
    const messageType = classifyMessage(message);
    console.log(`[WhatsApp Bot] Tipo: ${messageType}`);

    // Adicionar mensagem do usuário ao contexto
    context.messages.push({ role: 'user', content: message });

    // Gerar resposta com IA
    const response = await generateAIResponse(message, context, messageType);

    // Adicionar resposta ao contexto
    context.messages.push({ role: 'assistant', content: response });

    // Atualizar contexto
    context.lastUpdate = new Date();
    conversationContexts.set(from, context);

    // Registrar no Firebird
    if (messageType === 'delivery') {
      const deliveryInfo = await extractDeliveryInfo(message, from);
      if (deliveryInfo.pedidoId) {
        await firebirdClient.logNotification(
          deliveryInfo.pedidoId,
          from,
          'whatsapp',
          'sent'
        );
      }
    }

    return response;
  } catch (error) {
    console.error('[WhatsApp Bot] Erro ao processar mensagem:', error);
    return 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.';
  }
}

// Limpar contextos antigos (mais de 24h)
export function cleanupOldContexts(): number {
  let cleaned = 0;
  const now = new Date();
  const maxAge = 24 * 60 * 60 * 1000; // 24 horas

  for (const [key, context] of conversationContexts.entries()) {
    if (now.getTime() - context.lastUpdate.getTime() > maxAge) {
      conversationContexts.delete(key);
      cleaned++;
    }
  }

  console.log(`[WhatsApp Bot] Limpeza: ${cleaned} contextos removidos`);
  return cleaned;
}

// Obter histórico de conversa
export function getConversationHistory(customerPhone: string): ConversationContext | null {
  return conversationContexts.get(customerPhone) || null;
}

// Exportar tipos
export type { WhatsAppMessage, ConversationContext };
