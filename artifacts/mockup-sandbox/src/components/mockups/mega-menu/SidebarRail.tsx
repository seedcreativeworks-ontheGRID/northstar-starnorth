import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Landmark, 
  FileCheck, 
  FileText,
  Menu,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const MENU_DATA = [
  {
    id: 'quick-access',
    label: 'Quick Access',
    icon: LayoutGrid,
    items: [
      { name: 'Home', description: 'Return to your dashboard overview.' },
      { name: 'Accounts Information', description: 'View balances and transaction history.' },
      { name: 'Administration', description: 'Manage users, roles, and settings.' },
      { name: 'Marketplace', description: 'Discover new banking products and services.' },
    ]
  },
  {
    id: 'payments',
    label: 'Payments & Transfers',
    icon: Landmark,
    items: [
      { name: 'Account Transfer', description: 'Move funds between your Northstar accounts.' },
      { name: 'ACH Payments', description: 'Process bulk domestic payments electronically.' },
      { name: 'Electronic Funds Transfer (EFT)', description: 'Send funds securely to domestic vendors.' },
      { name: 'EFT Client Returns', description: 'Manage returned and rejected EFT transactions.' },
      { name: 'File Transfer Facility (FTF)', description: 'Batch process high-volume payment files.' },
      { name: 'Interac e-Transfer', badge: 'CA', description: 'Send money instantly via email or text in Canada.' },
      { name: 'Wire Payment', description: 'Execute same-day domestic or international wires.' },
      { name: 'Zelle', badge: 'US', description: 'Fast, safe, and easy way to send money in the US.' },
    ]
  },
  {
    id: 'cheques',
    label: 'Cheques',
    icon: FileCheck,
    items: [
      { name: 'Northstar DepositEdge', description: 'Scan and deposit cheques remotely from your office.' },
      { name: 'Digital Cheque Service (DCS)', description: 'Manage outsourced cheque printing and mailing.' },
      { name: 'Recon Management', badge: 'US', description: 'Automate cheque reconciliation and reduce fraud.' },
      { name: 'Stop Payments', description: 'Place, manage, or cancel stop payment requests.' },
      { name: 'Cheque Imaging', description: 'View and download copies of cleared cheques.' },
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    items: [
      { name: 'Account transfer reports', description: 'Detailed logs of internal account movements.' },
      { name: 'Wire Payment reports', description: 'Comprehensive history of incoming and outgoing wires.' },
      { name: 'Electronic Report Delivery (ERD)', description: 'Secure distribution of periodic bank statements.' },
      { name: 'File Transfer Facility (FTF) reports', description: 'Audit trails for your batch file processing.' },
      { name: 'Recon Management reports', description: 'Discrepancy analysis for your cheque accounts.' },
      { name: 'ACH reports', description: 'Transaction summaries for ACH batches.' },
      { name: 'Stop payments reports', description: 'Status tracking for all stop requests.' },
      { name: 'Digital Cheque Services reports', description: 'Analytics on outsourced cheque issuance.' },
    ]
  }
];

export function SidebarRail() {
  const [activeGroupId, setActiveGroupId] = useState('payments');

  const activeGroup = MENU_DATA.find(g => g.id === activeGroupId) || MENU_DATA[1];

  return (
    <div className="min-h-screen bg-slate-100 pt-12 pb-24 px-6 flex flex-col items-center font-sans">
      {/* Northstar App Header */}
      <div className="w-full max-w-6xl bg-white h-16 flex items-center px-6 justify-between border border-slate-200 border-b-0 rounded-t-xl shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          {/* Active Menu Trigger */}
          <button className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-100 transition-colors">
            <Menu className="w-4 h-4" />
            Menu
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-blue-700 p-1.5 rounded-md">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Northstar</span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
      </div>

      {/* Mega Menu Dropdown Panel */}
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-b-xl border border-slate-200 overflow-hidden flex min-h-[500px] z-0 relative animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Left Sidebar Rail */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0">
          <div className="px-3 py-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</h2>
          </div>
          
          <nav className="flex flex-col gap-1">
            {MENU_DATA.map((group) => {
              const Icon = group.icon;
              const isActive = activeGroupId === group.id;
              
              return (
                <button
                  key={group.id}
                  onMouseEnter={() => setActiveGroupId(group.id)}
                  onClick={() => setActiveGroupId(group.id)}
                  className={`
                    w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-all duration-200
                    ${isActive 
                      ? 'bg-white shadow-sm border border-slate-200 text-blue-700' 
                      : 'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-medium text-sm">{group.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                      {group.items.length}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                  </div>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-auto px-3 py-4">
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 mb-1">Need help?</h3>
              <p className="text-xs text-slate-500 mb-3">Find answers in our support center or contact your relationship manager.</p>
              <a href="#" className="text-xs font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1 group">
                Visit Support Center
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Detail Area */}
        <div className="flex-1 bg-white p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-700">
              <activeGroup.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{activeGroup.label}</h2>
              <p className="text-sm text-slate-500">Select a destination to continue</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-8">
            {activeGroup.items.map((item) => (
              <a 
                key={item.name} 
                href="#" 
                className="group block p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                  {item.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
