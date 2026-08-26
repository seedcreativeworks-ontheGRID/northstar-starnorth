import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Command,
  ExternalLink,
  LifeBuoy,
  Search,
  Sparkles,
} from "lucide-react";
import "./_group.css";

export function ContextualAssist() {
  const [isAssistOpen, setIsAssistOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportCentreOpen, setIsSupportCentreOpen] = useState(false);

  const closeOtherUtilities = () => {
    setIsNotificationsOpen(false);
    setIsSupportCentreOpen(false);
  };

  return (
    <main className="northstar-help-exploration min-h-[360px] overflow-hidden bg-[#f5f8fc]">
      <style>{`
        .contextual-assist-preview button { font: inherit; }
        .contextual-assist-preview button:focus-visible { outline: 3px solid rgba(0, 103, 216, .28); outline-offset: 3px; }
        .contextual-assist-preview .fade-up { animation: contextualAssistIn .18s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes contextualAssistIn { from { opacity: 0; transform: translateY(-6px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <section className="contextual-assist-preview relative min-h-[360px] overflow-hidden">
        <header className="relative z-20 flex h-[66px] items-center border-b border-[#dce5f0] bg-[#fbfdff] px-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-[8px] bg-[#0067d8] shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]">
                <span className="h-3.5 w-3.5 rounded-full border-[3px] border-white" />
              </div>
              <span className="text-[14px] font-bold tracking-[-0.045em] text-[#111b31]">northstar</span>
            </div>
            <div className="hidden items-center gap-5 text-[10px] font-semibold text-[#63738e] md:flex">
              <span className="text-[#111b31]">Overview</span>
              <span>Payments</span>
              <span>Accounts</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications, 2 unread"
                aria-expanded={isNotificationsOpen}
                aria-controls="notifications-panel"
                onClick={() => {
                  closeOtherUtilities();
                  setIsAssistOpen(false);
                  setIsNotificationsOpen((open) => !open);
                }}
                className="relative grid h-8 w-8 place-items-center rounded-full text-[#63738e] transition-colors hover:bg-[#eef5fc] hover:text-[#111b31]"
              >
                <Bell className="h-[17px] w-[17px]" strokeWidth={1.9} />
                <span className="absolute right-[5px] top-[5px] h-1.5 w-1.5 rounded-full border border-[#fbfdff] bg-[#d62839]" />
              </button>
              {isNotificationsOpen && (
                <div id="notifications-panel" className="fade-up absolute right-0 top-[42px] w-[230px] rounded-xl border border-[#dce5f0] bg-white p-3 shadow-[0_16px_30px_rgba(21,47,81,.15)]">
                  <p className="text-[11px] font-bold text-[#111b31]">Notifications</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#63738e]">Two approvals need your attention.</p>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={isAssistOpen ? "Close Help and Support" : "Open Help and Support"}
                aria-expanded={isAssistOpen}
                aria-controls="contextual-help-panel"
                onClick={() => {
                  closeOtherUtilities();
                  setIsAssistOpen((open) => !open);
                }}
                className={`group flex h-9 items-center gap-2 rounded-full border px-3 transition-all ${
                  isAssistOpen
                    ? "border-[#9dccff] bg-[#eaf4ff] text-[#0057ba]"
                    : "border-[#cbdced] bg-white text-[#245a94] hover:border-[#9dccff] hover:bg-[#f3f8fe]"
                }`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full ${isAssistOpen ? "bg-[#0067d8] text-white" : "bg-[#e5f1fd] text-[#0067d8]"}`}>
                  <Sparkles className="h-3 w-3" strokeWidth={2.3} />
                </span>
                <span className="text-[10px] font-bold tracking-[-0.01em]">Explain this screen</span>
                <span className="hidden rounded border border-[#c8d8e9] bg-white/70 px-1 py-[1px] text-[8px] font-bold tracking-wide text-[#63738e] lg:inline">?</span>
              </button>

              {isAssistOpen && (
                <aside id="contextual-help-panel" aria-label="Help and Support" className="fade-up absolute right-0 top-[46px] w-[320px] overflow-hidden rounded-[14px] border border-[#cdddeb] bg-white shadow-[0_18px_42px_rgba(17,42,74,.18)]">
                  <div className="border-b border-[#e5edf5] bg-[#f7fbff] px-4 py-3.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#0067d8]">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-[.13em]">Contextual assist</span>
                        </div>
                        <h2 className="mt-1 text-[13px] font-bold tracking-[-0.03em] text-[#111b31]">Need a hand with payments?</h2>
                      </div>
                      <CircleHelp className="h-5 w-5 text-[#89a5c2]" strokeWidth={1.7} />
                    </div>
                    <p className="mt-1 text-[10px] leading-4 text-[#63738e]">I can explain what you can do from this screen.</p>
                  </div>
                  <div className="space-y-1 px-2 py-2">
                    <button type="button" className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#f1f7fd]">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-[#eaf4ff] text-[#0067d8]"><BookOpen className="h-3.5 w-3.5" /></span>
                      <span><span className="block text-[10px] font-bold text-[#18243b]">Guide me through a payment</span><span className="block text-[9px] text-[#63738e]">Funding, approvals, and tracking</span></span>
                    </button>
                    <button type="button" className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#f1f7fd]">
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-[#eaf4ff] text-[#0067d8]"><Search className="h-3.5 w-3.5" /></span>
                      <span><span className="block text-[10px] font-bold text-[#18243b]">Find an answer</span><span className="block text-[9px] text-[#63738e]">Search Northstar support</span></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#e5edf5] px-4 py-2.5">
                    <span className="text-[9px] text-[#63738e]">Need a person instead?</span>
                    <button type="button" className="flex items-center gap-1 text-[9px] font-bold text-[#0067d8] hover:underline">Contact support <ExternalLink className="h-2.5 w-2.5" /></button>
                  </div>
                </aside>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Open Support Centre menu"
                aria-expanded={isSupportCentreOpen}
                aria-controls="support-centre-menu"
                onClick={() => {
                  closeOtherUtilities();
                  setIsAssistOpen(false);
                  setIsSupportCentreOpen((open) => !open);
                }}
                className="flex h-8 shrink-0 whitespace-nowrap items-center gap-2 rounded-full border border-[#d2dfec] bg-white px-3 text-[10px] font-bold text-[#0067d8] transition-colors hover:bg-[#f3f8fe]"
              >
                Support Centre <span className="h-1.5 w-1.5 rounded-full bg-[#d62839]" />
              </button>
              {isSupportCentreOpen && (
                <div id="support-centre-menu" className="fade-up absolute right-0 top-[42px] w-[192px] rounded-xl border border-[#dce5f0] bg-white p-2 shadow-[0_16px_30px_rgba(21,47,81,.15)]">
                  <button type="button" className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[10px] font-semibold text-[#111b31] hover:bg-[#f1f7fd]">Support inbox <ChevronDown className="h-3 w-3 -rotate-90 text-[#63738e]" /></button>
                  <button type="button" className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[10px] font-semibold text-[#111b31] hover:bg-[#f1f7fd]">Service updates <span className="h-1.5 w-1.5 rounded-full bg-[#d62839]" /></button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="relative px-7 pt-7">
          <div className="flex items-center gap-2 text-[10px] font-medium text-[#63738e]"><span>Payments</span><ChevronDown className="h-3 w-3 -rotate-90" /><span className="text-[#111b31]">Overview</span></div>
          <div className="mt-3 flex items-end justify-between">
            <div><h1 className="text-[22px] font-bold tracking-[-0.05em] text-[#111b31]">Payments overview</h1><p className="mt-1 text-[10px] text-[#63738e]">Monitor upcoming activity and approvals.</p></div>
            <button type="button" className="flex items-center gap-1.5 rounded-md bg-[#0067d8] px-3 py-2 text-[10px] font-bold text-white shadow-sm"><LifeBuoy className="h-3 w-3" /> New payment</button>
          </div>
          <div className="mt-6 grid grid-cols-[1.25fr_.75fr] gap-4 opacity-70">
            <div className="rounded-xl border border-[#dce5f0] bg-white p-4"><div className="h-2 w-20 rounded bg-[#d9e6f3]" /><div className="mt-4 h-5 w-28 rounded bg-[#edf3f8]" /><div className="mt-5 h-1.5 w-full rounded bg-[#edf3f8]" /></div>
            <div className="rounded-xl border border-[#dce5f0] bg-white p-4"><div className="h-2 w-16 rounded bg-[#d9e6f3]" /><div className="mt-4 space-y-2"><div className="h-2 w-full rounded bg-[#edf3f8]" /><div className="h-2 w-4/5 rounded bg-[#edf3f8]" /></div></div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-7 flex items-center gap-1 text-[8px] font-semibold text-[#8aa0b8]"><Command className="h-2.5 w-2.5" /> Press ? anytime for guidance</div>
      </section>
    </main>
  );
}