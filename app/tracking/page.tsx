'use client';

import { useState, useEffect } from 'react';
import { MapPin, Truck, Phone, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function TrackingPage() {
  const [delivery, setDelivery] = useState({
    id: 'PED-2024-001',
    status: 'in_transit',
    customerName: 'João Silva',
    address: 'Rua A, 123 - São Paulo, SP',
    driverName: 'Carlos Silva',
    driverPhone: '(11) 98765-4321',
    driverRating: 4.8,
    vehicle: 'Fiat Uno Branco - ABC-1234',
    eta: '14:30',
    distance: '2.5 km',
    lastUpdate: new Date(),
    notifications: [
      { time: '13:45', message: '✅ Entrega despachada', status: 'completed' },
      { time: '14:00', message: '📍 Em trânsito', status: 'completed' },
      { time: '14:15', message: '⏰ Chegando em 15 minutos', status: 'active' },
    ],
  });

  const statusColors = {
    dispatched: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-yellow-100 text-yellow-800',
    arriving: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    dispatched: '🚗 Despachada',
    in_transit: '📍 Em Trânsito',
    arriving: '⏰ Chegando',
    delivered: '✅ Entregue',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rastreie sua Entrega</h1>
          <p className="text-gray-600">Pedido: {delivery.id}</p>
        </div>

        {/* Status Principal */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600 text-sm mb-2">Status da Entrega</p>
              <span className={`px-4 py-2 rounded-full font-semibold text-sm ${statusColors[delivery.status]}`}>
                {statusLabels[delivery.status]}
              </span>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm mb-2">Previsão de Chegada</p>
              <p className="text-3xl font-bold text-blue-600">{delivery.eta}</p>
            </div>
          </div>

          {/* Mapa Simulado */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-12 text-center mb-6">
            <MapPin className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-700 text-lg mb-2">Mapa em Tempo Real</p>
            <p className="text-gray-600 text-sm">Distância: {delivery.distance}</p>
          </div>

          {/* Endereço */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Entregando em:</p>
            <p className="text-lg font-semibold text-gray-900">{delivery.address}</p>
          </div>
        </div>

        {/* Informações do Motorista */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Seu Motorista</h2>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-2">{delivery.driverName}</p>
              <p className="text-gray-600 mb-3">{delivery.vehicle}</p>
              <div className="flex items-center gap-4">
                <a
                  href={`tel:${delivery.driverPhone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone size={18} />
                  Ligar
                </a>
                <a
                  href={`https://wa.me/55${delivery.driverPhone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Avaliação</p>
              <p className="text-2xl font-bold text-yellow-500">⭐ {delivery.driverRating}</p>
            </div>
          </div>
        </div>

        {/* Timeline de Notificações */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Histórico de Atualizações</h2>
          <div className="space-y-4">
            {delivery.notifications.map((notif, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {notif.status === 'completed' ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Clock className="text-blue-600" size={20} />
                    )}
                  </div>
                  {idx < delivery.notifications.length - 1 && (
                    <div className="w-1 h-12 bg-gray-200 mt-2"></div>
                  )}
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-600">{notif.time}</p>
                  <p className="text-gray-900 font-medium">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dúvidas */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6 border border-blue-200">
          <p className="text-gray-700 mb-3">
            💬 Tem dúvidas sobre sua entrega? Converse com nosso assistente de IA no WhatsApp!
          </p>
          <a
            href="https://wa.me/5511987654321"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle size={20} />
            Abrir WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
