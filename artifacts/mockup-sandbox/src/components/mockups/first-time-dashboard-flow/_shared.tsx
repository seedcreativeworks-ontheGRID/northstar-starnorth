import React, { useState } from "react";
import { Check, ChevronDown, CircleHelp, FileCheck, FileText, Landmark, LayoutGrid, LockKeyhole, Menu, ShieldCheck } from "lucide-react";

export const blue = "#145aa3";
const groups = [
  { label: "Quick Access", icon: LayoutGrid, items: ["Home", "Accounts Information", "Administration", "Marketplace"] },
  { label: "Payments & Transfers", icon: Landmark, items: ["Account Transfer", "ACH Payments", "Electronic Funds Transfer (EFT)", "EFT Client Returns", "File Transfer Facility (FTF)", "Interac e-Transfer · CA", "Wire Payment", "Zelle · US"] },
  { label: "Cheques", icon: FileCheck, items: ["Northstar DepositEdge", "Digital Cheque Service (DCS)", "Recon Management · US", "Stop Payments", "Cheque Imaging"] },
  { label: "Reports", icon: FileText, items: ["Account transfer reports", "Wire Payment reports", "Electronic Report Delivery (ERD)", "File Transfer Facility (FTF) reports", "Recon Management reports", "ACH reports", "Stop payments reports", "Digital Cheque Services reports"] },
];

export const steps = ["Business profile", "Connect accounts", "Team & approvals", "Review", "Activate"];

export function AppShell({ children, stage = 0, ready = false }: { children: React.ReactNode; stage?: number; ready?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <main className="min-h-[800px] bg-[#f4f7fa] font-['Plus_Jakarta_Sans'] text-[#173451]">
    <header className="flex h-14 items-center justify-between border-b border-[#d7e2eb] bg-[#fbfdff] px-7">
      <div className="flex items-center gap-4">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} className="flex items-center gap-2 rounded-md border border-[#cbdbe8] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#165b9e] outline-none hover:bg-[#eff6fc] focus-visible:ring-2 focus-visible:ring-[#287cc8]"><Menu size={15}/>Menu</button>
        <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-md bg-[#145aa3] text-white"><Landmark size={15}/></span><span className="text-[18px] font-bold tracking-[-.04em]">Northstar</span></div>
        <span className="border-l border-[#d7e2eb] pl-4 text-[11px] font-semibold text-[#7890a4]">Home</span>
      </div>
      <div className="flex items-center gap-4"><button className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5d7b95] outline-none focus-visible:ring-2 focus-visible:ring-[#287cc8]"><CircleHelp size={15}/>Help</button><button aria-label="Open profile" className="grid h-7 w-7 place-items-center rounded-full bg-[#dce9f3] text-[10px] font-bold text-[#145aa3] outline-none focus-visible:ring-2 focus-visible:ring-[#287cc8]">NS</button></div>
      {menuOpen && <div className="absolute left-7 top-12 z-20 grid w-[760px] grid-cols-4 gap-4 rounded-lg border border-[#d5e0e9] bg-white p-5 shadow-[0_12px_26px_rgba(27,59,89,.14)]">
        {groups.map((g) => <section key={g.label}><div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-[#3370a8]"><g.icon size={13}/>{g.label}</div>{g.items.map((item) => <button key={item} className="block py-1 text-left text-[10px] leading-4 text-[#486a85] hover:text-[#145aa3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#287cc8]">{item.replace(" · ", " ")}{item.includes("·") && <span className="ml-1 rounded border border-[#cbdbe8] px-1 text-[8px]">{item.split(" · ")[1]}</span>}</button>)}</section>)}
      </div>}
    </header>
    <div className="flex min-h-[746px]">
      <aside className="w-[218px] shrink-0 border-r border-[#d7e2eb] bg-[#edf3f8] px-3 py-6">
        <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[.16em] text-[#7893aa]">Workspace</p>
        <div className="rounded-md bg-white px-3 py-2.5 text-[12px] font-bold text-[#145aa3] shadow-sm">Home</div>
        <div className="mt-5 px-3 text-[9px] font-bold uppercase tracking-[.16em] text-[#7893aa]">Navigation</div>
        {groups.map((g) => <div key={g.label} className="mt-3 px-3"><div className="flex items-center gap-2 text-[11px] font-semibold text-[#4f718d]"><g.icon size={14}/>{g.label}</div></div>)}
        <div className="mt-8 rounded-lg border border-[#d3e1ec] bg-[#f8fbfd] p-3"><ShieldCheck size={16} className="text-[#2670b6]"/><p className="mt-2 text-[10px] font-bold text-[#355b7b]">Set up with confidence</p><p className="mt-1 text-[10px] leading-4 text-[#7892a7]">Your changes are saved as you progress.</p></div>
      </aside>
      <section className="flex-1 px-10 py-7">{!ready && <SetupTracker stage={stage}/>} {children}</section>
    </div>
  </main>;
}

export function SetupTracker({ stage }: { stage: number }) {
  return <div className="mb-7 flex items-center justify-between border-b border-[#dbe5ed] pb-5">
    <div><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#2872b5]">Workspace setup</p><p className="mt-1 text-[11px] text-[#6b859b]">A few choices to make Home useful for your team.</p></div>
    <ol className="flex items-center gap-0" aria-label="Setup progress">{steps.map((s, i) => <li key={s} className="flex items-center"><span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i < stage ? "bg-[#dceefa] text-[#1763a9]" : i === stage ? "bg-[#145aa3] text-white" : "border border-[#c9d8e4] bg-white text-[#7891a5]"}`}>{i < stage ? <Check size={13}/> : i + 1}</span>{i < 4 && <span className={`mx-1.5 h-px w-8 ${i < stage ? "bg-[#72a9d7]" : "bg-[#d3dfe8]"}`}/>}</li>)}</ol>
  </div>;
}

export function StageHeader({ eyebrow, title, copy, step }: { eyebrow: string; title: string; copy: string; step: string }) {
  return <div className="mb-6 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#3375af]">{eyebrow}</p><h1 className="mt-2 text-[27px] font-bold tracking-[-.045em] text-[#163855]">{title}</h1><p className="mt-2 max-w-[650px] text-[13px] leading-6 text-[#6b849a]">{copy}</p></div><span className="mb-1 text-[10px] font-bold uppercase tracking-[.1em] text-[#7891a5]">{step}</span></div>;
}

export function SecurityNote() { return <div className="flex gap-3 rounded-md border border-[#cfe0ed] bg-[#f0f7fc] px-4 py-3 text-[11px] leading-5 text-[#52738e]"><LockKeyhole size={16} className="mt-0.5 shrink-0 text-[#2169ac]"/><span><b className="text-[#315b7d]">Protected setup.</b> Northstar uses the same safeguards applied to your business banking workspace.</span></div>; }
export const Primary = "rounded-md bg-[#145aa3] px-4 py-2.5 text-[11px] font-bold text-white shadow-[0_3px_8px_rgba(20,90,163,.18)] hover:bg-[#0f4d8e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287cc8]";
export const Secondary = "rounded-md border border-[#c8d8e5] bg-white px-4 py-2.5 text-[11px] font-bold text-[#456984] hover:bg-[#f5f9fc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287cc8]";