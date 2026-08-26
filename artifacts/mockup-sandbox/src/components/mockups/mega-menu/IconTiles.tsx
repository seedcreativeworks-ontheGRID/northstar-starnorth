import React, { useState } from 'react';
import {
  LayoutGrid, Landmark, FileCheck, FileText,
  Home, Wallet, Settings, ShoppingBag,
  ArrowLeftRight, Banknote, RefreshCw, CornerUpLeft, FileUp, Zap, Globe, Send,
  UploadCloud, Laptop, CheckSquare, Ban, Image as ImageIcon,
  FileSpreadsheet, Mail, FileCode, FileDigit, FileX, FileImage,
  Search, ChevronUp, Bell, UserCircle
} from 'lucide-react';

type TileItem = {
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  badge: string | null;
};

const quickAccess: TileItem[] = [
  { label: 'Home', icon: Home, badge: null },
  { label: 'Accounts Information', icon: Wallet, badge: null },
  { label: 'Administration', icon: Settings, badge: null },
  { label: 'Marketplace', icon: ShoppingBag, badge: null },
];

const paymentsTransfers: TileItem[] = [
  { label: 'Account Transfer', icon: ArrowLeftRight, badge: null },
  { label: 'ACH Payments', icon: Banknote, badge: null },
  { label: 'Electronic Funds Transfer (EFT)', icon: RefreshCw, badge: null },
  { label: 'EFT Client Returns', icon: CornerUpLeft, badge: null },
  { label: 'File Transfer Facility (FTF)', icon: FileUp, badge: null },
  { label: 'Interac e-Transfer', icon: Zap, badge: 'CA' },
  { label: 'Wire Payment', icon: Globe, badge: null },
  { label: 'Zelle', icon: Send, badge: 'US' },
];

const cheques: TileItem[] = [
  { label: 'Northstar DepositEdge', icon: UploadCloud, badge: null },
  { label: 'Digital Cheque Service (DCS)', icon: Laptop, badge: null },
  { label: 'Recon Management', icon: CheckSquare, badge: 'US' },
  { label: 'Stop Payments', icon: Ban, badge: null },
  { label: 'Cheque Imaging', icon: ImageIcon, badge: null },
];

const reports: TileItem[] = [
  { label: 'Account transfer reports', icon: FileSpreadsheet, badge: null },
  { label: 'Wire Payment reports', icon: FileText, badge: null },
  { label: 'Electronic Report Delivery (ERD)', icon: Mail, badge: null },
  { label: 'File Transfer Facility (FTF) reports', icon: FileCode, badge: null },
  { label: 'Recon Management reports', icon: FileCheck, badge: null },
  { label: 'ACH reports', icon: FileDigit, badge: null },
  { label: 'Stop payments reports', icon: FileX, badge: null },
  { label: 'Digital Cheque Services reports', icon: FileImage, badge: null },
];

export function IconTiles() {
  const [search, setSearch] = useState("");

  const filterItems = (items: TileItem[]) =>
    items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));

  const filteredQA = filterItems(quickAccess);
  const filteredPT = filterItems(paymentsTransfers);
  const filteredC = filterItems(cheques);
  const filteredR = filterItems(reports);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between z-20 sticky top-0 shrink-0">
        <div className="flex items-center gap-2 text-blue-700">
          <Landmark size={24} strokeWidth={2.5} />
          <span className="font-bold text-xl tracking-tight">Northstar</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 outline-none">
            <LayoutGrid size={18} />
            Menu
            <ChevronUp size={16} className="ml-1 opacity-70" />
          </button>
          
          <div className="w-px h-6 bg-slate-200"></div>
          
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Bell size={20} />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <UserCircle size={24} />
          </button>
        </div>
      </header>

      {/* Mega Menu Panel */}
      <div className="w-full bg-white border-b border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] relative z-10 origin-top animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="max-w-[1280px] mx-auto w-full p-8 pb-12">
          
          {/* Search Bar */}
          <div className="relative mb-10 max-w-xl mx-auto group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search features, payments, or reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm placeholder:text-slate-400 shadow-sm"
              autoFocus
            />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-4 gap-8">
            <div className={`transition-opacity duration-300 ${search && !filteredQA.length ? 'opacity-30 grayscale-[50%]' : 'opacity-100'}`}>
              <Section title="Quick Access" icon={LayoutGrid} items={filteredQA} />
            </div>
            <div className={`transition-opacity duration-300 ${search && !filteredPT.length ? 'opacity-30 grayscale-[50%]' : 'opacity-100'}`}>
              <Section title="Payments & Transfers" icon={Landmark} items={filteredPT} />
            </div>
            <div className={`transition-opacity duration-300 ${search && !filteredC.length ? 'opacity-30 grayscale-[50%]' : 'opacity-100'}`}>
              <Section title="Cheques" icon={FileCheck} items={filteredC} />
            </div>
            <div className={`transition-opacity duration-300 ${search && !filteredR.length ? 'opacity-30 grayscale-[50%]' : 'opacity-100'}`}>
              <Section title="Reports" icon={FileText} items={filteredR} />
            </div>
          </div>

          {/* Empty State */}
          {search && ![...filteredQA, ...filteredPT, ...filteredC, ...filteredR].length && (
            <div className="text-center py-16 absolute inset-x-0 bottom-0 top-[120px] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Search className="text-slate-400" size={24} />
              </div>
              <h4 className="text-slate-900 font-medium text-lg mb-1">No results found</h4>
              <p className="text-slate-500 text-sm">We couldn't find anything matching "{search}"</p>
            </div>
          )}

        </div>
      </div>

      {/* Background Dim overlay */}
      <div className="flex-1 bg-slate-900/10 backdrop-blur-[2px]"></div>
    </div>
  );
}

const Section = ({ title, icon: Icon, items }: { title: string, icon: any, items: any[] }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-2.5 text-slate-800 pb-3 border-b border-slate-100">
      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shadow-sm shadow-blue-900/5">
         <Icon size={16} className="text-blue-700" strokeWidth={2} />
      </div>
      <h3 className="font-semibold text-xs tracking-wider uppercase text-slate-700">{title}</h3>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {items.map(item => <Tile key={item.label} {...item} />)}
    </div>
  </div>
);

const Tile = ({ icon: Icon, label, badge }: { icon: any, label: string, badge: string | null }) => (
  <button className="relative group flex flex-col items-center justify-start gap-2.5 p-3.5 min-h-[116px] bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-[0_4px_16px_rgba(29,78,216,0.12)] transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500">
    <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-700 transition-colors shrink-0 shadow-sm shadow-slate-900/5">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <span className="text-[11.5px] font-medium text-slate-700 text-center leading-[1.3] px-0.5 group-hover:text-blue-900 transition-colors w-full line-clamp-3">
      {label}
    </span>
    {badge && (
      <span className="absolute top-2 right-2 text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 z-10 shadow-sm pointer-events-none">
        {badge}
      </span>
    )}
  </button>
);
