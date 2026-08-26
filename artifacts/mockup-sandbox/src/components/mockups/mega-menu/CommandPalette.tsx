import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, LayoutGrid, Landmark, FileCheck, FileText, CornerDownLeft, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

type MenuItem = {
  name: string;
  badge?: string;
};

type MenuGroup = {
  name: string;
  icon: React.ElementType;
  items: MenuItem[];
};

const groups: MenuGroup[] = [
  {
    name: "Quick Access",
    icon: LayoutGrid,
    items: [
      { name: "Home" },
      { name: "Accounts Information" },
      { name: "Administration" },
      { name: "Marketplace" }
    ]
  },
  {
    name: "Payments & Transfers",
    icon: Landmark,
    items: [
      { name: "Account Transfer" },
      { name: "ACH Payments" },
      { name: "Electronic Funds Transfer (EFT)" },
      { name: "EFT Client Returns" },
      { name: "File Transfer Facility (FTF)" },
      { name: "Interac e-Transfer", badge: "CA" },
      { name: "Wire Payment" },
      { name: "Zelle", badge: "US" }
    ]
  },
  {
    name: "Cheques",
    icon: FileCheck,
    items: [
      { name: "Northstar DepositEdge" },
      { name: "Digital Cheque Service (DCS)" },
      { name: "Recon Management", badge: "US" },
      { name: "Stop Payments" },
      { name: "Cheque Imaging" }
    ]
  },
  {
    name: "Reports",
    icon: FileText,
    items: [
      { name: "Account transfer reports" },
      { name: "Wire Payment reports" },
      { name: "Electronic Report Delivery (ERD)" },
      { name: "File Transfer Facility (FTF) reports" },
      { name: "Recon Management reports" },
      { name: "ACH reports" },
      { name: "Stop payments reports" },
      { name: "Digital Cheque Services reports" }
    ]
  }
];

const frequentlyUsed = [
  { name: "Account Transfer", groupName: "Payments & Transfers", icon: Landmark },
  { name: "Wire Payment", groupName: "Payments & Transfers", icon: Landmark },
  { name: "Account transfer reports", groupName: "Reports", icon: FileText }
];

const HighlightText = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;
  
  // Split on query, case-insensitive (escape regex metacharacters)
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  const matches = (part: string) =>
    part.toLowerCase() === query.trim().toLowerCase();

  return (
    <>
      {parts.map((part, i) =>
        matches(part) ? (
          <span key={i} className="text-blue-700 bg-blue-100 rounded-[2px] px-[1px] font-semibold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase();
    return groups.map(g => ({
      ...g,
      items: g.items.filter(i => i.name.toLowerCase().includes(q))
    })).filter(g => g.items.length > 0);
  }, [searchQuery]);

  const visibleItems = useMemo(() => {
    return filteredGroups.flatMap(g => g.items.map(i => ({ ...i, groupName: g.name, groupIcon: g.icon })));
  }, [filteredGroups]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (visibleItems.length > 0 ? (prev + 1) % visibleItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (visibleItems.length > 0 ? (prev - 1 + visibleItems.length) % visibleItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = visibleItems[selectedIndex];
        if (selected) {
          console.log("Navigating to", selected.name);
          setIsOpen(false);
          setSearchQuery("");
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, visibleItems, selectedIndex]);

  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Northstar Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-20 relative shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-700 p-1.5 rounded-lg shadow-sm flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Northstar</span>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              isOpen 
                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200/50" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            Menu
            {isOpen ? <X className="w-4 h-4" /> : <Command className="w-4 h-4" />}
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col items-center pt-8 md:pt-16">
        {/* Backdrop for mockup realism */}
        {isOpen && (
          <div
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-0 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Command Palette Dropdown */}
        {isOpen && (
          <div 
            className="w-full max-w-2xl bg-white rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200/80 flex flex-col overflow-hidden z-10 mx-4" 
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-slate-100 bg-white">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-400 min-w-0 font-medium"
                placeholder="Search for a feature, report, or transfer..."
              />
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-4">
                <kbd className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-sans font-medium text-slate-500 shadow-sm">ESC</kbd>
                <span className="text-[11px] text-slate-400 font-medium">to close</span>
              </div>
            </div>

            {/* Pinned Row - Only show when not searching */}
            {!searchQuery && (
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Frequently Used</div>
                <div className="flex flex-wrap gap-2">
                  {frequentlyUsed.map((item, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm hover:border-blue-300 hover:ring-1 hover:ring-blue-100 transition-all text-sm font-medium text-slate-700"
                    >
                      <item.icon className="w-4 h-4 text-blue-600" />
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            <div ref={listRef} className="overflow-y-auto flex-1 p-2 bg-white">
              {visibleItems.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-slate-500">
                  <Search className="w-8 h-8 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-600">No results found</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for something else.</p>
                </div>
              ) : (
                <div className="space-y-4 pb-2 pt-1">
                  {filteredGroups.map((group) => {
                    const GroupIcon = group.icon;
                    return (
                      <div key={group.name} className="px-2">
                        <div className="flex items-center gap-2 mb-1.5 px-2">
                          <GroupIcon className="w-3.5 h-3.5 text-slate-400" />
                          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {group.name}
                          </h3>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {group.items.map((item) => {
                            const globalIndex = visibleItems.findIndex(v => v.name === item.name && v.groupName === group.name);
                            const isSelected = globalIndex === selectedIndex;
                            
                            return (
                              <button
                                key={item.name}
                                data-selected={isSelected}
                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                onClick={() => {
                                  console.log("Navigating to", item.name);
                                  setIsOpen(false);
                                  setSearchQuery("");
                                }}
                                className={cn(
                                  "group flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150",
                                  isSelected ? "bg-blue-50/80" : "hover:bg-slate-50"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={cn(
                                    "text-sm transition-colors",
                                    isSelected ? "text-blue-900 font-medium" : "text-slate-700 font-medium"
                                  )}>
                                    <HighlightText text={item.name} query={searchQuery} />
                                  </span>
                                  {item.badge && (
                                    <span className={cn(
                                      "inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border",
                                      isSelected ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-500 border-slate-200"
                                    )}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                
                                <div className={cn(
                                  "flex items-center transition-opacity",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}>
                                  <CornerDownLeft className="w-4 h-4 text-blue-500" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="flex gap-0.5">
                    <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-sans shadow-sm text-slate-400">↑</kbd>
                    <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-sans shadow-sm text-slate-400">↓</kbd>
                  </span>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 font-sans shadow-sm text-slate-400">↵</kbd>
                  <span>to select</span>
                </span>
              </div>
              <div className="text-slate-400">
                {visibleItems.length} result{visibleItems.length !== 1 && 's'}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
