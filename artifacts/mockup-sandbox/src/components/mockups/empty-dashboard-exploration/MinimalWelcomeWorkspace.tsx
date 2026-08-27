import React, { useState } from "react";
import { ChevronDown, ChevronRight, FileCheck, FileText, Landmark, LayoutGrid, Menu, MoveRight } from "lucide-react";

const groups = [
  { id: "quick", label: "Quick Access", icon: LayoutGrid, items: ["Home", "Accounts Information", "Administration", "Marketplace"] },
  { id: "payments", label: "Payments & Transfers", icon: Landmark, items: ["Account Transfer", "ACH Payments", "Electronic Funds Transfer (EFT)", "EFT Client Returns", "File Transfer Facility (FTF)", "Interac e-Transfer", "Wire Payment", "Zelle"], badges: { "Interac e-Transfer": "CA", Zelle: "US" } },
  { id: "cheques", label: "Cheques", icon: FileCheck, items: ["Northstar DepositEdge", "Digital Cheque Service (DCS)", "Recon Management", "Stop Payments", "Cheque Imaging"], badges: { "Recon Management": "US" } },
  { id: "reports", label: "Reports", icon: FileText, items: ["Account transfer reports", "Wire Payment reports", "Electronic Report Delivery (ERD)", "File Transfer Facility (FTF) reports", "Recon Management reports", "ACH reports", "Stop payments reports", "Digital Cheque Services reports"] },
];

export function MinimalWelcomeWorkspace() {
  const [active, setActive] = useState("quick");
  const [selected, setSelected] = useState("");
  const group = groups.find((item) => item.id === active) ?? groups[0];
  const Icon = group.icon;
  return (
    <main className="min-h-[100dvh] bg-[#f4f8f9] text-[#17364d] font-['Plus_Jakarta_Sans',sans-serif]">
      <header className="h-[70px] border-b border-[#dce9eb] bg-[#f8fbfb] flex items-center justify-between px-9">
        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#0d6680] rounded-lg grid place-items-center"><Landmark size={16} className="text-white" /></div><span className="text-[18px] font-semibold tracking-[-.04em]">Northstar</span><span className="ml-2 text-[11px] text-[#78919b] border-l border-[#d6e4e7] pl-4">Business banking</span></div>
        <div className="flex items-center gap-4"><button aria-label="Open menu" className="p-2 text-[#5b7b86] rounded-md hover:bg-[#e8f1f2] focus-visible:outline-2 focus-visible:outline-[#0d6680]"><Menu size={18} /></button><button aria-label="Open profile" className="w-8 h-8 rounded-full bg-[#dcecef] text-[#0d6680] text-[10px] font-bold focus-visible:outline-2 focus-visible:outline-[#0d6680]">NS</button></div>
      </header>
      <div className="flex">
        <aside className="w-[290px] min-h-[calc(100dvh-70px)] border-r border-[#dce9eb] bg-[#edf5f5] px-5 pt-8">
          <p className="px-3 text-[10px] uppercase tracking-[.2em] font-bold text-[#7b969d] mb-5">Workspace</p>
          <nav aria-label="Service navigation" className="space-y-1">
            {groups.map(({ id, label, icon: GroupIcon }) => <button key={id} onClick={() => setActive(id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-[#0d6680] ${active === id ? "bg-[#d9ecee] text-[#0d6680]" : "text-[#5b7883] hover:bg-[#e5eff0]"}`}><GroupIcon size={17} /><span className="text-[12px] font-semibold flex-1">{label}</span><ChevronDown size={14} className={active === id ? "rotate-180 transition-transform" : "transition-transform"} /></button>)}
          </nav>
          <div className="mt-8 border-t border-[#d8e6e8] pt-5 px-3"><p className="text-[11px] leading-5 text-[#769099]">Select a service to begin. Your workspace is ready for you.</p></div>
        </aside>
        <section className="flex-1 px-16 py-16 max-w-[1000px]">
          <div className="max-w-[580px]">
            <p className="text-[11px] uppercase tracking-[.18em] text-[#0d6680] font-bold">Welcome to Northstar</p>
            <h1 className="mt-5 text-[46px] leading-[1.08] font-semibold tracking-[-.065em] text-[#153c55]">A clearer way to move your business forward.</h1>
            <p className="mt-6 text-[15px] leading-7 text-[#67838c] max-w-[480px]">Your workspace is ready. Start with a service from the left, or take a quick orientation to find your way around.</p>
            <button onClick={() => setSelected("Orientation started")} className="mt-9 inline-flex items-center gap-3 bg-[#0d6680] text-white rounded-lg px-5 py-3.5 text-[12px] font-bold hover:bg-[#09566d] focus-visible:outline-2 focus-visible:outline-[#0d6680] focus-visible:outline-offset-3">Take a quick orientation <MoveRight size={16} /></button>
            {selected && <p role="status" className="mt-4 text-xs text-[#0d6680]">{selected}. Choose any service whenever you’re ready.</p>}
          </div>
          <div className="mt-20 border-t border-[#dce9eb] pt-7">
            <div className="flex items-center gap-3 text-[#547580]"><Icon size={17} /><h2 className="text-[13px] font-bold">{group.label}</h2><span className="text-[11px] text-[#8aa0a6]">Select a destination</span></div>
            <div className="mt-5 grid grid-cols-2 gap-x-12 gap-y-1 max-w-[700px]">
              {group.items.map((item) => <button key={item} onClick={() => setSelected(item)} className="group flex items-center gap-3 py-3 text-left border-b border-[#e3edef] text-[12px] text-[#456875] hover:text-[#0d6680] focus-visible:outline-2 focus-visible:outline-[#0d6680]"><span className="w-1.5 h-1.5 rounded-full bg-[#9dc6cb] group-hover:bg-[#0d6680]" /><span className="flex-1">{item}</span>{group.badges?.[item as keyof typeof group.badges] && <span className="text-[9px] font-bold rounded bg-[#e2edef] px-1.5 py-0.5 text-[#64828a]">{group.badges[item as keyof typeof group.badges]}</span>}<ChevronRight size={14} className="opacity-0 group-hover:opacity-100" /></button>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}