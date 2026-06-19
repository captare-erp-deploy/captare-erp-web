'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

interface KPICard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const kpiCards: KPICard[] = [
  {
    title: 'Vendas do Dia',
    value: 'R$ 5.420,00',
    subtitle: '12 pedidos',
    icon: <ShoppingCart size={24} />,
    color: 'bg-green-50 border-green-200',
    trend: '+12%',
  },
  {
    title: 'Estoque Crítico',
    value: '8 produtos',
    subtitle: 'Reposição necessária',
    icon: <AlertTriangle size={24} />,
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    title: 'A Receber',
    value: 'R$ 12.500,00',
    subtitle: '3 vencidas',
    icon: <DollarSign size={24} />,
    color: 'bg-red-50 border-red-200',
  },
  {
    title: 'A Pagar',
    value: 'R$ 8.300,00',
    subtitle: '1 vencida',
    icon: <Package size={24} />,
    color: 'bg-blue-50 border-blue-200',
  },
];

const recentTransactions = [
  {
    id: 1,
    type: 'Pedido',
    description: 'Pedido #001234 - João Silva',
    amount: 'R$ 1.250,00',
    status: 'Concluído',
    statusColor: 'bg-green-100 text-green-800',
  },
  {
    id: 2,
    type: 'Recebimento',
    description: 'Recebimento - Maria Santos',
    amount: 'R$ 500,00',
    status: 'Concluído',
    statusColor: 'bg-green-100 text-green-800',
  },
  {
    id: 3,
    type: 'Pagamento',
    description: 'Pagamento - Distribuidora XYZ',
    amount: 'R$ 2.100,00',
    status: 'Pendente',
    statusColor: 'bg-yellow-100 text-yellow-800',
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo de volta! Aqui está um resumo do seu negócio.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-gray-600">{card.icon}</div>
              {card.trend && <span className="text-green-600 text-sm font-semibold">{card.trend}</span>}
            </div>
            <p className="text-gray-600 text-sm font-medium">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            <p className="text-gray-600 text-sm mt-1">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Últimas Transações</h2>
            <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todas
            </a>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600 mt-1">{transaction.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{transaction.amount}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${transaction.statusColor}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              Novo Pedido
            </button>
            <button className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2">
              <Package size={18} />
              Consultar Estoque
            </button>
            <button className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2">
              <Users size={18} />
              Novo Cliente
            </button>
            <button className="w-full bg-gray-200 text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2">
              <DollarSign size={18} />
              Registrar Pagamento
            </button>
          </div>

          {/* Sync Status */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Sincronização:</span> Última atualização há 2 minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
