import React, { useState } from 'react';
import { LayoutGrid, Landmark, FileCheck, FileText, Menu as MenuIcon, X } from 'lucide-react';

const menuData = [
  {
    title: "Quick Access",
    icon: LayoutGrid,
    items: [
      { name: "Home" },
      { name: "Accounts Information" },
      { name: "Administration" },
      { name: "Marketplace" },
    ]
  },
  {
    title: "Payments & Transfers",
    icon: Landmark,
    items: [
      { name: "Account Transfer" },
      { name: "ACH Payments" },
      { name: "Electronic Funds Transfer (EFT)" },
      { name: "EFT Client Returns" },
      { name: "File Transfer Facility (FTF)" },
      { name: "Interac e-Transfer", badge: "CA" },
      { name: "Wire Payment" },
      { name: "Zelle", badge: "US" },
    ]
  },
  {
    title: "Cheques",
    icon: FileCheck,
    items: [
      { name: "Northstar DepositEdge" },
      { name: "Digital Cheque Service (DCS)" },
      { name: "Recon Management", badge: "US" },
      { name: "Stop Payments" },
      { name: "Cheque Imaging" },
    ]
  },
  {
    title: "Reports",
    icon: FileText,
    items: [
      { name: "Account transfer reports" },
      { name: "Wire Payment reports" },
      { name: "Electronic Report Delivery (ERD)" },
      { name: "File Transfer Facility (FTF) reports" },
      { name: "Recon Management reports" },
      { name: "ACH reports" },
      { name: "Stop payments reports" },
      { name: "Digital Cheque Services reports" },
    ]
  }
];

export function CardGrid() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 relative z-20 shadow-sm flex-none">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700">
            <Landmark className="w-7 h-7" />
            <span className="text-xl font-bold tracking-tight">Northstar</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                isMenuOpen 
                  ? 'bg-blue-50 text-blue-700 shadow-inner' 
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area (behind menu) */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 relative z-0">
        <div className="w-full h-96 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
          Dashboard Content Area
        </div>
      </main>

      {/* Mega Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-10 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="bg-slate-100 border-b border-slate-200 shadow-xl pb-12 pt-8 animate-in slide-in-from-top-2 duration-200 pointer-events-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Main Menu</h2>
                <p className="text-slate-500 mt-1">Access all your business banking tools and services.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {menuData.map((group, idx) => {
                  const Icon = group.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col h-full"
                    >
                      {/* Top Accent Line on Hover */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                      
                      {/* Card Header */}
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-semibold text-slate-900">{group.title}</h3>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-sm">
                          {group.items.length}
                        </span>
                      </div>
                      
                      {/* Card Body */}
                      <div className="p-3 flex-grow">
                        <ul className="space-y-1">
                          {group.items.map(item => (
                            <li key={item.name}>
                              <a 
                                href="#" 
                                onClick={(e) => e.preventDefault()}
                                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50/50 transition-all group/item"
                              >
                                <span className="font-medium group-hover/item:translate-x-1 transition-transform duration-200">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200 group-hover/item:border-blue-200 group-hover/item:text-blue-600 group-hover/item:bg-blue-50 transition-colors">
                                    {item.badge}
                                  </span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
