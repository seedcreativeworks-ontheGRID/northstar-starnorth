import React, { useState } from "react";
import { ArrowUpRight, FileCheck, FileText, Landmark, LayoutGrid, Menu, Map, Pin, X } from "lucide-react";

const groups = [
  { label: "Quick Access", icon: LayoutGrid, color: "#1d63ad", items: ["Home", "Accounts Information", "Administration", "Marketplace"] },
  { label: "Payments & Transfers", icon: Landmark, color: "#2e7c86", items: ["Account Transfer", "ACH Payments", "Electronic Funds Transfer (EFT)", "EFT Client Returns", "File Transfer Facility (FTF)", "Interac e-Transfer", "Wire Payment", "Zelle"], badges: { "Interac e-Transfer": "CA", Zelle: "US" } },
  { label: "Cheques", icon: FileCheck, color: "#8c6a35", items: ["Northstar DepositEdge", "Digital Cheque Service (DCS)", "Recon Management", "Stop Payments", "Cheque Imaging"], badges: { "Recon Management": "US" } },
  { label: "Reports", icon: FileText, color: "#725a9a", items: ["Account transfer reports", "Wire Payment reports", "Electronic Report Delivery (ERD)", "File Transfer Facility (FTF) reports", "Recon Management reports", "ACH reports", "Stop payments reports", "Digital Cheque Services reports"] },
];

export function BusinessSetupMap() {
  const [active, setActive] = useState<string | null>(null);
  const [railOpen, setRailOpen] = useState(true);
  const selectedGroup = groups.find((group) => group.label === active);

  return (
    <main className="min-h-[100dvh] bg-[#f8fafc] font-sans text-[#173955] antialiased">
      <header className="flex h-[70px] items-center justify-between border-b border-[#dbe5ed] bg-[#fbfdff] px-8">
        <div className="flex items-center gap-4"><button onClick={() => setRailOpen(!railOpen)} aria-label="Toggle navigation" className="rounded-md p-2 text-[#37739d] hover:bg-[#eaf3f9] focus:outline-none focus:ring-2 focus:ring-[#3b8ac5]"><Menu size={19} /></button><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#155b9f] text-white"><Landmark size={16} /></span><span className="text-[20px] font-bold tracking-[-.04em]">Northstar</span></div></div>
        <div className="flex items-center gap-4"><span className="hidden text-[11px] font-semibold text-[#8aa1b3] sm:block">Capability map</span><button aria-label="Open profile menu" className="grid h-9 w-9 place-items-center rounded-full bg-[#dbe8f2] text-[11px] font-bold text-[#155b9f] focus:outline-none focus:ring-2 focus:ring-[#3b8ac5]">NT</button></div>
      </header>
      <div className="mx-auto flex max-w-[1280px]">
        {railOpen && <aside className="w-[224px] shrink-0 border-r border-[#dbe5ed] bg-[#f1f6fa] px-4 py-7"><p className="px-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#7e9aae]">All capabilities</p><nav className="mt-5 space-y-1.5" aria-label="Service groups">{groups.map((group) => { const Icon = group.icon; return <button key={group.label} onClick={() => setActive(group.label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[12px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#3b8ac5] ${active === group.label ? "bg-white text-[#155b9f] shadow-sm" : "text-[#648198] hover:bg-[#e7f0f6]"}`}><Icon size={16} />{group.label}</button>; })}</nav><div className="mt-10 border-t border-[#dbe5ed] pt-5 px-2 text-[11px] leading-5 text-[#8299aa]">Your map is an orientation guide. It does not represent account activity or progress.</div></aside>}
        <section className="flex-1 px-9 py-8">
          <div className="mb-8 flex items-end justify-between"><div><div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#3b79a7]"><Map size={14} /> Your Northstar map</div><h1 className="mt-3 text-[32px] font-bold tracking-[-.045em] text-[#163a58]">A useful place to start.</h1><p className="mt-2 max-w-[590px] text-[14px] leading-6 text-[#718b9f]">Four service areas give your team a simple way to orient itself. Choose any point on the map to learn what is available.</p></div><span className="rounded-full border border-[#d7e4ec] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#7893a8]">Nothing to display yet</span></div>
          <div className="relative grid grid-cols-2 gap-4">
            {groups.map((group, index) => { const Icon = group.icon; const isActive = active === group.label; return <button key={group.label} onClick={() => setActive(isActive ? null : group.label)} className={`relative min-h-[220px] rounded-2xl border bg-white p-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3b8ac5] ${isActive ? "border-[#80add0] shadow-[0_12px_28px_rgba(35,85,125,.12)] -translate-y-1" : "border-[#dbe5ed] shadow-[0_5px_18px_rgba(38,76,108,.04)] hover:-translate-y-0.5 hover:border-[#b9cede]"}`}>
                <span className="absolute right-6 top-6 grid h-8 w-8 place-items-center rounded-full" style={{ backgroundColor: `${group.color}14`, color: group.color }}><Pin size={15} /></span>
                <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ backgroundColor: group.color }}><Icon size={19} /></span>
                <span className="mt-6 block text-[17px] font-bold text-[#204663]">{group.label}</span>
                <span className="mt-1 block text-[11px] text-[#8298aa]">Explore {group.items.length} available services</span>
                <span className="mt-5 flex flex-wrap gap-1.5">{group.items.slice(0, 3).map((item) => <span key={item} className="rounded-md bg-[#f2f6f9] px-2 py-1 text-[10px] font-semibold text-[#648198]">{item}{group.badges?.[item as keyof typeof group.badges] && <sup className="ml-1 text-[8px]">{group.badges[item as keyof typeof group.badges]}</sup>}</span>)}{group.items.length > 3 && <span className="rounded-md bg-[#f2f6f9] px-2 py-1 text-[10px] font-bold text-[#648198]">+{group.items.length - 3} more</span>}</span>
                <ArrowUpRight size={16} className="absolute bottom-6 right-6 text-[#9db2c2]" />
                {index === 0 && <span className="absolute -bottom-7 left-1/2 h-7 border-l border-dashed border-[#bbcedb]" />}
              </button>; })}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#dce8ef] bg-[#f1f7fb] px-4 py-3 text-[11px] text-[#66849b]"><span className="h-2 w-2 rounded-full bg-[#4b9a9a]" />Select a service area to see its full menu. The map is a guide, not a report.</div>
        </section>
        {selectedGroup && <aside className="w-[320px] shrink-0 border-l border-[#dbe5ed] bg-white px-6 py-8"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg text-white" style={{ backgroundColor: selectedGroup.color }}><selectedGroup.icon size={15} /></span><h2 className="text-[16px] font-bold text-[#204663]">{selectedGroup.label}</h2></div><button onClick={() => setActive(null)} aria-label="Close details" className="rounded-md p-1.5 text-[#87a0b2] hover:bg-[#f0f5f8] focus:outline-none focus:ring-2 focus:ring-[#3b8ac5]"><X size={16} /></button></div><p className="mt-5 text-[12px] leading-5 text-[#7891a4]">Available Northstar capabilities for this service area.</p><div className="mt-6 space-y-1">{selectedGroup.items.map((item) => <button onClick={() => alert(`Opening ${item}`)} key={item} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[11px] font-semibold text-[#507088] hover:bg-[#f0f6fa] hover:text-[#155b9f] focus:outline-none focus:ring-2 focus:ring-[#3b8ac5]">{item}{selectedGroup.badges?.[item as keyof typeof selectedGroup.badges] && <span className="rounded border border-[#d0dfe9] px-1.5 py-0.5 text-[9px] text-[#7894a8]">{selectedGroup.badges[item as keyof typeof selectedGroup.badges]}</span>}</button>)}</div></aside>}
      </div>
    </main>
  );
}