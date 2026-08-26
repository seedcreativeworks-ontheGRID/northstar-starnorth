import { useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  Landmark,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";
import "./_group.css";

type Page = "overview" | "support";
type SupportTab = "guidance" | "requests" | "ask";

const replyFor = (question: string) => {
  const query = question.toLowerCase();
  if (query.includes("payroll") || query.includes("fund")) {
    return "Tomorrow's payroll is $129,493. A funding check identified an $18,420 gap; review the operating account before 14:00.";
  }
  if (query.includes("approval") || query.includes("approve") || query.includes("payment") || query.includes("wire")) {
    return "One wire payment needs a second approval: $42,500 to Contract Supplier Corporation. Its release window closes at 16:30.";
  }
  if (query.includes("cash") || query.includes("position") || query.includes("balance")) {
    return "Your available cash position is $286,410.84 across four accounts. The operating account remains above its minimum after scheduled debits.";
  }
  if (query.includes("vendor") || query.includes("spend") || query.includes("aws")) {
    return "AWS Services is tracking 23% above its three-month baseline. July's projected run rate is $15,200, with the change beginning after 8 July.";
  }
  return "Ask Northstar uses the Business Insights already available in this workspace. Try payroll funding, approvals, cash position, or vendor spend.";
};

export function NavigationSupportCentre() {
  const [page, setPage] = useState<Page>("overview");
  const [supportTab, setSupportTab] = useState<SupportTab>("guidance");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ from: "northstar", text: "I can clarify the Business Insights shown on this dashboard. I do not open service requests or contact support." }]);

  const openSupport = () => {
    setPage("support");
    setNotificationsOpen(false);
    setAccountOpen(false);
  };
  const sendQuestion = () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { from: "user", text: trimmed }, { from: "northstar", text: replyFor(trimmed) }]);
    setQuestion("");
  };

  return (
    <main className="northstar-utility-ia h-[360px] w-full overflow-hidden bg-[#f5f8fc] text-[#111b31]">
      <header className="relative h-[58px] border-b border-[#dce5f0] bg-white px-4">
        <div className="flex h-full items-center">
          <button onClick={() => setPage("overview")} className="mr-6 flex items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0067d8]">
            <span className="grid h-5 w-5 place-items-center rounded-sm bg-[#0067d8] text-[9px] font-bold text-white">N</span>
            <span className="text-[12px] font-bold tracking-[-.045em]">northstar</span>
          </button>
          <nav aria-label="Primary navigation" className="flex h-full items-center gap-4 text-[9px] font-semibold">
            {["Overview", "Payments", "Accounts", "Reports", "Support Centre"].map((item) => {
              const selected = (item === "Overview" && page === "overview") || (item === "Support Centre" && page === "support");
              return <button key={item} onClick={item === "Support Centre" ? openSupport : () => setPage("overview")} className={`h-full border-b-2 px-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0067d8] ${selected ? "border-[#0067d8] text-[#13233d]" : "border-transparent text-[#64758d] hover:text-[#0067d8]"}`}>{item}</button>;
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button aria-label="Notifications, 2 unread" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((open) => !open); setAccountOpen(false); }} className="relative grid h-7 w-7 place-items-center rounded-sm text-[#53657d] hover:bg-[#f2f6fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0067d8]">
                <Bell className="h-3.5 w-3.5" /><span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#c83e4d] ring-1 ring-white" />
              </button>
              {notificationsOpen && <div className="absolute right-0 top-8 z-30 w-48 border border-[#cedae7] bg-white p-2.5 shadow-[0_10px_22px_rgba(31,57,87,.16)]"><p className="mb-2 text-[9px] font-bold">Notifications</p><p className="border-l-2 border-[#c83e4d] pl-2 text-[8px] leading-relaxed text-[#61738b]"><b className="block text-[#17243c]">Payroll funding check</b>2 hours ago</p></div>}
            </div>
            <div className="h-4 border-l border-[#dce5f0]" />
            <div className="relative">
              <button aria-label="Account menu" aria-expanded={accountOpen} onClick={() => { setAccountOpen((open) => !open); setNotificationsOpen(false); }} className="flex items-center gap-1 rounded-sm px-1 py-1 text-[9px] font-semibold text-[#40546f] hover:bg-[#f2f6fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0067d8]">James Ben <ChevronDown className="h-3 w-3" /></button>
              {accountOpen && <div className="absolute right-0 top-7 z-30 w-28 border border-[#cedae7] bg-white p-1 shadow-[0_10px_22px_rgba(31,57,87,.16)]"><button className="w-full rounded px-2 py-1.5 text-left text-[8px] hover:bg-[#f2f6fa]">Profile & access</button><button className="w-full rounded px-2 py-1.5 text-left text-[8px] hover:bg-[#f2f6fa]">Sign out</button></div>}
            </div>
          </div>
        </div>
      </header>

      {page === "overview" ? (
        <section className="p-4">
          <div className="mb-3 flex items-end justify-between"><div><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#73849a]">Operating overview</p><h1 className="mt-1 text-[17px] font-bold tracking-[-.04em]">Good afternoon, James.</h1></div><p className="text-[8px] text-[#73849a]">16 July 2026</p></div>
          <div className="grid grid-cols-3 gap-2">
            {[["Available cash", "$286,410.84", "Across 4 accounts"], ["Payments to approve", "3", "$42,500 awaiting review"], ["Payroll tomorrow", "$129,493", "Funding check required"]].map(([label, value, note]) => <article key={label} className="border border-[#dce5f0] bg-white p-2.5"><p className="text-[8px] font-semibold text-[#6c7d94]">{label}</p><p className="mt-1 text-[13px] font-bold tracking-[-.04em]">{value}</p><p className="mt-1 text-[8px] text-[#77899f]">{note}</p></article>)}
          </div>
          <article className="mt-3 flex items-center justify-between border border-[#cdddec] bg-[#fafdff] px-3 py-2.5"><div className="flex items-start gap-2"><Sparkles className="mt-0.5 h-3.5 w-3.5 text-[#0067d8]" /><div><p className="text-[9px] font-bold">Business Insights</p><p className="mt-0.5 text-[8px] text-[#657790]">Payroll funding needs review before tomorrow&apos;s processing deadline.</p></div></div><button onClick={() => { openSupport(); setSupportTab("ask"); }} className="text-[8px] font-bold text-[#0067d8] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]">Ask Northstar</button></article>
        </section>
      ) : (
        <section className="p-4">
          <div className="flex items-end justify-between border-b border-[#dce5f0] pb-2"><div><p className="text-[8px] font-bold uppercase tracking-[.14em] text-[#73849a]">Support Centre</p><h1 className="mt-1 text-[16px] font-bold tracking-[-.04em]">Guidance and service</h1></div><p className="text-[8px] text-[#70819a]">Business banking</p></div>
          <div className="mt-2 flex gap-4 border-b border-[#dce5f0] text-[8px] font-semibold">
            {[["guidance", "Help & guidance"], ["requests", "Service requests"], ["ask", "Ask Northstar"]].map(([key, label]) => <button key={key} onClick={() => setSupportTab(key as SupportTab)} className={`border-b-2 pb-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8] ${supportTab === key ? "border-[#0067d8] text-[#111b31]" : "border-transparent text-[#687a91] hover:text-[#0067d8]"}`}>{label}</button>)}
          </div>
          {supportTab === "guidance" && <div className="mt-3 grid grid-cols-2 gap-2"><SupportCard icon={<BookOpen className="h-3.5 w-3.5" />} title="Help & guidance" copy="Find product guides, payment instructions, and training." action="Browse guidance" /><SupportCard icon={<CircleHelp className="h-3.5 w-3.5" />} title="Contact support" copy="Get help from a Northstar service specialist." action="Contact options" /></div>}
          {supportTab === "requests" && <div className="mt-3 grid grid-cols-2 gap-2"><SupportCard icon={<FileText className="h-3.5 w-3.5" />} title="Request support" copy="Open a formal service request for your team." action="New request" /><SupportCard icon={<Landmark className="h-3.5 w-3.5" />} title="Ticket status" copy="SR-2841 · Access change · In progress" action="View requests" /></div>}
          {supportTab === "ask" && <div className="mt-2"><div className="flex items-center gap-1.5 text-[8px] text-[#61738d]"><Sparkles className="h-3 w-3 text-[#0067d8]" /> Business Insights guidance · not human support</div><div className="mt-2 h-[92px] space-y-1.5 overflow-y-auto pr-1">{messages.map((item, index) => <div key={index} className={`max-w-[88%] px-2 py-1.5 text-[8px] leading-relaxed ${item.from === "user" ? "ml-auto bg-[#0067d8] text-white" : "border border-[#dce5f0] bg-white text-[#4f627a]"}`}>{item.text}</div>)}</div><form onSubmit={(event) => { event.preventDefault(); sendQuestion(); }} className="mt-2 flex border border-[#cbd9e7] bg-white"><input aria-label="Ask Northstar about Business Insights" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about payroll, approvals, cash, or vendors" className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[8px] outline-none placeholder:text-[#8797aa]" /><button aria-label="Send question" disabled={!question.trim()} className="px-2 text-[#0067d8] disabled:text-[#9baabe]"><Send className="h-3.5 w-3.5" /></button></form></div>}
        </section>
      )}
    </main>
  );
}

function SupportCard({ icon, title, copy, action }: { icon: React.ReactNode; title: string; copy: string; action: string }) {
  return <article className="border border-[#dce5f0] bg-white p-2.5"><div className="flex items-center gap-1.5 text-[#0067d8]">{icon}<p className="text-[9px] font-bold text-[#17243c]">{title}</p></div><p className="mt-1 text-[8px] leading-relaxed text-[#687a91]">{copy}</p><button className="mt-2 flex items-center gap-1 text-[8px] font-bold text-[#0067d8] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0067d8]">{action}<ArrowUpRight className="h-2.5 w-2.5" /></button></article>;
}