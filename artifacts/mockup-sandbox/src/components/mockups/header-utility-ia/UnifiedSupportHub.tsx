import { FormEvent, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  LifeBuoy,
  MessageSquareText,
  Send,
  Settings2,
  Sparkles,
  TicketCheck,
  X,
} from "lucide-react";
import "./_group.css";

type SupportTab = "guidance" | "service";
type InsightTopic = "payroll" | "approval" | "spend";

const responses: Record<InsightTopic, string> = {
  payroll:
    "Tomorrow's payroll requires CAD 129,493. The available balance is CAD 112,780, leaving CAD 16,713 to fund before 16:00 ET.",
  approval:
    "One wire payment for CAD 42,500 is awaiting dual approval. Review the payment record to see the outstanding approver.",
  spend:
    "AWS Services is 23% above its three-month baseline. The projected month-end run rate is CAD 15,200.",
};

export function UnifiedSupportHub() {
  const [supportOpen, setSupportOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tab, setTab] = useState<SupportTab>("guidance");
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [topic, setTopic] = useState<InsightTopic>("payroll");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const topicLabel = useMemo(
    () => ({ payroll: "Payroll funding", approval: "Payment approval", spend: "Vendor spend" })[topic],
    [topic],
  );

  const closeAll = () => {
    setSupportOpen(false);
    setNotificationsOpen(false);
  };

  const sendInsight = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    setReply(responses[topic]);
    setMessage("");
  };

  const chooseAction = (label: string) => {
    setToast(`${label} opened`);
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <main className="northstar-utility-ia relative min-h-[360px] overflow-hidden bg-[#f5f8fc] text-[#111b31]">
      <header className="relative z-30 border-b border-[#dce5f0] bg-[#fbfcfe]">
        <div className="flex h-11 items-center border-b border-[#e7edf5] px-4 text-[9px] text-[#63738e]">
          <div className="flex items-center gap-1.5"><span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-[#b8c6d8] text-[8px]">+</span> English <ChevronDown className="h-3 w-3" /></div>
          <div className="ml-auto flex items-center gap-2.5"><span>James</span><span className="font-semibold text-[#111b31]">Ben</span><span className="border-l border-[#dce5f0] pl-2.5">Sign Out</span></div>
        </div>
        <div className="flex h-[58px] items-center gap-5 px-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-[#111b31] text-[10px] font-bold text-white">N</div>
            <span className="text-[12px] font-bold tracking-[-.04em]">northstar</span>
          </div>
          <nav className="flex items-center gap-4 text-[10px] font-medium text-[#63738e]">
            <button onClick={() => chooseAction("Overview")} className="hover:text-[#0067d8]">Overview</button>
            <button onClick={() => chooseAction("Payments")} className="hover:text-[#0067d8]">Payments</button>
            <button onClick={() => chooseAction("Accounts")} className="hover:text-[#0067d8]">Accounts</button>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications, 2 unread"
                aria-expanded={notificationsOpen}
                aria-controls="unified-notifications"
                onClick={() => { setNotificationsOpen(!notificationsOpen); setSupportOpen(false); }}
                className="relative grid h-8 w-8 place-items-center rounded-md text-[#52637f] transition hover:bg-[#eaf2fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#d93b52] ring-2 ring-[#fbfcfe]" />
              </button>
              {notificationsOpen && (
                <section id="unified-notifications" className="absolute right-0 top-10 w-56 rounded-lg border border-[#dce5f0] bg-white p-2 shadow-[0_14px_28px_rgba(29,55,92,.14)]">
                  <div className="px-2 py-1.5 text-[10px] font-bold">Notifications <span className="ml-1 rounded-full bg-[#fce9ed] px-1.5 py-0.5 text-[8px] text-[#be2741]">2 new</span></div>
                  <button onClick={() => chooseAction("Payroll alert")} className="w-full rounded-md px-2 py-2 text-left text-[9px] hover:bg-[#f4f8fc]"><b className="block text-[#111b31]">Payroll funding required</b><span>CAD 16,713 needed before 16:00 ET</span></button>
                  <button onClick={() => chooseAction("Report")} className="w-full rounded-md px-2 py-2 text-left text-[9px] hover:bg-[#f4f8fc]"><b className="block text-[#111b31]">Transfer report is ready</b><span>July activity is available to review</span></button>
                </section>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label={supportOpen ? "Close Support" : "Open Support"}
                aria-expanded={supportOpen}
                aria-controls="unified-support-hub"
                onClick={() => { setSupportOpen(!supportOpen); setNotificationsOpen(false); }}
                className={`flex h-8 items-center gap-1.5 rounded-md border px-3 text-[10px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8] ${supportOpen ? "border-[#0067d8] bg-[#eaf4ff] text-[#005dbe]" : "border-[#bfd5ed] bg-[#f5faff] text-[#0067d8] hover:bg-[#eaf4ff]"}`}
              >
                <LifeBuoy className="h-3.5 w-3.5" /> Support <ChevronDown className={`h-3 w-3 transition-transform ${supportOpen ? "rotate-180" : ""}`} />
              </button>
              {supportOpen && (
                <section id="unified-support-hub" aria-label="Support hub" className="absolute right-0 top-10 w-[365px] overflow-hidden rounded-lg border border-[#cbd9e8] bg-white shadow-[0_18px_38px_rgba(29,55,92,.18)]">
                  <div className="flex items-start justify-between border-b border-[#e4ebf4] px-4 py-3">
                    <div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#0067d8]">One destination</p><h2 className="mt-0.5 text-[13px] font-bold">Support</h2></div>
                    <button aria-label="Close Support hub" onClick={() => setSupportOpen(false)} className="rounded p-1 text-[#63738e] hover:bg-[#edf3f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex border-b border-[#e4ebf4] px-3">
                    <button aria-pressed={tab === "guidance"} onClick={() => setTab("guidance")} className={`flex-1 border-b-2 py-2 text-[9px] font-bold ${tab === "guidance" ? "border-[#0067d8] text-[#0067d8]" : "border-transparent text-[#63738e]"}`}>Guidance & help</button>
                    <button aria-pressed={tab === "service"} onClick={() => setTab("service")} className={`flex-1 border-b-2 py-2 text-[9px] font-bold ${tab === "service" ? "border-[#0067d8] text-[#0067d8]" : "border-transparent text-[#63738e]"}`}>Service centre</button>
                  </div>
                  {tab === "guidance" ? (
                    <div className="grid grid-cols-2 gap-2 p-3">
                      <HubAction icon={BookOpen} title="Help resource centre" detail="Guides for payments, users and accounts" onClick={() => chooseAction("Help resource centre")} />
                      <HubAction icon={CircleHelp} title="Getting started" detail="Set up your operational workspace" onClick={() => chooseAction("Getting started")} />
                      <HubAction icon={MessageSquareText} title="Contact support" detail="Start a secure support conversation" onClick={() => chooseAction("Contact support")} />
                      <HubAction icon={FileText} title="Training" detail="Book a tailored learning session" onClick={() => chooseAction("Training")} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-3">
                      <HubAction icon={TicketCheck} title="Support requests" detail="View 2 active requests" onClick={() => chooseAction("Support requests")} alert />
                      <HubAction icon={Settings2} title="Manage support" detail="Service contacts and preferences" onClick={() => chooseAction("Manage support")} />
                      <HubAction icon={FileText} title="Implementation" detail="Track onboarding activities" onClick={() => chooseAction("Implementation tracker")} />
                      <HubAction icon={LifeBuoy} title="Submit a ticket" detail="Send a request to our team" onClick={() => chooseAction("Submit a ticket")} />
                    </div>
                  )}
                  <div className="border-t border-[#e4ebf4] bg-[#f8fbfe] px-4 py-2 text-[8px] text-[#63738e]">Support covers guidance, requests and service administration.</div>
                </section>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="px-5 pt-4">
        <div className="flex items-end justify-between">
          <div><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#63738e]">Operating account</p><h1 className="mt-1 text-[18px] font-bold tracking-[-.04em]">Good morning, Ben</h1></div>
          <button onClick={() => { setInsightsOpen(!insightsOpen); closeAll(); }} aria-expanded={insightsOpen} aria-controls="business-insights" className="flex items-center gap-1.5 rounded-md border border-[#d6e1ed] bg-white px-2.5 py-1.5 text-[9px] font-bold text-[#0067d8] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"><Sparkles className="h-3 w-3" /> Business Insights <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#0067d8] text-[8px] text-white">3</span></button>
        </div>
        <div className="mt-3 grid grid-cols-[1.3fr_.9fr] gap-3">
          <div className="rounded-lg border border-[#dce5f0] bg-white p-3"><p className="text-[9px] text-[#63738e]">Available balance</p><p className="mt-1 text-[18px] font-bold tracking-[-.05em]">CAD 112,780<span className="text-[11px]">.42</span></p></div>
          <div className="rounded-lg border border-[#dce5f0] bg-white p-3"><p className="text-[9px] text-[#63738e]">Requires attention</p><p className="mt-1 text-[15px] font-bold">3 items</p></div>
        </div>
      </section>

      {insightsOpen && (
        <aside id="business-insights" aria-label="Business Insights contextual assistant" className="absolute bottom-0 right-0 z-20 w-[285px] border-l border-t border-[#cbd9e8] bg-[#fbfdff] shadow-[-10px_-8px_26px_rgba(30,58,90,.13)]">
          <div className="flex items-center justify-between border-b border-[#e1e9f2] px-3 py-2"><div className="flex items-center gap-1.5 text-[10px] font-bold"><Sparkles className="h-3.5 w-3.5 text-[#0067d8]" /> Business Insights</div><button aria-label="Close Business Insights" onClick={() => setInsightsOpen(false)} className="rounded p-0.5 hover:bg-[#eaf2fb]"><X className="h-3.5 w-3.5" /></button></div>
          <div className="p-3">
            <p className="text-[9px] font-bold text-[#111b31]">Ask about this workspace</p>
            <div className="mt-2 flex gap-1">
              {(Object.keys(responses) as InsightTopic[]).map((key) => <button key={key} onClick={() => { setTopic(key); setReply(responses[key]); }} className={`rounded-full px-2 py-1 text-[8px] font-bold ${topic === key ? "bg-[#0067d8] text-white" : "bg-[#edf3f9] text-[#52637f]"}`}>{key === "payroll" ? "Payroll" : key === "approval" ? "Approval" : "Spend"}</button>)}
            </div>
            <div className="mt-2 rounded-md border border-[#dce5f0] bg-white p-2 text-[9px] leading-relaxed text-[#52637f]">{reply ?? `Context: ${topicLabel}. Ask a question or choose a topic.`}</div>
            <form onSubmit={sendInsight} className="mt-2 flex gap-1"><input aria-label="Ask Business Insights about the selected context" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about this insight" className="min-w-0 flex-1 rounded-md border border-[#cbd9e8] px-2 py-1.5 text-[9px] outline-none focus:border-[#0067d8] focus:ring-1 focus:ring-[#0067d8]" /><button aria-label="Send insight question" type="submit" className="grid w-7 place-items-center rounded-md bg-[#0067d8] text-white disabled:opacity-50"><Send className="h-3 w-3" /></button></form>
          </div>
        </aside>
      )}
      {toast && <div role="status" className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#111b31] px-3 py-1.5 text-[9px] text-white shadow-lg">{toast}</div>}
    </main>
  );
}

function HubAction({ icon: Icon, title, detail, onClick, alert = false }: { icon: typeof BookOpen; title: string; detail: string; onClick: () => void; alert?: boolean }) {
  return <button onClick={onClick} className="relative rounded-md border border-[#e1e9f2] p-2 text-left transition hover:border-[#9fc6ec] hover:bg-[#f5faff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]"><Icon className="mb-1.5 h-3.5 w-3.5 text-[#0067d8]" /><b className="block text-[9px] leading-tight">{title}</b><span className="mt-0.5 block text-[8px] leading-tight text-[#63738e]">{detail}</span>{alert && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d93b52]" />}</button>;
}