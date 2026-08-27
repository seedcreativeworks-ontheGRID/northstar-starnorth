import { useState } from "react";
import { ArrowUpRight, ChevronRight, FileCheck2, FileText, Grid2X2, Landmark, Menu, ShieldCheck, Sparkles } from "lucide-react";

type Item = { name: string; description: string; badge?: string };
type Group = { id: string; label: string; icon: typeof Grid2X2; items: Item[] };

const groups: Group[] = [
  { id: "quick", label: "Quick Access", icon: Grid2X2, items: [
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
  { id: "cheques", label: "Cheques", icon: FileCheck2, items: [
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

export function NavigationRailWorkspace() {
  const [active, setActive] = useState("quick");
  const [menuOpen, setMenuOpen] = useState(true);
  const group = groups.find((entry) => entry.id === active) ?? groups[0];
  const Icon = group.icon;
  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#12243b] font-['Plus_Jakarta_Sans',sans-serif]">
      <header className="h-[72px] bg-[#092747] px-8 flex items-center justify-between text-white">
        <div className="flex items-center gap-8">
          <button aria-label="Toggle navigation" onClick={() => setMenuOpen((value) => !value)} className="flex items-center gap-2 text-sm font-semibold rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64d3c5]">
            <Menu size={17} /> Menu
          </button>
          <div className="h-7 w-px bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-[#2c86d8] grid place-items-center"><Landmark size={17} /></div>
            <span className="text-[19px] tracking-[-0.04em] font-bold">Northstar</span>
          </div>
        </div>
        <button aria-label="Open account menu" className="h-9 w-9 rounded-full bg-[#1c4066] border border-[#5280a8] grid place-items-center text-xs font-bold hover:bg-[#2c567e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64d3c5]">NS</button>
      </header>
      <div className="flex min-h-[calc(100vh-72px)]">
        {menuOpen && <aside className="w-[286px] shrink-0 bg-[#eaf1f8] border-r border-[#d5e0eb] px-5 py-7">
          <div className="px-3 mb-5 flex items-center justify-between">
            <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#61738a]">Workspace</span>
            <span className="text-[10px] rounded bg-[#d7e5f2] text-[#48617b] px-2 py-1">4 areas</span>
          </div>
          <nav aria-label="Service areas" className="space-y-1">
            {groups.map((entry) => {
              const GroupIcon = entry.icon;
              const selected = entry.id === active;
              return <button key={entry.id} onClick={() => setActive(entry.id)} aria-current={selected ? "page" : undefined} className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1674c5] ${selected ? "bg-white text-[#075ca8] shadow-[0_4px_14px_rgba(25,65,105,.09)]" : "text-[#536b84] hover:bg-white/70"}`}>
                <GroupIcon size={18} strokeWidth={selected ? 2.2 : 1.8} />
                <span className="text-[13px] font-semibold flex-1">{entry.label}</span>
                <span className={`text-[10px] font-bold ${selected ? "text-[#1674c5]" : "text-[#8294a8]"}`}>{entry.items.length}</span>
                <ChevronRight size={14} className={`transition-transform duration-200 ${selected ? "translate-x-0 text-[#1674c5]" : "-translate-x-1 opacity-40"}`} />
              </button>;
            })}
          </nav>
          <div className="mt-12 rounded-xl bg-[#dce9f4] p-4 border border-[#cbddea]">
            <ShieldCheck size={18} className="text-[#1674c5] mb-3" />
            <p className="text-[12px] font-bold mb-1">Built for controlled access</p>
            <p className="text-[11px] leading-5 text-[#61758c]">Your services stay organized by role and region.</p>
          </div>
        </aside>}
        <section className="flex-1 px-12 py-11">
          <div className="max-w-[820px]">
            <div className="flex items-start justify-between gap-5 mb-12">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#4d81aa] mb-4">Your workspace</p>
                <h1 className="text-[34px] leading-tight tracking-[-0.05em] font-semibold text-[#102a46]">A clear place to begin.</h1>
                <p className="mt-3 text-[14px] text-[#688098] max-w-[490px] leading-6">Choose a service from the navigation rail when you’re ready. Your operating view will take shape as you work.</p>
              </div>
              <div className="rounded-full bg-[#d8f0ed] text-[#13756f] text-[11px] font-bold px-3 py-2 whitespace-nowrap">Ready when you are</div>
            </div>
            <div className="border-t border-[#d7e1eb] pt-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-lg bg-[#dcecf8] text-[#1674c5] grid place-items-center"><Icon size={18} /></div>
                <div><h2 className="font-semibold text-[16px]">{group.label}</h2><p className="text-[12px] text-[#8091a4]">Services available to your team</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {group.items.slice(0, 4).map((item) => <button key={item.name} onClick={() => undefined} className="group text-left rounded-xl border border-[#dce5ed] bg-white p-4 hover:border-[#8db9da] hover:shadow-[0_7px_20px_rgba(25,65,105,.07)] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1674c5]">
                  <div className="flex items-center gap-2"><span className="text-[13px] font-bold group-hover:text-[#096bb9]">{item.name}</span>{item.badge && <span className="text-[9px] font-bold bg-[#edf2f7] text-[#63788d] rounded px-1.5 py-0.5">{item.badge}</span>}<ArrowUpRight size={14} className="ml-auto text-[#a2b2c1] group-hover:text-[#1674c5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
                  <p className="text-[11px] text-[#8294a6] leading-5 mt-2">{item.description}</p>
                </button>)}
              </div>
              <div className="mt-8 flex items-center gap-2 text-[11px] text-[#8091a4]"><Sparkles size={14} className="text-[#2d9e9a]" /> No activity to display yet. Start with any service above.</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}