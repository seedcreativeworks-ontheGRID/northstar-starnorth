import { useState } from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  FileText,
  Landmark,
  MessageSquareText,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import "./_group.css";

type Topic = "payroll" | "approvals" | "cash" | "vendors";
type Message = { role: "assistant" | "user"; text: string };

const topicCopy: Record<Topic, { label: string; title: string; prompt: string; reply: string }> = {
  payroll: {
    label: "Payroll",
    title: "Payroll funding due tomorrow",
    prompt: "How can I cover payroll?",
    reply: "Payroll requires $129,493 CAD tomorrow. Your operating account is $18,640 short. I can prepare a funding transfer from your reserve account before 16:00.",
  },
  approvals: {
    label: "Approvals",
    title: "One payment awaiting approval",
    prompt: "What needs approval?",
    reply: "A $42,500 wire to Contract Supplier Corporation needs a second approver. It is queued for release at 14:30 after approval.",
  },
  cash: {
    label: "Cash position",
    title: "Cash position is stable",
    prompt: "Show my cash position.",
    reply: "Available cash is $486,240 CAD. After scheduled payroll and payables, your 14-day projected buffer is $211,870 CAD.",
  },
  vendors: {
    label: "Vendor spend",
    title: "AWS spend is above baseline",
    prompt: "Why is vendor spend higher?",
    reply: "AWS Services is 23% above its three-month baseline. The increase is concentrated in data transfer and compute usage since 4 July.",
  },
};

function answerFor(input: string, fallback: Topic) {
  const value = input.toLowerCase();
  if (value.includes("payroll") || value.includes("salary")) return topicCopy.payroll.reply;
  if (value.includes("approval") || value.includes("approve") || value.includes("wire")) return topicCopy.approvals.reply;
  if (value.includes("cash") || value.includes("balance") || value.includes("position")) return topicCopy.cash.reply;
  if (value.includes("vendor") || value.includes("spend") || value.includes("aws")) return topicCopy.vendors.reply;
  return `For ${topicCopy[fallback].label.toLowerCase()}, ${topicCopy[fallback].reply}`;
}

export function InsightsAssistant() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [topic, setTopic] = useState<Topic>("payroll");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: topicCopy.payroll.reply },
  ]);

  const selectTopic = (next: Topic) => {
    setTopic(next);
    setMessages([
      { role: "user", text: topicCopy[next].prompt },
      { role: "assistant", text: topicCopy[next].reply },
    ]);
  };

  const send = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: answerFor(trimmed, topic) },
    ]);
    setDraft("");
  };

  return (
    <main className="northstar-utility-ia relative min-h-[360px] overflow-hidden bg-[#f6f9fd] text-[#111b31]">
      <header className="flex h-[54px] items-center border-b border-[#dce5f0] bg-white px-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-[#111b31] text-[11px] font-bold text-white">N</div>
          <span className="text-[13px] font-semibold tracking-[-0.02em]">northstar</span>
          <span className="h-4 w-px bg-[#dce5f0]" />
          <span className="text-[10px] font-medium text-[#63738e]">Daily overview</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications, 2 unread"
              aria-expanded={notificationsOpen}
              onClick={() => { setNotificationsOpen((open) => !open); setSupportOpen(false); }}
              className="relative grid h-8 w-8 place-items-center rounded-md text-[#50617e] transition hover:bg-[#edf4fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"
            >
              <Bell size={16} />
              <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-[#d23d45] ring-2 ring-white" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 z-30 mt-2 w-56 rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_12px_28px_rgba(20,42,75,.16)]">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#63738e]">Notifications</p>
                <p className="mt-2 text-[11px] font-semibold">Payroll funding needs review</p>
                <p className="mt-1 text-[10px] leading-4 text-[#63738e]">Funding is due before tomorrow&apos;s processing window.</p>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label={supportOpen ? "Close Support Centre" : "Open Support Centre"}
              aria-expanded={supportOpen}
              onClick={() => { setSupportOpen((open) => !open); setNotificationsOpen(false); }}
              className="flex h-8 items-center gap-1.5 rounded-md border border-[#cfddec] bg-white px-2.5 text-[10px] font-semibold text-[#274263] transition hover:border-[#0067d8] hover:bg-[#f3f8fe] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"
            >
              <CircleHelp size={14} />
              Support Centre
              <ChevronDown size={12} className={supportOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>
            {supportOpen && (
              <div className="absolute right-0 z-30 mt-2 w-52 rounded-lg border border-[#dce5f0] bg-white p-2 shadow-[0_12px_28px_rgba(20,42,75,.16)]">
                <p className="px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#63738e]">Formal service</p>
                <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] hover:bg-[#f3f8fe]"><FileText size={14} /> Manage support requests</button>
                <button type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] hover:bg-[#f3f8fe]"><Landmark size={14} /> Service administration</button>
              </div>
            )}
          </div>
          <div className="ml-1 h-6 w-6 rounded-full bg-[#e7effa] text-center text-[9px] font-bold leading-6 text-[#31557f]">JB</div>
        </div>
      </header>

      <section className="flex h-[306px]">
        <div className="min-w-0 flex-1 p-4 pr-3">
          <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#63738e]">Operations / Cash management</p>
          <h1 className="mt-1 text-[18px] font-bold tracking-[-.04em]">Good morning, James</h1>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-[#dce5f0] bg-white p-3">
              <p className="text-[9px] font-semibold text-[#63738e]">Available balance</p>
              <p className="mt-1 text-[16px] font-bold tracking-[-.04em]">$486,240 <span className="text-[9px] text-[#63738e]">CAD</span></p>
            </div>
            <div className="rounded-lg border border-[#dce5f0] bg-white p-3">
              <p className="text-[9px] font-semibold text-[#63738e]">Payments awaiting review</p>
              <p className="mt-1 text-[16px] font-bold tracking-[-.04em]">3 <span className="text-[9px] font-medium text-[#d23d45]">actionable</span></p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border-l-[3px] border-[#e19b2d] bg-[#fffaf0] px-3 py-2">
            <p className="text-[10px] font-semibold">Payroll processing tomorrow</p>
            <p className="mt-0.5 text-[9px] leading-3 text-[#63738e]">Review funding before the 16:00 cut-off.</p>
          </div>
        </div>

        <aside aria-label="Northstar Business Insights assistant" className="flex w-[290px] flex-col border-l border-[#cfddec] bg-white">
          <div className="flex items-center justify-between border-b border-[#dce5f0] px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="grid h-5 w-5 place-items-center rounded bg-[#e9f3ff] text-[#0067d8]"><Sparkles size={12} /></span>
              <div><p className="text-[11px] font-bold">Business Insights</p><p className="text-[8px] text-[#63738e]">Contextual assistant</p></div>
            </div>
            <button type="button" aria-label="Close Business Insights" className="rounded p-1 text-[#63738e] hover:bg-[#edf4fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]"><X size={14} /></button>
          </div>
          <div className="flex gap-1 overflow-x-auto border-b border-[#e5edf5] px-2 py-1.5">
            {(Object.keys(topicCopy) as Topic[]).map((key) => (
              <button key={key} type="button" onClick={() => selectTopic(key)} aria-pressed={topic === key} className={`whitespace-nowrap rounded-full px-2 py-1 text-[8px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8] ${topic === key ? "bg-[#0067d8] text-white" : "bg-[#edf4fb] text-[#516987] hover:bg-[#dfeefe]"}`}>{topicCopy[key].label}</button>
            ))}
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[#f8fbfe] px-3 py-2">
            <div className="flex gap-1.5">
              <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded bg-[#0067d8] text-white"><Sparkles size={9} /></span>
              <div><p className="text-[9px] font-bold">{topicCopy[topic].title}</p><p className="mt-0.5 text-[8px] leading-3 text-[#63738e]">Ask for an explanation or next step. This is guidance, not Support Centre.</p></div>
            </div>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <p className={`max-w-[88%] rounded-lg px-2 py-1.5 text-[9px] leading-[13px] ${message.role === "user" ? "bg-[#0067d8] text-white" : "border border-[#dce5f0] bg-white text-[#31445f]"}`}>{message.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); send(); }} className="border-t border-[#dce5f0] p-2">
            <label className="sr-only" htmlFor="insight-question">Ask about this insight</label>
            <div className="flex items-center gap-1 rounded-md border border-[#cfddec] bg-white px-2 py-1 focus-within:border-[#0067d8] focus-within:ring-2 focus-within:ring-[#0067d8]/20">
              <MessageSquareText size={13} className="shrink-0 text-[#63738e]" />
              <input id="insight-question" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about this insight" className="min-w-0 flex-1 bg-transparent text-[9px] outline-none placeholder:text-[#8190a6]" />
              <button type="submit" aria-label="Send insight question" disabled={!draft.trim()} className="grid h-5 w-5 place-items-center rounded bg-[#0067d8] text-white disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]"><Send size={11} /></button>
            </div>
          </form>
        </aside>
      </section>
    </main>
  );
}