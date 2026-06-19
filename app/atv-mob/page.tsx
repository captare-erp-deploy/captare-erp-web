'use client';

import { useState } from 'react';
import { MapPin, Truck, Users, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function AtvMobPage() {
  const [activeTab, setActiveTab] = useState('operations');

  const kpis = [
    { label: 'Em Trânsito', value: 12, color: 'bg-blue-500' },
    { label: 'Entregues Hoje', value: 45, color: 'bg-green-500' },
    { label: 'Motoristas Ativos', value: 8, color: 'bg-purple-500' },
    { label: 'Pendentes', value: 5, color: 'bg-orange-500' },
  ];

  const deliveries = [
    { id: 1, customer: 'Cliente A', address: 'Rua 1, 100', status: 'Em Trânsito', driver: 'João Silva', eta: '14:30', distance: '2.5 km' },
    { id: 2, customer: 'Cliente B', address: 'Rua 2, 200', status: 'Pendente', driver: 'Maria Santos', eta: '15:00', distance: '5.2 km' },
    { id: 3, customer: 'Cliente C', address: 'Rua 3, 300', status: 'Entregue', driver: 'Pedro Costa', eta: '13:45', distance: '1.8 km' },
  ];

  const drivers = [
    { id: 1, name: 'João Silva', status: 'Disponível', vehicle: 'Fiat Uno', rating: 4.8, deliveries: 45 },
    { id: 2, name: 'Maria Santos', status: 'Ocupado', vehicle: 'Fiat Fiorino', rating: 4.9, deliveries: 52 },
    { id: 3, name: 'Pedro Costa', status: 'Offline', vehicle: 'Volkswagen Up', rating: 4.6, deliveries: 38 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AtvMob Inteligência Logística</h1>
        <p className="text-gray-600">Gestão completa de entregas, rotas e motoristas em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className={`${kpi.color} w-12 h-12 rounded-lg mb-4 flex items-center justify-center`}>
              <BarChart3 className="text-white" size={24} />
            </div>
            <p className="text-gray-600 text-sm mb-2">{kpi.label}</p>
            <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('operations')}
          className={`px-4 py-3 font-medium ${activeTab === 'operations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          <MapPin className="inline mr-2" size={18} />
          Operações
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-3 font-medium ${activeTab === 'drivers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          <Users className="inline mr-2" size={18} />
          Motoristas
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-3 font-medium ${activeTab === 'reports' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          <BarChart3 className="inline mr-2" size={18} />
          Relatórios
        </button>
      </div>

      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MapPin className="mr-2 text-blue-500" />
              Rastreamento em Tempo Real
            </h2>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Mapa com localização dos motoristas (integração com Google Maps)</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Entregas Ativas</h2>
            <div className="space-y-3">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">{delivery.customer}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      delivery.status === 'Em Trânsito' ? 'bg-blue-100 text-blue-700' :
                      delivery.status === 'Entregue' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{delivery.address}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{delivery.driver}</span>
                    <span>ETA: {delivery.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Motorista</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Veículo</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Avaliação</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Entregas</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{driver.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      driver.status === 'Disponível' ? 'bg-green-100 text-green-700' :
                      driver.status === 'Ocupado' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{driver.vehicle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">⭐ {driver.rating}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{driver.deliveries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Produtividade da Equipe</h2>
            <div className="space-y-3">
              {drivers.map((driver) => (
                <div key={driver.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{driver.name}</span>
                    <span className="text-sm text-gray-600">{driver.deliveries} entregas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(driver.deliveries / 52) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Resumo do Dia</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <span className="text-sm text-gray-700">Entregas Concluídas</span>
                </div>
                <span className="font-bold text-green-600">45</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Truck className="text-blue-500 mr-3" size={20} />
                  <span className="text-sm text-gray-700">Em Trânsito</span>
                </div>
                <span className="font-bold text-blue-600">12</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="text-orange-500 mr-3" size={20} />
                  <span className="text-sm text-gray-700">Pendentes</span>
                </div>
                <span className="font-bold text-orange-600">5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
