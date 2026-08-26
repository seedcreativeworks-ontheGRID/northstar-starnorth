import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  Landmark,
  Send,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import "./_group.css";

type Panel = "none" | "notifications" | "help" | "service" | "insights";

const answerFor = (message: string) => {
  const query = message.toLowerCase();
  if (query.includes("payroll") || query.includes("shortfall")) {
    return "The payroll run needs an additional $18,420 before 14:00 tomorrow. I can help you review the source account or prepare a funding transfer.";
  }
  if (query.includes("approval") || query.includes("payment") || query.includes("wire")) {
    return "One payment is waiting for a second approval: $42,500 to Contract Supplier Corporation. Its release window closes at 16:30.";
  }
  if (query.includes("spend") || query.includes("vendor") || query.includes("aws")) {
    return "AWS Services spend is 23% above the three-month baseline. The projected July run rate is $15,200; the increase began after 8 July.";
  }
  return "I’m scoped to the insights on this workspace. Ask about payroll funding, a flagged payment, or vendor spend and I’ll bring the relevant context forward.";
};

export function TopbarRelocation() {
  const [panel, setPanel] = useState<Panel>("none");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Array<{ from: "user" | "assistant"; text: string }>>([
    { from: "assistant", text: "I’m Northstar Insights. I can explain the numbers and help you decide what to review next." },
  ]);
  const [serviceView, setServiceView] = useState("Service Centre");

  const activeTitle = useMemo(() => {
    if (panel === "help") return "Help";
    if (panel === "notifications") return "Notifications";
    if (panel === "service") return serviceView;
    return "";
  }, [panel, serviceView]);

  const toggle = (next: Panel) => setPanel((current) => (current === next ? "none" : next));
  const send = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setConversation((current) => [...current, { from: "user", text: trimmed }, { from: "assistant", text: answerFor(trimmed) }]);
    setMessage("");
  };

  return (
    <main className="northstar-utility-ia min-h-[360px] w-full overflow-hidden bg-[#f5f8fc] text-[#111b31]">
      <div className="h-8 border-y border-[#dce5f0] bg-white px-4">
        <div className="flex h-full items-center justify-end gap-3 text-[9px] font-medium text-[#63738e]">
          <button className="flex items-center gap-1 rounded px-1 py-1 hover:bg-[#f3f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0067d8]">
            <span className="grid h-3.5 w-3.5 place-items-center rounded-full border border-[#9aabc0] text-[8px]">EN</span> English <ChevronDown className="h-2.5 w-2.5" />
          </button>
          <span className="h-3 border-l border-[#dce5f0]" />
          <span>James Ben</span>
          <span className="h-3 border-l border-[#dce5f0]" />
          <div className="relative">
            <button
              aria-controls="support-centre-menu"
              aria-expanded={panel === "service"}
              onClick={() => toggle("service")}
              className={`flex items-center gap-1 rounded px-1.5 py-1 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0067d8] ${panel === "service" ? "bg-[#e6f1fd] text-[#005bbd]" : "text-[#40516c] hover:bg-[#f3f7fb]"}`}
            >
              <Settings2 className="h-3 w-3" /> Support Centre <ChevronDown className={`h-2.5 w-2.5 transition-transform ${panel === "service" ? "rotate-180" : ""}`} />
            </button>
            {panel === "service" && (
              <div id="support-centre-menu" className="absolute right-0 top-6 z-30 w-52 rounded-md border border-[#cfdbe9] bg-white p-2 shadow-[0_10px_24px_rgba(30,56,88,.16)]">
                <p className="px-2 pb-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-[#71839b]">Service administration</p>
                {[
                  ["Manage support", "Review open cases & access"],
                  ["Submit a support ticket", "Start a new service request"],
                  ["Implementation tracker", "2 tasks need attention"],
                ].map(([label, description]) => (
                  <button key={label} onClick={() => { setServiceView(label); setPanel("help"); }} className="block w-full rounded px-2 py-1.5 text-left hover:bg-[#eef5fd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]">
                    <span className="block text-[9px] font-semibold text-[#17243c]">{label}</span>
                    <span className="block text-[8px] text-[#6b7e97]">{description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <header className="flex h-14 items-center border-b border-[#dce5f0] bg-white px-4">
        <div className="mr-6 flex items-center gap-2">
          <div className="grid h-5 w-5 place-items-center rounded-sm bg-[#0067d8] text-[9px] font-bold text-white">N</div>
          <span className="text-[12px] font-bold tracking-[-.03em]">northstar</span>
        </div>
        <nav className="flex h-full items-center gap-4 text-[9px] font-semibold text-[#53657d]">
          <button className="h-full border-b-2 border-[#0067d8] px-1 text-[#15233b]">Overview</button>
          <button className="px-1 hover:text-[#0067d8]">Accounts</button>
          <button className="px-1 hover:text-[#0067d8]">Payments</button>
          <button className="px-1 hover:text-[#0067d8]">Reports</button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => toggle("insights")} aria-expanded={panel === "insights"} className={`hidden items-center gap-1.5 rounded border px-2 py-1.5 text-[9px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0067d8] sm:flex ${panel === "insights" ? "border-[#0067d8] bg-[#eaf3fd] text-[#005bbd]" : "border-[#ccd9e8] text-[#36506f] hover:bg-[#f4f8fc]"}`}>
            <Sparkles className="h-3 w-3 text-[#0067d8]" /> Business Insights <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#0067d8] text-[7px] text-white">3</span>
          </button>
          <button onClick={() => toggle("help")} aria-expanded={panel === "help"} className={`flex items-center gap-1 rounded px-1.5 py-1 text-[9px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0067d8] ${panel === "help" ? "bg-[#eaf3fd] text-[#005bbd]" : "text-[#405672] hover:bg-[#f2f6fa]"}`}>
            <CircleHelp className="h-3.5 w-3.5" /> Help
          </button>
          <div className="relative">
            <button onClick={() => toggle("notifications")} aria-label="Notifications, 2 unread" aria-expanded={panel === "notifications"} className="relative grid h-6 w-6 place-items-center rounded hover:bg-[#f2f6fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0067d8]">
              <Bell className="h-3.5 w-3.5 text-[#405672]" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#dc3545] ring-1 ring-white" />
            </button>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[278px]">
        <div className={`flex-1 p-4 transition-all ${panel === "insights" ? "pr-[218px]" : ""}`}>
          <div className="mb-3 flex items-end justify-between">
            <div><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#73849a]">Operating overview</p><h1 className="mt-1 text-[17px] font-bold tracking-[-.04em]">Good afternoon, James.</h1></div>
            <p className="text-[8px] text-[#73849a]">16 July 2026</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[["Available balance", "$286,410.84", "Across 4 accounts"], ["Payments to approve", "3", "$42,500 awaiting review"], ["Payroll tomorrow", "$129,493", "Funding check required"]].map(([label, value, note]) => (
              <article key={label} className="rounded border border-[#dce5f0] bg-white p-2.5">
                <p className="text-[8px] font-semibold text-[#6c7d94]">{label}</p><p className="mt-1 text-[13px] font-bold tracking-[-.04em]">{value}</p><p className="mt-1 text-[8px] text-[#77899f]">{note}</p>
              </article>
            ))}
          </div>
          <div className="mt-3 rounded border border-[#dce5f0] bg-white p-3">
            <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold">Payroll funding needs review</p><p className="mt-1 text-[8px] text-[#6f8198]">An insight flagged a potential funding gap before tomorrow’s processing deadline.</p></div><button onClick={() => setPanel("insights")} className="flex items-center gap-1 text-[8px] font-bold text-[#0067d8] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]">View insight <ChevronRight className="h-3 w-3" /></button></div>
          </div>
        </div>

        {panel !== "none" && panel !== "insights" && (
          <aside aria-label={activeTitle} className="absolute right-3 top-3 z-20 w-56 rounded-md border border-[#cfdae7] bg-white p-3 shadow-[0_12px_30px_rgba(29,52,83,.18)]">
            <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-bold">{activeTitle}</p><button aria-label={`Close ${activeTitle}`} onClick={() => setPanel("none")}><X className="h-3.5 w-3.5 text-[#6c7d94]" /></button></div>
            {panel === "notifications" ? <div className="space-y-2 text-[8px]"><div className="border-l-2 border-[#dc3545] pl-2"><b className="block text-[#20304a]">Payroll funding check</b><span className="text-[#6f8198]">2 hours ago · action required</span></div><div className="border-l-2 border-[#dce5f0] pl-2"><b className="block text-[#20304a]">Transfer report is ready</b><span className="text-[#6f8198]">Yesterday</span></div></div> : <div className="space-y-2 text-[8px] text-[#60738d]"><p>{panel === "help" && serviceView !== "Service Centre" ? "You are viewing a service workflow. Administrative requests live in Support Centre." : "Get quick product guidance without opening a service request."}</p><button className="flex w-full items-center gap-2 rounded border border-[#dbe5ef] p-2 text-left hover:bg-[#f4f8fc]"><BookOpen className="h-3.5 w-3.5 text-[#0067d8]" /><span><b className="block text-[#21324b]">Help resources</b>Explore guides and training</span></button><button className="flex w-full items-center gap-2 rounded border border-[#dbe5ef] p-2 text-left hover:bg-[#f4f8fc]"><FileText className="h-3.5 w-3.5 text-[#0067d8]" /><span><b className="block text-[#21324b]">Contact support</b>Ask a product question</span></button></div>}
          </aside>
        )}

        {panel === "insights" && (
          <aside aria-label="Business Insights assistant" className="absolute inset-y-0 right-0 z-20 flex w-[218px] flex-col border-l border-[#cfdbe9] bg-[#fbfdff] shadow-[-8px_0_22px_rgba(30,56,88,.08)]">
            <div className="flex items-center justify-between border-b border-[#dce5f0] px-3 py-2"><div className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-[#0067d8]" /><span className="text-[9px] font-bold">Business Insights</span></div><button aria-label="Close Business Insights" onClick={() => setPanel("none")}><X className="h-3.5 w-3.5 text-[#647791]" /></button></div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">{conversation.map((item, index) => <div key={`${item.from}-${index}`} className={`max-w-[94%] rounded px-2 py-1.5 text-[8px] leading-relaxed ${item.from === "user" ? "ml-auto bg-[#0067d8] text-white" : "border border-[#dce5f0] bg-white text-[#435873]"}`}>{item.text}</div>)}</div>
            <form onSubmit={(event) => { event.preventDefault(); send(); }} className="border-t border-[#dce5f0] p-2">
              <label className="sr-only" htmlFor="insight-question">Ask about this workspace</label><div className="flex rounded border border-[#cdd9e7] bg-white"><input id="insight-question" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about this workspace" className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[8px] outline-none placeholder:text-[#8797aa]" /><button aria-label="Send insight question" className="px-2 text-[#0067d8] disabled:text-[#94a3b8]" disabled={!message.trim()}><Send className="h-3.5 w-3.5" /></button></div>
            </form>
          </aside>
        )}
      </section>
    </main>
  );
}