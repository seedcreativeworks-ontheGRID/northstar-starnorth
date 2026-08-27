import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  FileCheck,
  FileText,
  Landmark,
  LayoutGrid,
  Menu,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const groups = [
  {
    label: "Quick Access",
    icon: LayoutGrid,
    items: [
      ["Home", "Return to your dashboard overview."],
      ["Accounts Information", "View balances and transaction history."],
      ["Administration", "Manage users, roles, and settings."],
      ["Marketplace", "Discover new banking products and services."],
    ],
  },
  {
    label: "Payments & Transfers",
    icon: Landmark,
    items: [
      ["Account Transfer", "Move funds between your Northstar accounts."],
      ["ACH Payments", "Process bulk domestic payments electronically."],
      ["Electronic Funds Transfer (EFT)", "Send funds securely to domestic vendors."],
      ["EFT Client Returns", "Manage returned and rejected EFT transactions."],
      ["File Transfer Facility (FTF)", "Batch process high-volume payment files."],
      ["Interac e-Transfer", "Send money instantly via email or text in Canada.", "CA"],
      ["Wire Payment", "Execute same-day domestic or international wires."],
      ["Zelle", "Fast, safe, and easy way to send money in the US.", "US"],
    ],
  },
  {
    label: "Cheques",
    icon: FileCheck,
    items: [
      ["Northstar DepositEdge", "Scan and deposit cheques remotely from your office."],
      ["Digital Cheque Service (DCS)", "Manage outsourced cheque printing and mailing."],
      ["Recon Management", "Automate cheque reconciliation and reduce fraud.", "US"],
      ["Stop Payments", "Place, manage, or cancel stop payment requests."],
      ["Cheque Imaging", "View and download copies of cleared cheques."],
    ],
  },
  {
    label: "Reports",
    icon: FileText,
    items: [
      ["Account transfer reports", "Detailed logs of internal account movements."],
      ["Wire Payment reports", "Comprehensive history of incoming and outgoing wires."],
      ["Electronic Report Delivery (ERD)", "Secure distribution of periodic bank statements."],
      ["File Transfer Facility (FTF) reports", "Audit trails for your batch file processing."],
      ["Recon Management reports", "Discrepancy analysis for your cheque accounts."],
      ["ACH reports", "Transaction summaries for ACH batches."],
      ["Stop payments reports", "Status tracking for all stop requests."],
      ["Digital Cheque Services reports", "Analytics on outsourced cheque issuance."],
    ],
  },
];

export function GuidedFirstSteps() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [selected, setSelected] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <main className="min-h-[100dvh] bg-[#f4f7fb] text-[#112d4e] font-sans antialiased">
      <header className="h-[72px] border-b border-[#dce6f1] bg-[#fbfdff] flex items-center justify-between px-8">
        <div className="flex items-center gap-5">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} className="inline-flex items-center gap-2 rounded-md border border-[#c9d9e9] bg-white px-3 py-2 text-sm font-semibold text-[#1455a0] hover:bg-[#eef5fc] focus:outline-none focus:ring-2 focus:ring-[#3a88dc]">
            <Menu size={16} /> Menu
          </button>
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#1455a0] text-white shadow-[0_4px_10px_rgba(20,85,160,.2)]"><Landmark size={17} /></span>
            <span className="text-[20px] font-bold tracking-[-.04em]">Northstar</span>
          </div>
        </div>
        <button aria-label="Open profile menu" className="grid h-9 w-9 place-items-center rounded-full bg-[#d8e5f2] text-xs font-bold text-[#1455a0] hover:bg-[#c9dced] focus:outline-none focus:ring-2 focus:ring-[#3a88dc]">NT</button>
      </header>

      <div className="mx-auto flex max-w-[1280px] min-h-[728px]">
        {menuOpen && <aside className="w-[270px] shrink-0 border-r border-[#dce6f1] bg-[#edf3f9] px-4 py-7">
          <div className="mb-5 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#7190ad]">Workspace navigation</div>
          <nav className="space-y-1.5" aria-label="Northstar services">
            {groups.map((group, index) => {
              const Icon = group.icon;
              const active = index === activeGroup;
              return <button key={group.label} onClick={() => setActiveGroup(index)} className={`group flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#3a88dc] ${active ? "bg-white text-[#1455a0] shadow-[0_3px_10px_rgba(38,79,119,.07)]" : "text-[#52708d] hover:bg-[#e3edf7]"}`}>
                <span className="flex items-center gap-3"><Icon size={17} className={active ? "text-[#1c6ac4]" : "text-[#86a2bb]"} /><span className="text-[13px] font-semibold">{group.label}</span></span>
                <ChevronRight size={15} className={active ? "text-[#1c6ac4]" : "text-[#9eb3c7]"} />
              </button>;
            })}
          </nav>
          <div className="mt-10 rounded-xl border border-[#d5e3ef] bg-[#f8fbfe] p-4">
            <ShieldCheck size={18} className="mb-3 text-[#1c6ac4]" />
            <p className="text-[12px] font-bold text-[#244766]">Your workspace is ready when you are.</p>
            <p className="mt-1.5 text-[11px] leading-5 text-[#7490a9]">Services stay here whenever you need them.</p>
          </div>
        </aside>}

        <section className="flex-1 px-10 py-9">
          <div className="mx-auto max-w-[820px]">
            <div className="mb-9 flex items-start justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#3b78b3]"><Sparkles size={14} /> A clear place to begin</div>
                <h1 className="text-[34px] font-bold leading-tight tracking-[-.045em] text-[#123456]">Welcome to your Northstar workspace.</h1>
                <p className="mt-3 max-w-[610px] text-[15px] leading-7 text-[#67829d]">Choose a service below to explore what your team can do. There is nothing to set up on this page, and no information is waiting for you yet.</p>
              </div>
              <div className="hidden rounded-full border border-[#d5e4f0] bg-[#f9fcff] px-3 py-1.5 text-[11px] font-semibold text-[#6f8ba5] sm:block">New workspace</div>
            </div>

            <div className="grid grid-cols-[1.12fr_.88fr] gap-5">
              <div className="rounded-2xl border border-[#d9e5ef] bg-white p-6 shadow-[0_10px_28px_rgba(33,71,108,.06)]">
                <div className="mb-6 flex items-center justify-between">
                  <div><p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#7793ad]">Start with a service</p><h2 className="mt-1 text-[19px] font-bold text-[#173b5d]">{groups[activeGroup].label}</h2></div>
                  <span className="rounded-md bg-[#e9f2fb] px-2 py-1 text-[10px] font-bold text-[#266bb1]">{groups[activeGroup].items.length} services</span>
                </div>
                <div className="space-y-1">
                  {groups[activeGroup].items.map(([name, description, badge]) => <button key={name} onClick={() => setSelected(name)} className={`flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#3a88dc] ${selected === name ? "bg-[#eff6fd]" : "hover:bg-[#f5f9fc]"}`}>
                    <span className="min-w-0"><span className="flex items-center gap-2 text-[13px] font-semibold text-[#244766]">{name}{badge && <span className="rounded border border-[#cbdceb] bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#6585a2]">{badge}</span>}</span><span className="mt-1 block truncate pr-4 text-[11px] text-[#829ab0]">{description}</span></span>
                    <ArrowRight size={15} className={selected === name ? "shrink-0 text-[#1c6ac4]" : "shrink-0 text-[#b3c5d5]"} />
                  </button>)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#cfe0ef] bg-[#eaf3fb] p-6">
                <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1455a0] text-white shadow-[0_8px_15px_rgba(20,85,160,.18)]"><Check size={21} /></div>
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#4a7ba9]">Selected service</p>
                <h2 className="mt-2 text-[24px] font-bold leading-tight tracking-[-.035em] text-[#123456]">{selected}</h2>
                <p className="mt-3 text-[13px] leading-6 text-[#6685a2]">Explore this Northstar capability whenever your organization is ready.</p>
                <button onClick={() => alert(`Opening ${selected}`)} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#1455a0] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_5px_12px_rgba(20,85,160,.18)] hover:bg-[#0e4789] focus:outline-none focus:ring-2 focus:ring-[#3a88dc]">Open service <ArrowRight size={14} /></button>
              </div>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-[#4d78a0] hover:text-[#1455a0] focus:outline-none focus:ring-2 focus:ring-[#3a88dc] rounded">{menuOpen ? "Hide" : "Show"} full navigation <ChevronDown size={14} className={menuOpen ? "rotate-180" : ""} /></button>
          </div>
        </section>
      </div>
    </main>
  );
}