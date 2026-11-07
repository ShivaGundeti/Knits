'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, Order } from '@/types';
import { OrderStore } from '@/utils/store';
import { Navbar } from '@/components/Navbar';
import { OrderBoard } from '@/components/OrderBoard';
import { OrderDetailView } from '@/components/OrderDetailView';
import { SupervisorMobileView } from '@/components/SupervisorMobileView';
import { OrderSetupForm } from '@/components/OrderSetupForm';
import { BuyerPortalView } from '@/components/BuyerPortalView';
import { RunRateModal } from '@/components/RunRateModal';
import { calculateRunRate } from '@/utils/runRate';
import { generateBuyerStatusPdf } from '@/utils/exportPdf';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('merchandiser');
  const [activeView, setActiveView] = useState<string>('board');
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('buyer-uk-b');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);

  // Load orders and offline queue count on mount
  const refreshData = () => {
    const list = OrderStore.getOrders();
    setOrders([...list]);
    const q = OrderStore.getOfflineQueue();
    setOfflineQueueCount(q.length);

    if (selectedOrder) {
      const updated = list.find(o => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // When changing roles, adjust views gracefully
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'supervisor') {
      setActiveView('supervisor-mobile');
    } else if (role === 'buyer') {
      setActiveView('buyer-portal');
    } else {
      setActiveView('board');
    }
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveView('order-detail');
  };

  const handleExportPdf = (buyerFilter?: string) => {
    const targetOrders = buyerFilter 
      ? orders.filter(o => o.buyerId === buyerFilter)
      : orders;
    generateBuyerStatusPdf(targetOrders, buyerFilter === 'buyer-uk-b' ? 'Company B (UK)' : buyerFilter === 'buyer-de-c' ? 'Company C (Germany)' : undefined);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Global Navbar with Role Switcher */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        selectedBuyerId={selectedBuyerId}
        onBuyerChange={setSelectedBuyerId}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          if (view !== 'order-detail') setSelectedOrder(null);
        }}
        offlineCount={offlineQueueCount}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: Order Board (Merchandiser Dashboard) */}
        {activeView === 'board' && (
          <OrderBoard
            orders={orders}
            onSelectOrder={handleSelectOrder}
            onOpenRunRate={(order) => setModalOrder(order)}
            onExportPdf={handleExportPdf}
          />
        )}

        {/* VIEW 2: Order Detail View (AI review, side-by-side Tamil notes, date change audit) */}
        {activeView === 'order-detail' && selectedOrder && (
          <OrderDetailView
            order={selectedOrder}
            onBack={() => {
              setActiveView('board');
              setSelectedOrder(null);
            }}
            onRefresh={refreshData}
            onOpenRunRate={(order) => setModalOrder(order)}
          />
        )}

        {/* VIEW 3: Supervisor Mobile View (Tamil, Offline Queue, Photo) */}
        {activeView === 'supervisor-mobile' && (
          <SupervisorMobileView
            orders={orders}
            onLogSubmitted={() => {
              refreshData();
            }}
          />
        )}

        {/* VIEW 4: New Order Setup Form (TNA milestone generation) */}
        {activeView === 'new-order' && (
          <OrderSetupForm
            onOrderCreated={(newOrder) => {
              refreshData();
              setSelectedOrder(newOrder);
              setActiveView('order-detail');
            }}
            onCancel={() => setActiveView('board')}
          />
        )}

        {/* VIEW 5: Multi-Tenant Buyer Portal (Strict Isolation) */}
        {activeView === 'buyer-portal' && (
          <BuyerPortalView
            orders={orders}
            currentBuyerId={selectedBuyerId}
          />
        )}

      </main>

      {/* Run-Rate Mathematical Transparency Modal */}
      {modalOrder && (
        <RunRateModal
          poNumber={modalOrder.poNumber}
          style={modalOrder.style}
          calculation={calculateRunRate(modalOrder)}
          onClose={() => setModalOrder(null)}
        />
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            <strong>Knits Exporter OS</strong> • Tiruppur Knitwear Production Tracking & Predictive Delay Prevention
          </div>
          <div className="flex items-center gap-4">
            <span>Built for Isocode Engineering Assessment</span>
            <span>•</span>
            <span className="font-mono text-slate-400">Next.js 15 App Router</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
