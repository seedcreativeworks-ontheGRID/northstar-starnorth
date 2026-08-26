import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Landmark,
  MessageSquareText,
  PanelRightClose,
  PanelRightOpen,
  Send,
  Sparkles,
  TicketCheck,
  X,
} from "lucide-react";
import "./_group.css";

type DockView = "closed" | "help" | "service" | "tickets";
type ChatMessage = { role: "user" | "insight"; text: string };

const intelligenceReply = (message: string) => {
  const input = message.toLowerCase();
  if (input.includes("payroll") || input.includes("shortfall")) {
    return "Payroll needs $129,493 available by 16:00 tomorrow. Current projected gap: $18,740. I can prepare a funding transfer for review.";
  }
  if (input.includes("vendor") || input.includes("spend") || input.includes("aws")) {
    return "AWS Services is 23% above its three-month baseline. The increase began after the July 8 renewal; projected monthly run rate is $15,200.";
  }
  if (input.includes("payment") || input.includes("approval") || input.includes("wire")) {
    return "One wire payment for $42,500 awaits dual approval. It is scheduled for release at 14:30; the second approver has not yet been notified.";
  }
  return "I can analyse payroll coverage, approval queues, or vendor spend from this workspace. Ask about one of those operational signals.";
};

export function SupportDock() {
  const [dockView, setDockView] = useState<DockView>("closed");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ticketSent, setTicketSent] = useState(false);

  const dockTitle = useMemo(() => {
    if (dockView === "service") return "Service operations";
    if (dockView === "tickets") return "Support Centre";
    return "Help & support";
  }, [dockView]);

  const openDock = (view: Exclude<DockView, "closed">) => {
    setDockView((current) => (current === view ? "closed" : view));
    setNotificationsOpen(false);
    setChatOpen(false);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }, { role: "insight", text: intelligenceReply(trimmed) }]);
    setMessage("");
  };

  return (
    <main className="northstar-utility-ia min-h-[360px] w-full overflow-hidden bg-[#f4f7fb] text-[#111b31]">
      <header className="border-b border-[#dce5f0] bg-[#fbfcfe]">
        <div className="flex h-[45px] items-center px-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#111b31] text-[11px] font-bold tracking-[-0.08em] text-white">N</div>
            <span className="text-[13px] font-bold tracking-[-0.03em]">northstar</span>
            <span className="h-4 w-px bg-[#dce5f0]" />
            <span className="text-[10px] font-medium text-[#63738e]">Hawthorne &amp; Co.</span>
          </div>
          <nav aria-label="Primary navigation" className="ml-8 flex items-center gap-5 text-[10px] font-semibold text-[#63738e]">
            <button type="button" className="text-[#0067d8]">Overview</button>
            <button type="button">Payments</button>
            <button type="button">Accounts</button>
          </nav>
          <div className="relative ml-auto">
            <button
              type="button"
              aria-label="Notifications, 2 unread"
              aria-expanded={notificationsOpen}
              aria-controls="dock-notifications"
              onClick={() => { setNotificationsOpen((open) => !open); setDockView("closed"); setChatOpen(false); }}
              className="relative grid h-7 w-7 place-items-center rounded-md text-[#41516c] transition hover:bg-[#eaf1f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"
            >
              <Bell className="h-4 w-4" strokeWidth={1.9} />
              <span className="absolute right-[5px] top-[4px] h-1.5 w-1.5 rounded-full border border-[#fbfcfe] bg-[#dc3545]" />
            </button>
            {notificationsOpen && (
              <section id="dock-notifications" aria-label="Notifications" className="absolute right-0 top-9 z-30 w-[220px] rounded-lg border border-[#dce5f0] bg-white p-2 shadow-[0_12px_28px_rgba(17,27,49,.16)]">
                <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#63738e]">Notifications</p>
                <button type="button" className="w-full rounded-md p-2 text-left hover:bg-[#f4f7fb]">
                  <span className="block text-[10px] font-bold">Payroll funding required</span>
                  <span className="mt-0.5 block text-[9px] leading-3 text-[#63738e]">Review tomorrow&apos;s $18,740 funding gap.</span>
                </button>
                <button type="button" className="w-full rounded-md p-2 text-left hover:bg-[#f4f7fb]">
                  <span className="block text-[10px] font-bold">Report ready</span>
                  <span className="mt-0.5 block text-[9px] leading-3 text-[#63738e]">July transfer activity is available.</span>
                </button>
              </section>
            )}
          </div>
        </div>
        <div className="flex h-[34px] items-center border-t border-[#edf1f6] px-4">
          <p className="text-[10px] font-semibold text-[#111b31]">Operations overview <span className="ml-2 font-normal text-[#63738e]">Tuesday, 15 July</span></p>
          <button
            type="button"
            onClick={() => { setChatOpen((open) => !open); setDockView("closed"); setNotificationsOpen(false); }}
            aria-expanded={chatOpen}
            aria-controls="insight-context"
            className="ml-auto flex items-center gap-1.5 rounded-md border border-[#b9d7f5] bg-[#eff7ff] px-2 py-1 text-[9px] font-bold text-[#0067d8] transition hover:bg-[#e3f1ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"
          >
            <Sparkles className="h-3 w-3" /> Business Insights <span className="rounded-full bg-[#0067d8] px-1 text-[8px] text-white">3</span>
          </button>
        </div>
      </header>

      <div className="relative flex h-[281px]">
        <section className="min-w-0 flex-1 p-4 pr-14">
          <div className="mb-3 flex items-end justify-between">
            <div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#63738e]">Liquidity</p><h1 className="mt-0.5 text-[16px] font-bold tracking-[-.04em]">Today&apos;s position</h1></div>
            <button type="button" className="text-[9px] font-bold text-[#0067d8]">View accounts <ChevronRight className="inline h-3 w-3" /></button>
          </div>
          <div className="grid grid-cols-[1.18fr_.82fr] gap-3">
            <article className="rounded-lg border border-[#dce5f0] bg-white p-3">
              <p className="text-[9px] font-semibold text-[#63738e]">Operating balance</p>
              <p className="mt-1 text-[20px] font-bold tracking-[-.06em]">$348,226<span className="ml-1 text-[10px] font-semibold text-[#63738e]">CAD</span></p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8eef6]"><div className="h-full w-[72%] rounded-full bg-[#0067d8]" /></div>
              <p className="mt-1.5 text-[8px] text-[#63738e]">72% of 30-day operating target</p>
            </article>
            <article className="rounded-lg border border-[#eed6b0] bg-[#fffaf0] p-3">
              <p className="text-[9px] font-semibold text-[#9a6410]">Attention needed</p>
              <p className="mt-1 text-[11px] font-bold leading-4">Payroll coverage gap</p>
              <p className="mt-1 text-[9px] leading-3 text-[#63738e]">$18,740 before tomorrow, 16:00</p>
              <button type="button" className="mt-2 text-[9px] font-bold text-[#0067d8]">Review funding</button>
            </article>
          </div>
          <div className="mt-3 rounded-lg border border-[#dce5f0] bg-white p-3">
            <p className="text-[9px] font-bold text-[#111b31]">Payment queue <span className="ml-2 font-normal text-[#63738e]">4 items scheduled today</span></p>
            <div className="mt-2 flex items-center justify-between text-[9px]"><span>Wire · Contract Supplier</span><span className="font-bold">$42,500 · Awaiting approval</span></div>
          </div>
        </section>

        {chatOpen && (
          <aside id="insight-context" aria-label="Business Insights contextual assistant" className="absolute right-11 top-0 z-20 flex h-full w-[255px] flex-col border-l border-[#c9dbe9] bg-[#f8fbff] shadow-[-10px_0_22px_rgba(17,27,49,.1)]">
            <div className="flex items-center justify-between border-b border-[#dce5f0] px-3 py-2">
              <div className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-[#0067d8]" /><span className="text-[10px] font-bold">Business Insights</span></div>
              <button type="button" onClick={() => setChatOpen(false)} aria-label="Close Business Insights" className="rounded p-0.5 hover:bg-[#eaf1f9]"><X className="h-3.5 w-3.5" /></button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              <p className="text-[9px] leading-3 text-[#63738e]">Contextual guidance for this workspace. This is not human support.</p>
              <button type="button" onClick={() => setMessage("What is the payroll shortfall?")} className="rounded-md border border-[#dce5f0] bg-white px-2 py-1.5 text-left text-[9px] font-semibold hover:border-[#0067d8]">Explain the payroll shortfall</button>
              {messages.map((item, index) => <div key={`${item.role}-${index}`} className={`max-w-[92%] rounded-md px-2 py-1.5 text-[9px] leading-3 ${item.role === "user" ? "ml-auto bg-[#0067d8] text-white" : "border border-[#dce5f0] bg-white text-[#111b31]"}`}>{item.text}</div>)}
            </div>
            <form onSubmit={sendMessage} className="border-t border-[#dce5f0] p-2">
              <label className="sr-only" htmlFor="insight-message">Ask about this workspace</label>
              <div className="flex gap-1"><input id="insight-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about this workspace" className="min-w-0 flex-1 rounded border border-[#cdd9e7] bg-white px-2 text-[9px] outline-none focus:border-[#0067d8] focus:ring-1 focus:ring-[#0067d8]" /><button type="submit" aria-label="Send insight question" className="grid h-6 w-6 place-items-center rounded bg-[#0067d8] text-white disabled:opacity-40" disabled={!message.trim()}><Send className="h-3 w-3" /></button></div>
            </form>
          </aside>
        )}

        <aside aria-label="Operational support dock" className="relative z-10 flex w-11 shrink-0 flex-col items-center border-l border-[#cfddeb] bg-[#eaf1f8] py-2">
          <button type="button" aria-label={dockView === "closed" ? "Open operational support dock" : "Close operational support dock"} onClick={() => { setDockView((view) => view === "closed" ? "help" : "closed"); setChatOpen(false); }} className="mb-2 grid h-7 w-7 place-items-center rounded-md bg-[#111b31] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]">{dockView === "closed" ? <PanelRightOpen className="h-3.5 w-3.5" /> : <PanelRightClose className="h-3.5 w-3.5" />}</button>
          <DockButton active={dockView === "help"} label="Open Help and Support" onClick={() => openDock("help")}><CircleHelp className="h-4 w-4" /></DockButton>
          <DockButton active={dockView === "service"} label="Open service operations" onClick={() => openDock("service")}><Landmark className="h-4 w-4" /></DockButton>
          <DockButton active={dockView === "tickets"} label="Open Support Centre tickets" onClick={() => openDock("tickets")}><TicketCheck className="h-4 w-4" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#dc3545]" /></DockButton>
        </aside>

        {dockView !== "closed" && (
          <aside id="support-dock-panel" aria-label={dockTitle} className="absolute right-11 top-0 z-20 h-full w-[230px] border-l border-[#c9dbe9] bg-white shadow-[-10px_0_22px_rgba(17,27,49,.1)]">
            <div className="flex items-center justify-between border-b border-[#dce5f0] px-3 py-2"><div className="flex items-center gap-1.5"><CircleHelp className="h-3.5 w-3.5 text-[#0067d8]" /><h2 className="text-[10px] font-bold">{dockTitle}</h2></div><button type="button" onClick={() => setDockView("closed")} aria-label={`Close ${dockTitle}`} className="rounded p-0.5 hover:bg-[#eaf1f9]"><X className="h-3.5 w-3.5" /></button></div>
            {dockView === "help" && <div className="space-y-2 p-3"><p className="text-[9px] leading-3 text-[#63738e]">Find guidance or contact the support team. Service administration is kept separate.</p><DockLink icon={<BookOpen className="h-3.5 w-3.5" />} title="Help Resource Centre" meta="Articles and setup guides" /><DockLink icon={<MessageSquareText className="h-3.5 w-3.5" />} title="Contact support" meta="General support request" /><button type="button" onClick={() => openDock("tickets")} className="mt-1 w-full rounded-md border border-[#c7dcef] px-2 py-1.5 text-left text-[9px] font-bold text-[#0067d8] hover:bg-[#eff7ff]">Go to Support Centre <ChevronRight className="float-right h-3.5 w-3.5" /></button></div>}
            {dockView === "service" && <div className="space-y-2 p-3"><p className="text-[9px] leading-3 text-[#63738e]">Operational service controls for your organization.</p><DockLink icon={<Landmark className="h-3.5 w-3.5" />} title="Implementation tracker" meta="2 actions need review" /><DockLink icon={<ClipboardList className="h-3.5 w-3.5" />} title="Manage entitlements" meta="Users and roles" /><DockLink icon={<FileText className="h-3.5 w-3.5" />} title="Service notices" meta="No active incidents" /></div>}
            {dockView === "tickets" && <div className="space-y-2 p-3"><p className="text-[9px] leading-3 text-[#63738e]">Support Centre · your requests and service updates.</p><div className="rounded-md border border-[#eed6b0] bg-[#fffaf0] p-2"><p className="text-[9px] font-bold">ID 48172 · Access review</p><p className="mt-0.5 text-[8px] text-[#63738e]">Update requested · 1 day ago</p></div><button type="button" onClick={() => setTicketSent(true)} className="w-full rounded-md bg-[#0067d8] px-2 py-1.5 text-[9px] font-bold text-white hover:bg-[#0059bb]">{ticketSent ? "Request started" : "Submit support request"}</button>{ticketSent && <p role="status" className="text-[8px] text-[#327849]">A new request has been added to Support Centre.</p>}</div>}
          </aside>
        )}
      </div>
    </main>
  );
}

function DockButton({ active, label, onClick, children }: { active: boolean; label: string; onClick: () => void; children: ReactNode }) {
  return <button type="button" aria-label={label} aria-pressed={active} onClick={onClick} className={`relative mb-1 grid h-7 w-7 place-items-center rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8] ${active ? "bg-[#0067d8] text-white" : "text-[#41516c] hover:bg-white"}`}>{children}</button>;
}

function DockLink({ icon, title, meta }: { icon: ReactNode; title: string; meta: string }) {
  return <button type="button" className="flex w-full items-start gap-2 rounded-md border border-[#e1e8f1] p-2 text-left hover:border-[#9fc6ec] hover:bg-[#f8fbff]"><span className="mt-0.5 text-[#0067d8]">{icon}</span><span><span className="block text-[9px] font-bold">{title}</span><span className="mt-0.5 block text-[8px] text-[#63738e]">{meta}</span></span></button>;
}