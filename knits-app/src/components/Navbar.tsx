'use client';

import React from 'react';
import { UserRole } from '@/types';
import { Shirt, UserCheck, Shield, Eye, Layers } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedBuyerId: string;
  onBuyerChange?: (buyerId: string) => void;
  activeView: string;
  onNavigate: (view: string) => void;
  offlineCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  selectedBuyerId,
  onBuyerChange,
  activeView,
  onNavigate,
  offlineCount = 0
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('board')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">Knits</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  Tiruppur OS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Production tracking & run-rate delay intelligence</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('board')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeView === 'board'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Order Board
            </button>
            
            {currentRole === 'merchandiser' && (
              <button
                onClick={() => onNavigate('new-order')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeView === 'new-order'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                + New Order (TNA)
              </button>
            )}

            <button
              onClick={() => onNavigate('supervisor-mobile')}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeView === 'supervisor-mobile'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Floor Update (Tamil)
              {offlineCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-amber-500 text-white rounded-full font-bold">
                  {offlineCount} queued
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('buyer-portal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeView === 'buyer-portal'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Buyer Portal
            </button>
          </nav>

          {/* Role Switcher (Interview & Reviewer Friendly) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onRoleChange('merchandiser')}
                title="Office Merchandiser (Full control, TNA setup, AI review)"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  currentRole === 'merchandiser'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Merchandiser</span>
              </button>

              <button
                onClick={() => onRoleChange('supervisor')}
                title="Floor Supervisor (Tamil mobile interface, low RAM mode)"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  currentRole === 'supervisor'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Supervisor (தளம்)</span>
              </button>

              <button
                onClick={() => onRoleChange('buyer')}
                title="Buyer Sourcing Staff (Read-only, Tenant Isolated)"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  currentRole === 'buyer'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Buyer View</span>
              </button>
            </div>

            {/* Buyer Tenant Switcher if in Buyer Role */}
            {currentRole === 'buyer' && onBuyerChange && (
              <div className="hidden lg:flex items-center gap-1 text-xs text-slate-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                <span className="font-semibold text-emerald-800">Tenant:</span>
                <select
                  value={selectedBuyerId}
                  onChange={(e) => onBuyerChange(e.target.value)}
                  className="bg-transparent text-xs font-medium text-emerald-900 outline-none cursor-pointer"
                >
                  <option value="buyer-uk-b">Company B (UK)</option>
                  <option value="buyer-de-c">Company C (Germany)</option>
                </select>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

