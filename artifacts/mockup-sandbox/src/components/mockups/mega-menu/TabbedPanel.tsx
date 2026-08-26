import React, { useState } from 'react';
import { Landmark, LayoutGrid, FileCheck, FileText, Zap, ChevronUp, Building } from 'lucide-react';

type BadgeType = 'CA' | 'US';

interface MenuItem {
  name: string;
  badge?: BadgeType;
}

interface Category {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  items: MenuItem[];
}

const CATEGORIES: Category[] = [
  {
    id: 'quick-access',
    name: 'Quick Access',
    icon: LayoutGrid,
    items: [
      { name: 'Home' },
      { name: 'Accounts Information' },
      { name: 'Administration' },
      { name: 'Marketplace' },
    ],
  },
  {
    id: 'payments-transfers',
    name: 'Payments & Transfers',
    icon: Landmark,
    items: [
      { name: 'Account Transfer' },
      { name: 'ACH Payments' },
      { name: 'Electronic Funds Transfer (EFT)' },
      { name: 'EFT Client Returns' },
      { name: 'File Transfer Facility (FTF)' },
      { name: 'Interac e-Transfer', badge: 'CA' },
      { name: 'Wire Payment' },
      { name: 'Zelle', badge: 'US' },
    ],
  },
  {
    id: 'cheques',
    name: 'Cheques',
    icon: FileCheck,
    items: [
      { name: 'Northstar DepositEdge' },
      { name: 'Digital Cheque Service (DCS)' },
      { name: 'Recon Management', badge: 'US' },
      { name: 'Stop Payments' },
      { name: 'Cheque Imaging' },
    ],
  },
  {
    id: 'reports',
    name: 'Reports',
    icon: FileText,
    items: [
      { name: 'Account transfer reports' },
      { name: 'Wire Payment reports' },
      { name: 'Electronic Report Delivery (ERD)' },
      { name: 'File Transfer Facility (FTF) reports' },
      { name: 'Recon Management reports' },
      { name: 'ACH reports' },
      { name: 'Stop payments reports' },
      { name: 'Digital Cheque Services reports' },
    ],
  },
];

const QUICK_ACTIONS = [
  'Account Transfer',
  'Wire Payment',
  'Home',
];

export function TabbedPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('payments-transfers');

  const activeCategory = CATEGORIES.find(c => c.id === activeTab) || CATEGORIES[1];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Header Strip */}
      <header className="bg-white border-b border-slate-200 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 text-blue-700">
              <div className="bg-blue-700 p-1.5 rounded-lg text-white">
                <Building size={20} />
              </div>
              <span className="font-semibold text-lg tracking-tight">Northstar</span>
            </div>

            {/* Nav Triggers */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                  isOpen 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Menu
                <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${!isOpen ? 'rotate-180' : ''}`} />
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </div>
      </header>

      {/* Mega Menu Panel */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-10 bg-white border-b border-slate-200 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6">
            
            {/* Quick Actions row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Quick Actions
              </div>
              {QUICK_ACTIONS.map(action => (
                <button 
                  key={action}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 rounded-full text-sm font-medium transition-colors text-slate-700"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
              {CATEGORIES.map(category => {
                const Icon = category.icon;
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors duration-150 ${
                      isActive 
                        ? 'border-blue-700 text-blue-700' 
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Panel Content */}
            <div className="min-h-[240px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 pt-2">
                {activeCategory.items.map((item, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="group flex items-start gap-2 p-3 -mx-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors leading-snug">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${
                        item.badge === 'CA' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
      
      {/* Page Content Backdrop (to show overlay effect if any, or just spacing) */}
      <div className="max-w-7xl mx-auto p-8 opacity-40 select-none pointer-events-none mt-16">
        <div className="h-48 rounded-xl bg-white border border-slate-200 mb-6 flex items-center justify-center shadow-sm">
          <div className="text-slate-400 font-medium">Dashboard Widget Area</div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-64 rounded-xl bg-white border border-slate-200 shadow-sm"></div>
          <div className="h-64 rounded-xl bg-white border border-slate-200 shadow-sm col-span-2"></div>
        </div>
      </div>
      
    </div>
  );
}
