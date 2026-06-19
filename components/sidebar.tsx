'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Package, Users, CreditCard, Truck, Settings, LogOut, Menu, X, MessageSquare } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/' },
    { icon: Truck, label: 'Vendas', href: '/sales' },
    { icon: Package, label: 'Estoque', href: '/inventory' },
    { icon: Users, label: 'Clientes', href: '/customers' },
    { icon: CreditCard, label: 'Financeiro', href: '/financial' },
    { icon: Truck, label: 'AtvMob Logística', href: '/atv-mob' },
    { icon: MessageSquare, label: 'WhatsApp Bot', href: '/whatsapp' },
    { icon: Settings, label: 'Configurações', href: '/settings' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <Menu size={24} />
      </button>

      <div className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Captare ERP</h1>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors mt-8">
            <LogOut size={20} />
            Sair
          </button>
        </nav>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
}
