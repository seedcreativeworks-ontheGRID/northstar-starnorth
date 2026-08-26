import { FormEvent, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Command,
  FileClock,
  LifeBuoy,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import "./_group.css";

type Destination = "home" | "help" | "service" | "insights";

const commands = [
  { id: "help", title: "Help & Support", detail: "Guides, walkthroughs and product answers", icon: CircleHelp, group: "Guidance" },
  { id: "service", title: "Support Centre", detail: "Manage requests and service administration", icon: LifeBuoy, group: "Service" },
  { id: "insights", title: "Business Insights", detail: "Explore this account's signals with Insight Assistant", icon: Sparkles, group: "Intelligence" },
  { id: "payroll", title: "Review payroll funding", detail: "Payroll requires a funding decision by 16:00", icon: FileClock, group: "Operations" },
];

function insightReply(question: string) {
  const phrase = question.toLowerCase();
  if (phrase.includes("payroll") || phrase.includes("fund")) return "Payroll is scheduled for tomorrow. Current available balance is $117,920 CAD against $129,493 CAD required. A funding transfer of $11,573 CAD will cover the shortfall.";
  if (phrase.includes("vendor") || phrase.includes("spend")) return "Cloud services spend is 23% above its three-month baseline. The increase is concentrated in AWS compute usage and is projected to reach $15,200 this month.";
  if (phrase.includes("approval") || phrase.includes("payment")) return "One wire payment for $42,500 is awaiting dual approval. The release window closes at 14:30 today.";
  return "I can help interpret balances, approvals, payroll funding, and vendor spend for this account. Try asking about a specific operational signal.";
}

export function OperationsCommand() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [destination, setDestination] = useState<Destination>("home");
  const [query, setQuery] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const results = useMemo(() => commands.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const selectCommand = (id: string) => {
    if (id === "payroll") {
      setDestination("home");
      setOpen(false);
      return;
    }
    setDestination(id as Destination);
    setQuery("");
  };

  const submitQuestion = (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    setAnswer(insightReply(question));
    setQuestion("");
  };

  return (
    <div className="northstar-utility-ia min-h-[360px] overflow-hidden bg-[#f5f8fc] text-[#111b31]">
      <header className="flex h-[59px] items-center border-b border-[#dce5f0] bg-[#fbfcfe] px-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-[#111b31] text-[10px] font-bold tracking-tight text-white">N</div>
          <span className="text-[13px] font-bold tracking-[-0.02em]">Northstar</span>
          <span className="hidden border-l border-[#dce5f0] pl-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#63738e] sm:block">Treasury</span>
        </div>
        <nav aria-label="Primary navigation" className="ml-8 hidden items-center gap-5 text-[11px] font-medium text-[#63738e] md:flex">
          <span>Overview</span><span>Accounts</span><span>Payments</span><span>Reports</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button type="button" aria-label="Notifications, 2 unread" aria-expanded={notifications} onClick={() => { setNotifications(!notifications); setOpen(false); }} className="relative grid h-8 w-8 place-items-center rounded-md text-[#41516a] transition hover:bg-[#eaf1f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]">
              <Bell className="h-4 w-4" />
              <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-[#d64148] ring-2 ring-[#fbfcfe]" />
            </button>
            {notifications && <div className="absolute right-0 top-10 z-30 w-56 rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_12px_30px_rgba(17,27,49,0.14)]"><p className="text-[11px] font-bold">2 notifications</p><p className="mt-2 border-t border-[#edf1f6] pt-2 text-[10px] leading-4 text-[#63738e]">Payroll funding needs review before 16:00.</p></div>}
          </div>
          <button type="button" aria-expanded={open} aria-controls="operations-command" onClick={() => { setOpen(!open); setNotifications(false); }} className={`flex h-8 items-center gap-2 rounded-md border px-3 text-[11px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8] ${open ? "border-[#0067d8] bg-[#eaf3ff] text-[#005cbd]" : "border-[#cbd8e7] bg-white text-[#233653] hover:border-[#0067d8]"}`}>
            <Command className="h-3.5 w-3.5" /><span>Operations command</span><span className="rounded border border-[#dce5f0] bg-[#f7f9fc] px-1 text-[9px] font-medium text-[#63738e]">Ctrl K</span>
          </button>
        </div>
      </header>

      <main className="relative px-5 py-5">
        <div className="flex items-start justify-between">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#63738e]">Operating account</p><h1 className="mt-1 text-[19px] font-bold tracking-[-0.045em]">Good morning, Ben</h1></div>
          <div className="rounded-md border border-[#dce5f0] bg-white px-3 py-2 text-right"><p className="text-[9px] font-semibold uppercase tracking-wider text-[#63738e]">Available balance</p><p className="mt-0.5 text-[14px] font-bold">$117,920 <span className="text-[9px] text-[#63738e]">CAD</span></p></div>
        </div>
        <div className="mt-5 grid grid-cols-[1.35fr_1fr] gap-3">
          <section className="rounded-lg border border-[#dce5f0] bg-white p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-bold">Today&apos;s priority</span><span className="rounded bg-[#fff3e3] px-1.5 py-0.5 text-[8px] font-bold text-[#985900]">ACTION REQUIRED</span></div><p className="mt-2 text-[11px] font-semibold">Fund tomorrow&apos;s payroll</p><p className="mt-1 text-[9px] text-[#63738e]">Shortfall of $11,573 CAD</p></section>
          <section className="rounded-lg border border-[#dce5f0] bg-[#edf5ff] p-3"><div className="flex items-center gap-1.5 text-[#0067d8]"><Sparkles className="h-3.5 w-3.5" /><span className="text-[9px] font-bold">INSIGHT</span></div><p className="mt-2 text-[10px] font-semibold leading-4">Cloud spend is trending above baseline.</p></section>
        </div>
      </main>

      {open && <div id="operations-command" role="dialog" aria-modal="true" aria-label="Operations command centre" className="absolute inset-x-0 top-[59px] z-20 mx-auto w-[min(542px,calc(100%-28px))] rounded-b-xl border border-t-0 border-[#cad8e7] bg-[#fbfcfe] shadow-[0_18px_40px_rgba(17,27,49,0.2)]">
        <div className="flex items-center gap-2 border-b border-[#dce5f0] px-4 py-3"><Search className="h-4 w-4 text-[#63738e]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search commands, guidance, and service..." aria-label="Search operations command" className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#8491a5]" /><button onClick={() => setOpen(false)} aria-label="Close operations command" className="rounded p-1 text-[#63738e] hover:bg-[#eaf1f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]"><X className="h-4 w-4" /></button></div>
        {destination === "home" ? <div className="p-2">
          <p className="px-2 pb-1 pt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#7c8aa0]">Route a task</p>
          {results.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => selectCommand(item.id)} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-[#eaf3ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]"><span className="grid h-7 w-7 place-items-center rounded-md bg-[#edf3fa] text-[#0067d8]"><Icon className="h-3.5 w-3.5" /></span><span className="min-w-0 flex-1"><span className="block text-[11px] font-bold">{item.title}</span><span className="block truncate text-[9px] text-[#63738e]">{item.detail}</span></span><ChevronRight className="h-3.5 w-3.5 text-[#8491a5]" /></button>; })}
          {!results.length && <p className="px-2 py-6 text-center text-[11px] text-[#63738e]">No command found. Try “support” or “payroll”.</p>}
          <div className="mt-1 flex items-center gap-2 border-t border-[#dce5f0] px-2 pt-2 text-[9px] text-[#63738e]"><Building2 className="h-3 w-3" /> One place to start. Each destination retains a distinct job.</div>
        </div> : destination === "help" ? <Destination title="Help & Support" subtitle="Self-serve guidance" icon={<BookOpen className="h-4 w-4" />} onBack={() => setDestination("home")}><p className="text-[11px] font-semibold">How can we help?</p><div className="mt-3 grid grid-cols-2 gap-2">{["Make a payment","Set up approvals","Manage users","Download reports"].map((label) => <button key={label} className="rounded-md border border-[#dce5f0] bg-white p-2 text-left text-[10px] font-semibold hover:border-[#0067d8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]">{label}</button>)}</div></Destination> : destination === "service" ? <Destination title="Support Centre" subtitle="Service administration" icon={<LifeBuoy className="h-4 w-4" />} onBack={() => setDestination("home")}><div className="rounded-md bg-[#fff5e8] p-2.5"><p className="text-[10px] font-bold">1 request needs your attention</p><p className="mt-1 text-[9px] text-[#7b5a20]">Review implementation document for account access.</p></div><button className="mt-3 flex w-full items-center justify-between rounded-md border border-[#dce5f0] bg-white p-2 text-[10px] font-bold hover:border-[#0067d8]">Manage support requests <ChevronRight className="h-3.5 w-3.5" /></button></Destination> : <Destination title="Business Insights" subtitle="Contextual account intelligence" icon={<Sparkles className="h-4 w-4" />} onBack={() => setDestination("home")}><div className="rounded-md border-l-2 border-[#0067d8] bg-[#edf5ff] p-2.5"><p className="text-[10px] font-bold">Payroll funding is time-sensitive</p><p className="mt-1 text-[9px] leading-4 text-[#536987]">Ask Insight Assistant about this account. It provides analysis, not human support.</p></div>{answer && <div className="mt-2 rounded-md bg-[#111b31] p-2.5 text-[9px] leading-4 text-white">{answer}</div>}<form onSubmit={submitQuestion} className="mt-2 flex gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about payroll, approvals or spend..." aria-label="Ask Insight Assistant" className="h-8 min-w-0 flex-1 rounded-md border border-[#cbd8e7] bg-white px-2 text-[10px] outline-none focus:border-[#0067d8] focus:ring-2 focus:ring-[#b9d8ff]" /><button aria-label="Send question to Insight Assistant" className="grid h-8 w-8 place-items-center rounded-md bg-[#0067d8] text-white hover:bg-[#005cbd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"><Send className="h-3.5 w-3.5" /></button></form></Destination>}
      </div>}
    </div>
  );
}

function Destination({ title, subtitle, icon, onBack, children }: { title: string; subtitle: string; icon: React.ReactNode; onBack: () => void; children: React.ReactNode }) {
  return <div className="p-4"><button onClick={onBack} className="mb-3 flex items-center gap-1 text-[10px] font-bold text-[#0067d8] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]">Back to commands</button><div className="mb-3 flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-md bg-[#eaf3ff] text-[#0067d8]">{icon}</span><div><h2 className="text-[12px] font-bold">{title}</h2><p className="text-[9px] text-[#63738e]">{subtitle}</p></div></div>{children}</div>;
}