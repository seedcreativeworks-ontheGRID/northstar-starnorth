import React, { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck,
  FileText,
  Landmark,
  LayoutGrid,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const groups = [
  { id: "quick", label: "Quick Access", icon: LayoutGrid, items: [
    ["Home", "Return to your dashboard overview."],
    ["Accounts Information", "View balances and transaction history."],
    ["Administration", "Manage users, roles, and settings."],
    ["Marketplace", "Discover new banking products and services."],
  ]},
  { id: "payments", label: "Payments & Transfers", icon: Landmark, items: [
    ["Account Transfer", "Move funds between your Northstar accounts."],
    ["ACH Payments", "Process bulk domestic payments electronically."],
    ["Electronic Funds Transfer (EFT)", "Send funds securely to domestic vendors."],
    ["EFT Client Returns", "Manage returned and rejected EFT transactions."],
    ["File Transfer Facility (FTF)", "Batch process high-volume payment files."],
    ["Interac e-Transfer", "Send money instantly via email or text in Canada.", "CA"],
    ["Wire Payment", "Execute same-day domestic or international wires."],
    ["Zelle", "Fast, safe, and easy way to send money in the US.", "US"],
  ]},
  { id: "cheques", label: "Cheques", icon: FileCheck, items: [
    ["Northstar DepositEdge", "Scan and deposit cheques remotely from your office."],
    ["Digital Cheque Service (DCS)", "Manage outsourced cheque printing and mailing."],
    ["Recon Management", "Automate cheque reconciliation and reduce fraud.", "US"],
    ["Stop Payments", "Place, manage, or cancel stop payment requests."],
    ["Cheque Imaging", "View and download copies of cleared cheques."],
  ]},
  { id: "reports", label: "Reports", icon: FileText, items: [
    ["Account transfer reports", "Detailed logs of internal account movements."],
    ["Wire Payment reports", "Comprehensive history of incoming and outgoing wires."],
    ["Electronic Report Delivery (ERD)", "Secure distribution of periodic bank statements."],
    ["File Transfer Facility (FTF) reports", "Audit trails for your batch file processing."],
    ["Recon Management reports", "Discrepancy analysis for your cheque accounts."],
    ["ACH reports", "Transaction summaries for ACH batches."],
    ["Stop payments reports", "Status tracking for all stop requests."],
    ["Digital Cheque Services reports", "Analytics on outsourced cheque issuance."],
  ]},
];

export function ActionInboxZero() {
  const [active, setActive] = useState("payments");
  const [notice, setNotice] = useState("");
  const activeGroup = groups.find((g) => g.id === active) ?? groups[1];
  const ActiveIcon = activeGroup.icon;
  const announce = (name: string) => {
    setNotice(`${name} is ready when you are.`);
    window.setTimeout(() => setNotice(""), 2600);
  };

  return (
    <main className="min-h-[100dvh] bg-[#eef4f8] text-[#10253e] font-['Plus_Jakarta_Sans',sans-serif]">
      <header className="h-[72px] bg-[#fafdff] border-b border-[#d9e5ee] flex items-center justify-between px-8">
        <div className="flex items-center gap-5">
          <button aria-label="Open navigation" className="p-2 rounded-lg text-[#506b82] hover:bg-[#eaf2f7] focus-visible:outline-2 focus-visible:outline-[#1261a0]"><Menu size={19} /></button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#1261a0] grid place-items-center shadow-[0_5px_12px_rgba(18,97,160,.18)]"><Landmark size={18} className="text-white" /></div>
            <span className="font-semibold tracking-[-.03em] text-[19px]">Northstar</span>
          </div>
          <span className="h-5 w-px bg-[#d9e5ee]" />
          <span className="text-[12px] uppercase tracking-[.14em] text-[#6b8497] font-semibold">Business workspace</span>
        </div>
        <button aria-label="Open profile" className="w-9 h-9 rounded-full bg-[#d7e8f2] text-[#1261a0] text-xs font-bold border border-[#bdd7e5] focus-visible:outline-2 focus-visible:outline-[#1261a0]">NS</button>
      </header>

      <div className="flex min-h-[calc(100dvh-72px)]">
        <aside className="w-[282px] shrink-0 border-r border-[#d9e5ee] bg-[#f5f9fb] px-4 py-7">
          <div className="px-3 mb-4 text-[10px] uppercase tracking-[.17em] font-bold text-[#7890a2]">Navigation</div>
          <nav aria-label="Northstar services" className="space-y-1.5">
            {groups.map((group) => {
              const Icon = group.icon;
              const isActive = active === group.id;
              return <button key={group.id} onClick={() => setActive(group.id)} aria-expanded={isActive} className={`w-full flex items-center gap-3 px-3 py-3 rounded-[10px] text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#1261a0] ${isActive ? "bg-[#e1eff7] text-[#1261a0] shadow-[inset_3px_0_0_#1261a0]" : "text-[#526d81] hover:bg-[#eaf2f7]"}`}>
                <Icon size={18} /><span className="text-[13px] font-semibold flex-1">{group.label}</span><ChevronRight size={15} className={isActive ? "rotate-90 transition-transform" : "transition-transform"} />
              </button>;
            })}
          </nav>
          <div className="mt-8 mx-2 p-4 rounded-xl bg-[#e8f3f7] border border-[#cfe3ed]">
            <ShieldCheck size={18} className="text-[#1261a0] mb-3" />
            <p className="text-xs font-semibold text-[#24445e]">Your workspace is clear</p>
            <p className="text-[11px] leading-5 text-[#668096] mt-1">Nothing needs review right now.</p>
          </div>
        </aside>

        <section className="flex-1 px-10 py-9 max-w-[1050px]">
          <div className="flex items-start justify-between mb-8">
            <div><p className="text-[11px] uppercase tracking-[.18em] text-[#6c8ca2] font-bold">Action inbox</p><h1 className="text-[31px] font-semibold tracking-[-.045em] mt-2">Nothing needs your attention.</h1><p className="text-sm text-[#668096] mt-2">A calm place to start something new, when you need to.</p></div>
            <button onClick={() => announce("Search")} aria-label="Search services" className="rounded-lg border border-[#cddfe9] bg-[#fafdff] p-2.5 text-[#55738a] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#1261a0]"><Search size={18} /></button>
          </div>
          <div className="rounded-[18px] bg-[#1261a0] p-7 text-white relative overflow-hidden shadow-[0_12px_28px_rgba(18,97,160,.16)]">
            <div className="absolute -right-10 -top-14 w-48 h-48 rounded-full border-[20px] border-white/10" /><div className="absolute right-20 -bottom-20 w-56 h-56 rounded-full border-[1px] border-white/10" />
            <div className="relative flex items-center gap-4"><div className="w-11 h-11 rounded-full bg-white/15 grid place-items-center"><Check size={23} /></div><div><h2 className="font-semibold text-[18px]">All clear</h2><p className="text-[13px] text-blue-100 mt-1">No pending actions are shown in this workspace.</p></div></div>
            <div className="relative mt-7 flex gap-3"><button onClick={() => announce("Payments & Transfers")} className="inline-flex items-center gap-2 bg-[#f5c96a] text-[#15324c] px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-[#f8d98d] focus-visible:outline-2 focus-visible:outline-white"><Plus size={15} /> Start a payment</button><button onClick={() => announce("Accounts Information")} className="inline-flex items-center gap-2 border border-white/30 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white">View account information <ArrowUpRight size={14} /></button></div>
          </div>
          <div className="mt-8 flex items-center justify-between"><div><h2 className="font-semibold text-[17px]">Start from a service</h2><p className="text-xs text-[#71899a] mt-1">Choose an area to continue.</p></div><span className="text-[11px] font-semibold text-[#7c94a5]">{activeGroup.items.length} services</span></div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {activeGroup.items.map(([name, description, badge]) => <button key={name} onClick={() => announce(name)} className="group text-left rounded-xl border border-[#d8e5ec] bg-[#fafdff] px-4 py-4 hover:border-[#8bb8d0] hover:-translate-y-0.5 transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-[#1261a0]"><div className="flex items-center gap-2"><span className="text-[13px] font-semibold group-hover:text-[#1261a0]">{name}</span>{badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#edf2f5] text-[#607b8e]">{badge}</span>}</div><p className="text-[11px] leading-5 text-[#7890a2] mt-1.5">{description}</p></button>)}
          </div>
          <button onClick={() => announce(activeGroup.label)} className="mt-4 text-xs font-semibold text-[#1261a0] inline-flex items-center gap-1 hover:gap-2 transition-[gap] focus-visible:outline-2 focus-visible:outline-[#1261a0]">Browse all {activeGroup.label} <ChevronRight size={14} /></button>
          {notice && <div role="status" className="fixed bottom-6 right-7 rounded-lg bg-[#183a55] text-white px-4 py-3 text-xs shadow-xl flex items-center gap-2"><Sparkles size={14} className="text-[#f5c96a]" />{notice}</div>}
        </section>
      </div>
    </main>
  );
}