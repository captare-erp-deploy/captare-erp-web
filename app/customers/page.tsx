'use client';

import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 98765-4321', city: 'São Paulo', totalOrders: 12, totalSpent: 5420.00, status: 'active' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', phone: '(21) 99876-5432', city: 'Rio de Janeiro', totalOrders: 8, totalSpent: 3200.50, status: 'active' },
  { id: '3', name: 'Pedro Costa', email: 'pedro@email.com', phone: '(31) 97654-3210', city: 'Belo Horizonte', totalOrders: 15, totalSpent: 7850.00, status: 'active' },
  { id: '4', name: 'Ana Oliveira', email: 'ana@email.com', phone: '(41) 98765-4321', city: 'Curitiba', totalOrders: 3, totalSpent: 890.00, status: 'inactive' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gerencie seus clientes e relacionamentos</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total de Clientes</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{customers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Ativos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{customers.filter((c) => c.status === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Gasto</p>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ {(totalSpent / 1000).toFixed(1)}k</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>{customer.city}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-xs">Pedidos</p>
                <p className="text-lg font-bold text-gray-900">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Total Gasto</p>
                <p className="text-lg font-bold text-green-600">R$ {customer.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
}
