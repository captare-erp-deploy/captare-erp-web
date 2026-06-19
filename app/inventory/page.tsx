'use client';

import React, { useState } from 'react';
import { Search, Plus, AlertTriangle, Package } from 'lucide-react';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: 'available' | 'critical' | 'out_of_stock';
}

const mockProducts: Product[] = [
  { id: '1', code: 'PROD001', name: 'Produto A', category: 'Eletrônicos', stock: 150, minStock: 50, price: 299.90, status: 'available' },
  { id: '2', code: 'PROD002', name: 'Produto B', category: 'Eletrônicos', stock: 8, minStock: 50, price: 149.90, status: 'critical' },
  { id: '3', code: 'PROD003', name: 'Produto C', category: 'Acessórios', stock: 0, minStock: 20, price: 49.90, status: 'out_of_stock' },
  { id: '4', code: 'PROD004', name: 'Produto D', category: 'Acessórios', stock: 250, minStock: 100, price: 79.90, status: 'available' },
];

const statusColors = { available: 'bg-green-100 text-green-800', critical: 'bg-yellow-100 text-yellow-800', out_of_stock: 'bg-red-100 text-red-800' };
const statusLabels = { available: 'Disponível', critical: 'Crítico', out_of_stock: 'Fora de Estoque' };

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.code.toLowerCase().includes(searchTerm.toLowerCase()) || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const criticalProducts = products.filter((p) => p.status === 'critical' || p.status === 'out_of_stock');
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-600 mt-2">Gerencie seus produtos e movimentações</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total de Produtos</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Valor Total</p>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ {(totalValue / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Produtos Críticos</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{criticalProducts.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Categorias</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{categories.length - 1}</p>
        </div>
      </div>

      {/* Critical Alert */}
      {criticalProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 mb-6">
          <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
          <div>
            <p className="font-semibold text-yellow-900">Atenção: {criticalProducts.length} produtos com estoque crítico</p>
            <p className="text-sm text-yellow-700">Reposição necessária</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar por código ou nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Todas as Categorias' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Produto</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoria</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estoque</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mín.</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.code}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.minStock}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">R$ {product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>{statusLabels[product.status]}</span></td>
                <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:text-blue-900">Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
