import React, { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight, FileCheck, FileText, Landmark, LayoutGrid, Menu, Search, Sparkles } from "lucide-react";

type Group = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { name: string; description: string; badge?: string }[];
};

const groups: Group[] = [
  { id: "quick-access", label: "Quick Access", icon: LayoutGrid, items: [
    { name: "Home", description: "Return to your dashboard overview." },
    { name: "Accounts Information", description: "View balances and transaction history." },
    { name: "Administration", description: "Manage users, roles, and settings." },
    { name: "Marketplace", description: "Discover new banking products and services." },
  ]},
  { id: "payments", label: "Payments & Transfers", icon: Landmark, items: [
    { name: "Account Transfer", description: "Move funds between your Northstar accounts." },
    { name: "ACH Payments", description: "Process bulk domestic payments electronically." },
    { name: "Electronic Funds Transfer (EFT)", description: "Send funds securely to domestic vendors." },
    { name: "EFT Client Returns", description: "Manage returned and rejected EFT transactions." },
    { name: "File Transfer Facility (FTF)", description: "Batch process high-volume payment files." },
    { name: "Interac e-Transfer", badge: "CA", description: "Send money instantly via email or text in Canada." },
    { name: "Wire Payment", description: "Execute same-day domestic or international wires." },
    { name: "Zelle", badge: "US", description: "Fast, safe, and easy way to send money in the US." },
  ]},
  { id: "cheques", label: "Cheques", icon: FileCheck, items: [
    { name: "Northstar DepositEdge", description: "Scan and deposit cheques remotely from your office." },
    { name: "Digital Cheque Service (DCS)", description: "Manage outsourced cheque printing and mailing." },
    { name: "Recon Management", badge: "US", description: "Automate cheque reconciliation and reduce fraud." },
    { name: "Stop Payments", description: "Place, manage, or cancel stop payment requests." },
    { name: "Cheque Imaging", description: "View and download copies of cleared cheques." },
  ]},
  { id: "reports", label: "Reports", icon: FileText, items: [
    { name: "Account transfer reports", description: "Detailed logs of internal account movements." },
    { name: "Wire Payment reports", description: "Comprehensive history of incoming and outgoing wires." },
    { name: "Electronic Report Delivery (ERD)", description: "Secure distribution of periodic bank statements." },
    { name: "File Transfer Facility (FTF) reports", description: "Audit trails for your batch file processing." },
    { name: "Recon Management reports", description: "Discrepancy analysis for your cheque accounts." },
    { name: "ACH reports", description: "Transaction summaries for ACH batches." },
    { name: "Stop payments reports", description: "Status tracking for all stop requests." },
    { name: "Digital Cheque Services reports", description: "Analytics on outsourced cheque issuance." },
  ]},
];

export function ServiceLaunchpad() {
  const [active, setActive] = useState("payments");
  const [query, setQuery] = useState("");
  const activeGroup = groups.find((group) => group.id === active) ?? groups[1];
  const visibleItems = activeGroup.items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="min-h-[100dvh] bg-[#f5f8fc] text-[#17304d] font-['Plus_Jakarta_Sans']" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header className="flex h-[72px] items-center justify-between border-b border-[#dce7f2] bg-[#fbfdff] px-8">
        <div className="flex items-center gap-7">
          <button aria-label="Open navigation menu" className="flex items-center gap-2 rounded-lg border border-[#d4e2ef] bg-white px-3.5 py-2 text-sm font-semibold text-[#1558a6] shadow-[0_2px_8px_rgba(28,70,112,.05)] transition hover:border-[#1558a6] focus:outline-none focus:ring-2 focus:ring-[#8bc8ff]">
            <Menu className="h-4 w-4" /> Menu
          </button>
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0d5da8] text-white shadow-[0_6px_14px_rgba(13,93,168,.2)]"><Landmark className="h-5 w-5" /></div>
            <span className="text-[21px] font-bold tracking-[-.04em]">Northstar</span>
          </div>
        </div>
        <button aria-label="Open account menu" className="grid h-9 w-9 place-items-center rounded-full border border-[#b8d2e9] bg-[#e6f1fb] text-xs font-bold text-[#1558a6] transition hover:bg-[#d8ebfb] focus:outline-none focus:ring-2 focus:ring-[#8bc8ff]">NS</button>
      </header>

      <section className="mx-auto max-w-[1160px] px-8 pb-16 pt-14">
        <div className="flex items-end justify-between gap-8">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.17em] text-[#4d83b6]"><Sparkles className="h-4 w-4" /> Your workspace, ready when you are</div>
            <h1 className="max-w-[600px] text-[42px] font-semibold leading-[1.08] tracking-[-.055em] text-[#17304d]">Start with the service<br />your team needs.</h1>
            <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-[#647d97]">Northstar brings everyday banking operations into one clear place. Choose a service below to get moving.</p>
          </div>
          <label className="mb-1 flex w-[246px] items-center gap-2 rounded-xl border border-[#d5e3ef] bg-white px-3.5 py-3 text-sm text-[#7890a8] shadow-sm">
            <Search className="h-4 w-4 shrink-0" /><span className="sr-only">Search services</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a service" className="w-full bg-transparent outline-none placeholder:text-[#91a6bb]" />
            <kbd className="rounded border border-[#e1eaf2] px-1.5 py-0.5 text-[10px]">/</kbd>
          </label>
        </div>

        <div className="mt-12 grid grid-cols-[250px_1fr] gap-10">
          <nav aria-label="Service categories" className="border-r border-[#dce7f2] pr-7">
            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[.16em] text-[#8aa1b7]">Explore services</p>
            <div className="space-y-1.5">
              {groups.map((group) => {
                const Icon = group.icon;
                const selected = group.id === active;
                return <button key={group.id} onClick={() => setActive(group.id)} aria-current={selected ? "page" : undefined} className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[13px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#8bc8ff] ${selected ? "bg-[#e4f1fc] text-[#0d5da8]" : "text-[#607991] hover:bg-[#edf4fa] hover:text-[#17304d]"}`}>
                  <span className="flex items-center gap-3"><Icon className={`h-[18px] w-[18px] ${selected ? "text-[#0d70c7]" : "text-[#8ca6be]"}`} />{group.label}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${selected ? "translate-x-0 text-[#0d70c7]" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`} />
                </button>;
              })}
            </div>
            <div className="mt-16 rounded-xl border border-[#dbe8f3] bg-[#edf5fb] p-4">
              <p className="text-xs font-bold text-[#315c82]">Need a hand?</p>
              <p className="mt-1.5 text-[11px] leading-5 text-[#6c879f]">Visit Support Center for answers and guidance.</p>
              <button className="mt-3 flex items-center gap-1 text-xs font-bold text-[#0d5da8] focus:outline-none focus:underline">Visit Support Center <ArrowUpRight className="h-3.5 w-3.5" /></button>
            </div>
          </nav>
          <section aria-labelledby="service-heading">
            <div className="mb-6 flex items-center justify-between border-b border-[#dce7f2] pb-5">
              <div><p className="text-xs font-bold uppercase tracking-[.15em] text-[#8aa1b7]">{String(activeGroup.items.length).padStart(2, "0")} services</p><h2 id="service-heading" className="mt-1 text-[25px] font-semibold tracking-[-.04em]">{activeGroup.label}</h2></div>
              <button aria-label="Collapse service list" className="rounded-lg p-2 text-[#7792aa] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#8bc8ff]"><ChevronDown className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {visibleItems.map((item) => <button key={item.name} className="group min-h-[108px] rounded-xl border border-[#dce7f2] bg-[#fbfdff] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#86b9e4] hover:bg-white hover:shadow-[0_8px_24px_rgba(30,84,133,.09)] focus:outline-none focus:ring-2 focus:ring-[#8bc8ff]">
                <span className="flex items-center gap-2 text-[13px] font-bold text-[#244665] group-hover:text-[#0d5da8]">{item.name}{item.badge && <span className="rounded bg-[#eaf2f8] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-[#64839f]">{item.badge}</span>}<ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition group-hover:opacity-100" /></span>
                <span className="mt-2 block max-w-[290px] text-[12px] leading-5 text-[#7890a8]">{item.description}</span>
              </button>)}
            </div>
            {visibleItems.length === 0 && <p className="rounded-xl border border-dashed border-[#b9cfe1] p-8 text-center text-sm text-[#7890a8]">No services match “{query}”.</p>}
          </section>
        </div>
      </section>
    </main>
  );
}