import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  LifeBuoy,
  MessageSquareText,
  Search,
  X,
} from "lucide-react";
import "./_group.css";

export function SupportPill() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [centreOpen, setCentreOpen] = useState(false);

  const closeOthers = () => {
    setNotificationsOpen(false);
    setCentreOpen(false);
  };

  return (
    <main className="northstar-help-exploration min-h-[360px] w-full overflow-hidden bg-[#f7f9fc] p-5">
      <section
        className="relative min-h-[320px] overflow-hidden rounded-[10px] border border-[#dce5f0] bg-white shadow-[0_10px_28px_rgba(27,53,89,0.08)]"
        aria-label="Northstar business banking header preview"
      >
        <header className="flex h-[68px] items-center border-b border-[#e7edf5] px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5" aria-label="Northstar">
              <span className="grid h-7 w-7 place-items-center rounded-[7px] bg-[#0067d8] text-[15px] font-bold tracking-[-0.08em] text-white">
                N
              </span>
              <span className="text-[15px] font-bold tracking-[-0.035em] text-[#111b31]">northstar</span>
            </div>
            <nav className="flex items-center gap-3 text-[10px] font-semibold text-[#63738e]" aria-label="Primary navigation">
              <span>Overview</span>
              <span>Accounts</span>
              <span>Payments</span>
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications, 2 unread"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setHelpOpen(false);
                  setCentreOpen(false);
                }}
                className="relative grid h-9 w-9 place-items-center rounded-md text-[#63738e] transition-colors hover:bg-[#f1f5fa] hover:text-[#111b31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2"
              >
                <Bell size={18} strokeWidth={1.8} />
                <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-[1.5px] border-white bg-[#d9333f]" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-11 z-20 w-[235px] rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_12px_26px_rgba(27,53,89,0.14)]">
                  <p className="text-[11px] font-bold text-[#111b31]">Notifications</p>
                  <p className="mt-2 text-[10px] leading-4 text-[#63738e]">Two items need your attention today.</p>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label={helpOpen ? "Close Help and Support" : "Open Help and Support"}
                aria-expanded={helpOpen}
                aria-controls="help-and-support-panel"
                onClick={() => {
                  setHelpOpen((open) => !open);
                  closeOthers();
                }}
                className={`flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-[10px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2 ${
                  helpOpen
                    ? "border-[#0067d8] bg-[#eaf3ff] text-[#0058b9]"
                    : "border-[#b8d3f0] bg-[#f5faff] text-[#075bab] hover:border-[#83b8eb] hover:bg-[#eaf3ff]"
                }`}
              >
                <LifeBuoy size={16} strokeWidth={2} />
                <span>Help &amp; Support</span>
                <ChevronDown className={`transition-transform ${helpOpen ? "rotate-180" : ""}`} size={14} strokeWidth={2.2} />
              </button>

              {helpOpen && (
                <aside
                  id="help-and-support-panel"
                  aria-label="Help and Support"
                  className="absolute right-0 top-11 z-30 w-[288px] rounded-[10px] border border-[#cfdae8] bg-white p-4 shadow-[0_18px_36px_rgba(27,53,89,0.18)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[12px] font-bold tracking-[-0.02em] text-[#111b31]">Help &amp; Support</p>
                      <p className="mt-1 text-[10px] text-[#63738e]">How can we help with your workspace?</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Close Help and Support"
                      onClick={() => setHelpOpen(false)}
                      className="grid h-6 w-6 place-items-center rounded text-[#63738e] hover:bg-[#f1f5fa] hover:text-[#111b31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8]"
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => undefined}
                    className="mt-3 flex h-9 w-full items-center gap-2 rounded-md border border-[#dce5f0] px-2.5 text-left text-[10px] text-[#63738e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8]"
                  >
                    <Search size={14} />
                    <span>Search help articles</span>
                  </button>
                  <div className="mt-2 divide-y divide-[#e7edf5]">
                    <button type="button" onClick={() => undefined} className="flex w-full items-center gap-2.5 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0067d8]">
                      <BookOpen size={15} className="text-[#0067d8]" />
                      <span><b className="block text-[10px] text-[#111b31]">Explore the knowledge base</b><span className="text-[9px] text-[#63738e]">Guides for common banking tasks</span></span>
                      <ExternalLink size={12} className="ml-auto text-[#63738e]" />
                    </button>
                    <button type="button" onClick={() => undefined} className="flex w-full items-center gap-2.5 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0067d8]">
                      <MessageSquareText size={15} className="text-[#0067d8]" />
                      <span><b className="block text-[10px] text-[#111b31]">Contact Northstar support</b><span className="text-[9px] text-[#63738e]">Mon–Fri, 8:00–18:00 ET</span></span>
                    </button>
                  </div>
                </aside>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Open Support Centre"
                aria-expanded={centreOpen}
                onClick={() => {
                  setCentreOpen((open) => !open);
                  setHelpOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex h-9 items-center gap-1.5 rounded-full border border-[#d6e0ec] bg-white px-2.5 text-[10px] font-bold text-[#075bab] transition-colors hover:bg-[#f5faff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2"
              >
                Support Centre
                <span className="h-1.5 w-1.5 rounded-full bg-[#d9333f]" />
              </button>
              {centreOpen && (
                <div className="absolute right-0 top-11 z-20 w-[210px] rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_12px_26px_rgba(27,53,89,0.14)]">
                  <p className="text-[11px] font-bold text-[#111b31]">Support Centre</p>
                  <p className="mt-2 text-[10px] leading-4 text-[#63738e]">Service updates and account notices.</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#63738e]">Operating account</p>
            <p className="mt-1 text-[18px] font-bold tracking-[-0.04em] text-[#111b31]">Daily overview</p>
          </div>
          <span className="rounded-full bg-[#edf7f1] px-2.5 py-1 text-[9px] font-bold text-[#307754]">All services operating normally</span>
        </div>
        <div className="mx-5 mt-4 h-20 rounded-lg border border-[#e7edf5] bg-[#fbfcfe]" />

        {!helpOpen && (
          <div className="absolute bottom-4 right-[145px] flex items-center gap-1.5 text-[9px] font-semibold text-[#63738e]">
            <CircleHelp size={13} className="text-[#0067d8]" />
            Direct help is one clear action away
          </div>
        )}
      </section>
    </main>
  );
}