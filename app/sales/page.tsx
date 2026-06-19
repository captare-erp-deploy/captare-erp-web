'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit2, Trash2, TrendingUp } from 'lucide-react';

interface Order {
  id: string;
  number: string;
  client: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

const mockOrders: Order[] = [
  { id: '1', number: '#001234', client: 'João Silva', date: '2026-06-18', total: 1250.00, status: 'confirmed', items: 3 },
  { id: '2', number: '#001233', client: 'Maria Santos', date: '2026-06-17', total: 890.50, status: 'delivered', items: 2 },
  { id: '3', number: '#001232', client: 'Pedro Costa', date: '2026-06-16', total: 2150.00, status: 'pending', items: 5 },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) || order.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600 mt-2">Gerencie seus pedidos e vendas</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          Novo Pedido
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total de Pedidos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{filteredOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Valor Total</p>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ {filteredOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pendentes</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{filteredOrders.filter((o) => o.status === 'pending').length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar por número ou cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">Todos os Status</option>
          <option value="pending">Pendente</option>
          <option value="confirmed">Confirmado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pedido</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Itens</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.number}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">R$ {order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span></td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && <div className="px-6 py-12 text-center"><p className="text-gray-500">Nenhum pedido encontrado</p></div>}
      </div>
    </div>
  );
}
