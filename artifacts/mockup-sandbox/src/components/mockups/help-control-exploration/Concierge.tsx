import { useState } from "react";
import {
  Bell,
  ChevronRight,
  Clock3,
  Headphones,
  LifeBuoy,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import "./_group.css";

export function Concierge() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const toggleHelp = () => {
    setHelpOpen((open) => !open);
    setNotificationsOpen(false);
  };

  return (
    <main className="northstar-help-exploration min-h-[360px] overflow-hidden bg-[#f7f9fc] p-5">
      <style>{`
        .concierge-shell { box-shadow: 0 18px 42px rgba(27, 50, 85, .12); }
        .concierge-focus:focus-visible { outline: 3px solid rgba(0,103,216,.34); outline-offset: 3px; }
        .concierge-panel { animation: concierge-in .18s ease-out both; }
        @keyframes concierge-in { from { opacity: 0; transform: translateY(-7px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>

      <section className="concierge-shell relative mx-auto min-h-[320px] max-w-[640px] overflow-hidden rounded-[10px] border border-[#dce5f0] bg-white">
        <header className="flex h-[76px] items-center border-b border-[#e7edf5] px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-[9px] bg-[#0067d8] text-sm font-bold tracking-[-.06em] text-white">N</div>
            <div>
              <p className="text-[14px] font-bold tracking-[-.025em] text-[#111b31]">Northstar</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[.16em] text-[#63738e]">Business banking</p>
            </div>
          </div>
          <nav className="ml-10 flex items-center gap-5 text-[11px] font-semibold text-[#63738e]">
            <span>Overview</span><span>Accounts</span><span>Payments</span>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications, 2 unread"
                aria-expanded={notificationsOpen}
                onClick={() => { setNotificationsOpen((open) => !open); setHelpOpen(false); }}
                className="concierge-focus relative grid h-8 w-8 place-items-center rounded-full text-[#63738e] transition hover:bg-[#f0f5fb] hover:text-[#111b31]"
              >
                <Bell size={17} strokeWidth={1.9} />
                <span className="absolute right-[5px] top-[5px] h-2 w-2 rounded-full border-[1.5px] border-white bg-[#df352b]" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-10 z-20 w-52 rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_14px_30px_rgba(23,47,81,.15)]">
                  <p className="text-[11px] font-bold text-[#111b31]">2 notifications</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#63738e]">Payroll funding needs review.</p>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={helpOpen ? "Close Help and Support" : "Open Help and Support"}
                aria-expanded={helpOpen}
                aria-controls="concierge-help-panel"
                onClick={toggleHelp}
                className={`concierge-focus flex h-9 items-center gap-2 rounded-full border px-2 pr-3 transition ${helpOpen ? "border-[#87bdf2] bg-[#edf6ff]" : "border-[#d4e2ef] bg-[#f9fcff] hover:border-[#9fc9ef] hover:bg-[#f2f8fd]"}`}
              >
                <span className="relative grid h-5 w-5 place-items-center rounded-full bg-[#17395d] text-white">
                  <Headphones size={12} strokeWidth={2.2} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white bg-[#2a9b6e]" />
                </span>
                <span className="text-left leading-none">
                  <span className="block text-[10px] font-bold text-[#17395d]">Help &amp; Support</span>
                  <span className="mt-0.5 block text-[8px] font-medium text-[#63738e]">Concierge available</span>
                </span>
              </button>

              {helpOpen && (
                <aside id="concierge-help-panel" className="concierge-panel absolute right-0 top-11 z-30 w-[278px] overflow-hidden rounded-xl border border-[#d7e4f1] bg-white shadow-[0_18px_42px_rgba(23,47,81,.19)]">
                  <div className="flex items-start gap-3 bg-[#f1f7fd] p-4">
                    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#17395d] text-white">
                      <Headphones size={18} />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#f1f7fd] bg-[#2a9b6e]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-[#111b31]">Help &amp; Support</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-[#4c6380]">A Northstar specialist can help with your workspace.</p>
                    </div>
                    <button aria-label="Close Help and Support" onClick={() => setHelpOpen(false)} className="concierge-focus ml-auto text-[#63738e]"><X size={15} /></button>
                  </div>
                  <div className="p-2">
                    <button onClick={() => window.alert("Starting a secure message with Northstar support.")} className="concierge-focus flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-[#f4f8fc]">
                      <MessageCircle size={16} className="text-[#0067d8]" /><span className="flex-1 text-[11px] font-semibold text-[#24334d]">Message a specialist</span><ChevronRight size={14} className="text-[#8493a8]" />
                    </button>
                    <button onClick={() => window.alert("Opening the help search.")} className="concierge-focus flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-[#f4f8fc]">
                      <Search size={16} className="text-[#0067d8]" /><span className="flex-1 text-[11px] font-semibold text-[#24334d]">Search help articles</span><ChevronRight size={14} className="text-[#8493a8]" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#e7edf5] px-4 py-2.5 text-[9px] font-medium text-[#63738e]"><Clock3 size={12} /> Typically replies within one business hour</div>
                </aside>
              )}
            </div>

            <button type="button" onClick={() => window.alert("Opening Support Centre menu.")} className="concierge-focus flex h-8 items-center rounded-full border border-[#d4deeb] px-3 text-[10px] font-semibold text-[#0067d8] transition hover:bg-[#f5f9fd]">
              Support Centre<span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#df352b]" />
            </button>
          </div>
        </header>

        <div className="px-6 py-7">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#63738e]">Finance overview</p>
          <div className="mt-3 h-4 w-48 rounded bg-[#eaf0f7]" />
          <div className="mt-6 grid grid-cols-[1.25fr_.75fr] gap-4">
            <div className="h-28 rounded-lg border border-[#e3eaf3] bg-[#fbfcfe] p-4"><div className="h-2 w-20 rounded bg-[#dce6f1]" /><div className="mt-4 h-5 w-28 rounded bg-[#e6edf5]" /></div>
            <div className="h-28 rounded-lg border border-[#e3eaf3] bg-[#fbfcfe] p-4"><LifeBuoy size={18} className="text-[#94a4b8]" /><div className="mt-4 h-2 w-16 rounded bg-[#dce6f1]" /></div>
          </div>
        </div>
      </section>
    </main>
  );
}