'use client';

import React, { useState } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'receivable' | 'payable';
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  partner: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'receivable', description: 'Pedido #001234', amount: 1250.00, dueDate: '2026-06-25', status: 'pending', partner: 'João Silva' },
  { id: '2', type: 'payable', description: 'Fornecedor XYZ', amount: 2100.00, dueDate: '2026-06-20', status: 'overdue', partner: 'Distribuidora XYZ' },
  { id: '3', type: 'receivable', description: 'Pedido #001233', amount: 890.50, dueDate: '2026-06-22', status: 'paid', partner: 'Maria Santos' },
  { id: '4', type: 'payable', description: 'Fornecedor ABC', amount: 3500.00, dueDate: '2026-07-05', status: 'pending', partner: 'Fornecedor ABC' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Pendente',
  paid: 'Pago',
  overdue: 'Vencido',
};

export default function FinancialPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.partner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalReceivable = transactions.filter((t) => t.type === 'receivable').reduce((sum, t) => sum + t.amount, 0);
  const totalPayable = transactions.filter((t) => t.type === 'payable').reduce((sum, t) => sum + t.amount, 0);
  const overdue = transactions.filter((t) => t.status === 'overdue').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-2">Gerencie contas a receber e pagar</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          Novo Lançamento
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">A Receber</p>
              <p className="text-2xl font-bold text-green-600 mt-2">R$ {(totalReceivable / 1000).toFixed(1)}k</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">A Pagar</p>
              <p className="text-2xl font-bold text-red-600 mt-2">R$ {(totalPayable / 1000).toFixed(1)}k</p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Vencidos</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">R$ {(overdue / 1000).toFixed(1)}k</p>
            </div>
            <AlertCircle className="text-orange-600" size={32} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Saldo</p>
          <p className={`text-2xl font-bold mt-2 ${totalReceivable - totalPayable >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {((totalReceivable - totalPayable) / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar por descrição ou parceiro..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">Todos</option>
          <option value="receivable">A Receber</option>
          <option value="payable">A Pagar</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Parceiro</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vencimento</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">
                  <span className={transaction.type === 'receivable' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'receivable' ? 'Receber' : 'Pagar'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{transaction.partner}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(transaction.dueDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">R$ {transaction.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}>
                    {statusLabels[transaction.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-900">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
