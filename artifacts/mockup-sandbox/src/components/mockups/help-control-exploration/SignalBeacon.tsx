import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  LifeBuoy,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import "./_group.css";

export function SignalBeacon() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [centreOpen, setCentreOpen] = useState(false);

  const toggleHelp = () => {
    setHelpOpen((value) => !value);
    setNotificationsOpen(false);
    setCentreOpen(false);
  };

  return (
    <main className="northstar-help-exploration signal-beacon min-h-[360px] overflow-hidden bg-[#f4f7fb] p-5">
      <style>{`
        .signal-beacon button { font: inherit; }
        .signal-beacon .app-frame { box-shadow: 0 16px 34px rgba(19, 42, 74, .12); }
        .signal-beacon .beacon-orbit { animation: beacon-breathe 2.8s ease-in-out infinite; }
        .signal-beacon .support-surface { animation: surface-enter .18s ease-out both; }
        @keyframes beacon-breathe { 50% { transform: scale(1.12); opacity: .5; } }
        @keyframes surface-enter { from { transform: translateY(-5px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .signal-beacon .beacon-orbit, .signal-beacon .support-surface { animation: none; } }
      `}</style>

      <section className="app-frame relative mx-auto min-h-[320px] max-w-[640px] overflow-hidden rounded-[10px] border border-[#dce5f0] bg-[#fbfcfe]">
        <header className="relative z-20 flex h-[62px] items-center border-b border-[#dce5f0] bg-white px-5">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5" aria-label="Northstar">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#0067d8] text-[14px] font-bold text-white">N</span>
              <span className="text-[14px] font-bold tracking-[-.035em] text-[#111b31]">northstar</span>
            </div>
            <nav className="flex items-center gap-5 text-[10px] font-semibold text-[#63738e]" aria-label="Primary navigation">
              <span className="text-[#111b31]">Overview</span>
              <span>Payments</span>
              <span>Accounts</span>
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications, 2 unread"
                aria-expanded={notificationsOpen}
                onClick={() => { setNotificationsOpen((value) => !value); setHelpOpen(false); setCentreOpen(false); }}
                className="relative grid h-8 w-8 place-items-center rounded-full text-[#63738e] transition-colors hover:bg-[#f1f6fc] hover:text-[#111b31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2"
              >
                <Bell size={17} strokeWidth={1.9} />
                <span className="absolute right-[5px] top-[5px] h-2 w-2 rounded-full border-2 border-white bg-[#d92d20]" />
              </button>
              {notificationsOpen && (
                <div className="support-surface absolute right-0 top-[42px] w-[218px] rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_12px_28px_rgba(20,43,75,.16)]">
                  <p className="text-[11px] font-bold text-[#111b31]">Notifications</p>
                  <p className="mt-2 border-t border-[#edf1f6] pt-2 text-[10px] leading-4 text-[#63738e]">Payroll funding needs review.</p>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={helpOpen ? "Close Help and Support" : "Open Help and Support"}
                aria-expanded={helpOpen}
                aria-controls="signal-beacon-help-panel"
                onClick={toggleHelp}
                className={`relative grid h-9 w-9 place-items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2 ${helpOpen ? "bg-[#0067d8] text-white" : "bg-[#e8f2ff] text-[#0067d8] hover:bg-[#dcecff]"}`}
              >
                {!helpOpen && <span className="beacon-orbit absolute inset-[-4px] rounded-full border border-[#78b4f4]" />}
                <LifeBuoy size={19} strokeWidth={2.1} />
                <span className="absolute bottom-[-1px] right-[-1px] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#0067d8]" aria-hidden="true" />
              </button>
              <span className="pointer-events-none absolute left-1/2 top-[43px] -translate-x-1/2 whitespace-nowrap text-[8px] font-bold tracking-[.08em] text-[#0067d8]">HELP</span>
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Open Support Centre"
                aria-expanded={centreOpen}
                onClick={() => { setCentreOpen((value) => !value); setHelpOpen(false); setNotificationsOpen(false); }}
                className="flex h-8 items-center gap-2 rounded-full border border-[#cbd8e8] px-3 text-[10px] font-bold text-[#0067d8] transition-colors hover:bg-[#f1f6fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2"
              >
                Support Centre <span className="h-1.5 w-1.5 rounded-full bg-[#d92d20]" />
                <ChevronDown size={12} />
              </button>
              {centreOpen && (
                <div className="support-surface absolute right-0 top-[42px] w-[190px] rounded-lg border border-[#dce5f0] bg-white p-2 shadow-[0_12px_28px_rgba(20,43,75,.16)]">
                  <button type="button" className="w-full rounded-md px-2 py-2 text-left text-[10px] font-semibold text-[#111b31] hover:bg-[#f4f7fb]">Support inbox</button>
                  <button type="button" className="w-full rounded-md px-2 py-2 text-left text-[10px] font-semibold text-[#111b31] hover:bg-[#f4f7fb]">Service updates</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="relative px-7 pt-9">
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#63738e]">Operating account</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <h1 className="text-[22px] font-bold tracking-[-.045em] text-[#111b31]">Good morning, Mica.</h1>
              <p className="mt-1 text-[11px] text-[#63738e]">Here’s what needs your attention today.</p>
            </div>
            <div className="rounded-md border border-[#dce5f0] bg-white px-3 py-2 text-right">
              <p className="text-[8px] font-bold uppercase tracking-[.1em] text-[#63738e]">Available balance</p>
              <p className="mt-0.5 text-[13px] font-bold text-[#111b31]">$846,280.14</p>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-[1.25fr_.75fr] gap-3">
            <div className="h-16 rounded-lg border border-[#dce5f0] bg-white p-3">
              <div className="h-2 w-16 rounded bg-[#e8f2ff]" />
              <div className="mt-3 h-2 w-28 rounded bg-[#edf1f6]" />
            </div>
            <div className="h-16 rounded-lg border border-[#dce5f0] bg-white p-3">
              <div className="h-2 w-12 rounded bg-[#e8f2ff]" />
              <div className="mt-3 h-2 w-16 rounded bg-[#edf1f6]" />
            </div>
          </div>
        </div>

        {helpOpen && (
          <aside id="signal-beacon-help-panel" className="support-surface absolute right-[116px] top-[72px] z-30 w-[270px] rounded-xl border border-[#c8d9ec] bg-white p-4 shadow-[0_18px_42px_rgba(19,50,91,.2)]" aria-label="Help and Support">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#0067d8]">Orientation point</p>
                <h2 className="mt-1 text-[15px] font-bold tracking-[-.03em] text-[#111b31]">Help &amp; Support</h2>
              </div>
              <button type="button" onClick={() => setHelpOpen(false)} aria-label="Close Help and Support" className="grid h-6 w-6 place-items-center rounded-md text-[#63738e] hover:bg-[#f1f6fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8]"><X size={15} /></button>
            </div>
            <button type="button" className="mt-3 flex h-8 w-full items-center gap-2 rounded-md border border-[#dce5f0] px-2.5 text-left text-[10px] text-[#63738e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8]">
              <Search size={13} /> Search Northstar help
            </button>
            <div className="mt-3 grid gap-1">
              <button type="button" className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-[10px] font-semibold text-[#111b31] hover:bg-[#f1f6fc]"><CircleHelp size={14} className="text-[#0067d8]" /> Get guidance for this page</button>
              <button type="button" className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-[10px] font-semibold text-[#111b31] hover:bg-[#f1f6fc]"><BookOpen size={14} className="text-[#0067d8]" /> Browse help topics</button>
              <button type="button" className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-[10px] font-semibold text-[#111b31] hover:bg-[#f1f6fc]"><MessageCircle size={14} className="text-[#0067d8]" /> Contact Northstar support</button>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-[#edf1f6] pt-3 text-[9px] text-[#63738e]"><FileText size={12} /> System status: all services operational</div>
          </aside>
        )}
      </section>
      <p className="mx-auto mt-3 max-w-[640px] text-center text-[9px] font-semibold tracking-[.04em] text-[#7a899e]">SIGNAL BEACON · COMPACT, ALWAYS FINDABLE HELP</p>
    </main>
  );
}