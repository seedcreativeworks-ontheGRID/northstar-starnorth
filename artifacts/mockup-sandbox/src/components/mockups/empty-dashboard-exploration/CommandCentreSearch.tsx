import React, { useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, FileCheck2, FileText, Grid2X2, Landmark, Menu, Search, ShieldCheck, X } from "lucide-react";

const MENU_DATA = [
  { id: "quick", label: "Quick Access", icon: Grid2X2, items: [
    ["Home", "Return to your dashboard overview."], ["Accounts Information", "View balances and transaction history."], ["Administration", "Manage users, roles, and settings."], ["Marketplace", "Discover new banking products and services."]
  ]},
  { id: "payments", label: "Payments & Transfers", icon: Landmark, items: [
    ["Account Transfer", "Move funds between your Northstar accounts."], ["ACH Payments", "Process bulk domestic payments electronically."], ["Electronic Funds Transfer (EFT)", "Send funds securely to domestic vendors."], ["EFT Client Returns", "Manage returned and rejected EFT transactions."], ["File Transfer Facility (FTF)", "Batch process high-volume payment files."], ["Interac e-Transfer", "Send money instantly via email or text in Canada.", "CA"], ["Wire Payment", "Execute same-day domestic or international wires."], ["Zelle", "Fast, safe, and easy way to send money in the US.", "US"]
  ]},
  { id: "cheques", label: "Cheques", icon: FileCheck2, items: [
    ["Northstar DepositEdge", "Scan and deposit cheques remotely from your office."], ["Digital Cheque Service (DCS)", "Manage outsourced cheque printing and mailing."], ["Recon Management", "Automate cheque reconciliation and reduce fraud.", "US"], ["Stop Payments", "Place, manage, or cancel stop payment requests."], ["Cheque Imaging", "View and download copies of cleared cheques."]
  ]},
  { id: "reports", label: "Reports", icon: FileText, items: [
    ["Account transfer reports", "Detailed logs of internal account movements."], ["Wire Payment reports", "Comprehensive history of incoming and outgoing wires."], ["Electronic Report Delivery (ERD)", "Secure distribution of periodic bank statements."], ["File Transfer Facility (FTF) reports", "Audit trails for your batch file processing."], ["Recon Management reports", "Discrepancy analysis for your cheque accounts."], ["ACH reports", "Transaction summaries for ACH batches."], ["Stop payments reports", "Status tracking for all stop requests."], ["Digital Cheque Services reports", "Analytics on outsourced cheque issuance."]
  ]}
];

export function CommandCentreSearch() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("all");
  const [selected, setSelected] = useState("");
  const filtered = useMemo(() => MENU_DATA.flatMap(group => group.items.map(item => ({ group, item }))).filter(({ group, item }) => {
    const matchesGroup = activeGroup === "all" || activeGroup === group.id;
    return matchesGroup && (!query.trim() || `${item[0]} ${item[1]} ${group.label}`.toLowerCase().includes(query.toLowerCase()));
  }), [activeGroup, query]);

  return (
    <main className="min-h-[100dvh] bg-[#f4f7fb] text-[#14233d] p-6 font-['Plus_Jakarta_Sans']">
      <section className="mx-auto flex min-h-[748px] max-w-[1180px] flex-col overflow-hidden rounded-[24px] border border-[#dce5f1] bg-[#fbfcfe] shadow-[0_20px_70px_rgba(23,52,90,0.12)]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#e3eaf3] bg-white/90 px-7">
          <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0757b7] text-white shadow-[0_5px_14px_rgba(7,87,183,.25)]"><Landmark size={18}/></div><span className="text-[19px] font-bold tracking-[-.04em]">Northstar</span><span className="ml-2 hidden border-l border-[#dfe7f1] pl-4 text-xs font-semibold uppercase tracking-[.15em] text-[#7890ac] sm:inline">Workspace</span></div>
          <div className="flex items-center gap-4 text-[#7086a2]"><ShieldCheck size={17}/><span className="hidden text-xs font-semibold sm:inline">Secure business banking</span><button aria-label="Open menu" className="rounded-lg p-2 transition hover:bg-[#edf4fd] hover:text-[#0757b7]"><Menu size={19}/></button><div className="grid h-8 w-8 place-items-center rounded-full bg-[#e7eef8] text-xs font-bold text-[#315b8c]">NS</div></div>
        </header>
        <div className="grid flex-1 md:grid-cols-[280px_1fr]">
          <aside className="border-b border-[#e3eaf3] bg-[#f3f7fc] p-5 md:border-b-0 md:border-r">
            <p className="mb-5 px-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8ca0b9]">Navigate</p>
            <nav className="space-y-1" aria-label="Service groups">
              <button onClick={() => setActiveGroup("all")} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeGroup === "all" ? "bg-[#e4effd] text-[#0757b7]" : "text-[#617895] hover:bg-white"}`}><span>All services</span><span className="text-xs">{MENU_DATA.reduce((a,g) => a + g.items.length, 0)}</span></button>
              {MENU_DATA.map(group => { const Icon = group.icon; return <button key={group.id} onClick={() => setActiveGroup(group.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${activeGroup === group.id ? "bg-white text-[#0757b7] shadow-sm" : "text-[#617895] hover:bg-white"}`}><Icon size={17}/><span className="flex-1">{group.label}</span><ChevronRight size={15} className={activeGroup === group.id ? "text-[#0757b7]" : "text-[#b0bfd0]"}/></button>})}
            </nav>
            <div className="mt-10 rounded-2xl border border-[#d8e5f3] bg-[#eaf3fd] p-4"><p className="text-sm font-bold text-[#174a83]">Nothing to show yet.</p><p className="mt-1 text-xs leading-5 text-[#6682a2]">Your workspace is ready when you are.</p></div>
          </aside>
          <div className="p-7 md:p-10">
            <div className="mx-auto max-w-[700px]">
              <div className="mb-7 flex items-end justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#6c88a6]">Command centre</p><h1 className="text-[29px] font-bold tracking-[-.05em] text-[#14233d]">Where would you like to go?</h1><p className="mt-2 text-sm text-[#7388a4]">Search a service or use the filters to explore.</p></div><kbd className="hidden rounded-lg border border-[#d5e1ef] bg-white px-2 py-1 text-[11px] font-bold text-[#8094ac] shadow-sm sm:inline">⌘ K</kbd></div>
              <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7390b1]" size={19}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search services" aria-label="Search services" className="h-14 w-full rounded-2xl border border-[#bfd2e8] bg-white pl-12 pr-12 text-sm text-[#14233d] outline-none transition placeholder:text-[#9aacbf] focus:border-[#2272cc] focus:ring-4 focus:ring-[#dcecff]"/>{query && <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#7890ac] hover:bg-[#eef4fa]"><X size={16}/></button>}</div>
              <div className="mt-5 flex flex-wrap gap-2">{[["all","All services"], ...MENU_DATA.map(g => [g.id,g.label])].map(([id,label]) => <button key={id} onClick={() => setActiveGroup(id)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeGroup === id ? "border-[#b7d3f3] bg-[#e5f1ff] text-[#0757b7]" : "border-[#dce5ef] bg-white text-[#7186a0] hover:border-[#b7d3f3]"}`}>{label}</button>)}</div>
              <div className="mt-8">{filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[#cbd9e8] bg-white px-6 py-16 text-center"><div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-[#edf4fc] text-[#5a82ae]"><Search size={19}/></div><h2 className="text-sm font-bold">No matching services</h2><p className="mt-1 text-xs text-[#7890aa]">Try another search or clear the filter.</p></div> : <div className="grid gap-2 sm:grid-cols-2">{filtered.map(({ group, item }) => <button key={`${group.id}-${item[0]}`} onClick={() => setSelected(item[0])} aria-pressed={selected === item[0]} className={`group rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#a9c9eb] hover:shadow-[0_8px_20px_rgba(34,88,143,.08)] ${selected === item[0] ? "border-[#77a9da] ring-2 ring-[#dcebfa]" : "border-[#e1e9f2]"}`}><div className="flex items-start justify-between gap-3"><span className="text-sm font-bold text-[#1c3556] group-hover:text-[#0757b7]">{item[0]}</span>{item[2] && <span className="rounded bg-[#edf3fa] px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#6681a0]">{item[2]}</span>}</div><p className="mt-2 text-xs leading-5 text-[#7b8fa8]">{item[1]}</p><span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7b9bc1] opacity-0 transition group-hover:opacity-100">Open <ArrowUpRight size={12}/></span></button>)}</div>}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}