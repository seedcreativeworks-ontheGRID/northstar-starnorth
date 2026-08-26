import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronRight,
  CircleHelp,
  Clock3,
  Headphones,
  LifeBuoy,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import "./_group.css";

type HubItem = {
  icon: typeof BookOpen;
  title: string;
  description: string;
  meta: string;
};

const hubItems: HubItem[] = [
  {
    icon: Search,
    title: "Find an answer",
    description: "Search guides for payments, approvals, and account access.",
    meta: "Browse resources",
  },
  {
    icon: Headphones,
    title: "Contact support",
    description: "Speak with a business banking specialist.",
    meta: "Typically replies in 12 min",
  },
  {
    icon: ShieldCheck,
    title: "Report a concern",
    description: "Get help with a payment, card, or account security issue.",
    meta: "Protected support path",
  },
];

export function ServiceHub() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCentreOpen, setIsCentreOpen] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsHelpOpen(false);
        setIsNotificationsOpen(false);
        setIsCentreOpen(false);
        helpButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const openHelp = () => {
    setIsHelpOpen((open) => !open);
    setIsNotificationsOpen(false);
    setIsCentreOpen(false);
  };

  return (
    <main className="northstar-help-exploration min-h-full overflow-hidden bg-[#f5f8fc] p-4">
      <div className="relative mx-auto h-[328px] max-w-[648px] overflow-hidden rounded-[10px] border border-[#d9e4f0] bg-[#f9fbfe] shadow-[0_14px_36px_rgba(17,27,49,0.10)]">
        <header className="flex h-[62px] items-center border-b border-[#e0e8f2] bg-[#ffffff] px-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-[7px] bg-[#0067d8] text-[15px] font-bold tracking-[-0.12em] text-white">N</div>
            <span className="text-[13px] font-bold tracking-[-0.03em] text-[#111b31]">NORTHSTAR</span>
            <span className="ml-3 border-l border-[#dce5f0] pl-3 text-[10px] font-medium text-[#63738e]">OPERATIONS</span>
          </div>

          <div className="relative ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications, 2 unread"
                aria-expanded={isNotificationsOpen}
                onClick={() => {
                  setIsNotificationsOpen((open) => !open);
                  setIsHelpOpen(false);
                  setIsCentreOpen(false);
                }}
                className="relative grid h-8 w-8 place-items-center rounded-md text-[#63738e] transition-colors hover:bg-[#eef4fb] hover:text-[#111b31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2"
              >
                <Bell size={17} strokeWidth={1.9} />
                <span className="absolute right-[5px] top-[5px] h-1.5 w-1.5 rounded-full border border-white bg-[#df3d32]" />
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 top-10 z-30 w-56 rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_12px_28px_rgba(17,27,49,0.14)]">
                  <p className="text-[11px] font-bold text-[#111b31]">Notifications</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#63738e]">Two operations need review today.</p>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                ref={helpButtonRef}
                type="button"
                aria-label={isHelpOpen ? "Close Help and Support" : "Open Help and Support"}
                aria-expanded={isHelpOpen}
                aria-controls="service-hub-panel"
                onClick={openHelp}
                className={`group flex h-9 items-center gap-2 rounded-md border px-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2 ${
                  isHelpOpen
                    ? "border-[#0067d8] bg-[#edf5ff] text-[#005bbd]"
                    : "border-[#c8d8eb] bg-[#f7fbff] text-[#173b67] hover:border-[#8eb7e6] hover:bg-[#eef6ff]"
                }`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-[5px] ${isHelpOpen ? "bg-[#0067d8] text-white" : "bg-[#e2effc] text-[#0067d8]"}`}>
                  <LifeBuoy size={13} strokeWidth={2.25} />
                </span>
                <span className="leading-none">
                  <span className="block text-[10px] font-bold tracking-[-0.01em]">Help &amp; Support</span>
                  <span className="mt-1 block text-[8px] font-medium text-[#63738e]">Guidance &amp; service</span>
                </span>
                <ChevronRight className={`ml-0.5 transition-transform ${isHelpOpen ? "rotate-90" : "group-hover:translate-x-0.5"}`} size={13} strokeWidth={2} />
              </button>

              {isHelpOpen && (
                <section
                  id="service-hub-panel"
                  aria-label="Help and Support"
                  className="absolute right-0 top-11 z-30 w-[328px] overflow-hidden rounded-[10px] border border-[#cfddea] bg-white shadow-[0_18px_40px_rgba(17,27,49,0.18)]"
                >
                  <div className="flex items-start justify-between border-b border-[#e4ebf3] bg-[#f7fbff] px-4 py-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CircleHelp size={15} className="text-[#0067d8]" />
                        <h2 className="text-[12px] font-bold tracking-[-0.02em] text-[#111b31]">Help &amp; Support</h2>
                      </div>
                      <p className="mt-1 text-[9px] leading-4 text-[#63738e]">Choose the right path for your task.</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Close Help and Support"
                      onClick={() => setIsHelpOpen(false)}
                      className="grid h-6 w-6 place-items-center rounded-md text-[#63738e] hover:bg-[#e5effa] hover:text-[#111b31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8]"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="p-2">
                    {hubItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          type="button"
                          key={item.title}
                          onClick={() => setIsHelpOpen(false)}
                          className="group flex w-full items-center gap-2.5 rounded-[7px] p-2 text-left hover:bg-[#f3f8fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8]"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[#dce8f5] bg-white text-[#0067d8]">
                            <Icon size={14} strokeWidth={2} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-bold text-[#18243b]">{item.title}</span>
                            <span className="mt-0.5 block text-[8.5px] leading-3 text-[#63738e]">{item.description}</span>
                            <span className="mt-1 flex items-center gap-1 text-[8px] font-semibold text-[#3571ad]">
                              {item.title === "Contact support" && <Clock3 size={9} />}
                              {item.meta}
                            </span>
                          </span>
                          <ChevronRight size={13} className="shrink-0 text-[#8aa0ba] transition-transform group-hover:translate-x-0.5" />
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                aria-label="Open Support Centre"
                aria-expanded={isCentreOpen}
                onClick={() => {
                  setIsCentreOpen((open) => !open);
                  setIsHelpOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="flex h-8 items-center rounded-full border border-[#cbd9e8] bg-white px-3 text-[10px] font-semibold text-[#0067d8] transition-colors hover:bg-[#f5f9fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0067d8] focus-visible:ring-offset-2"
              >
                Support Centre
                <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#df3d32]" />
              </button>
              {isCentreOpen && (
                <div className="absolute right-0 top-10 z-30 w-48 rounded-lg border border-[#dce5f0] bg-white p-3 shadow-[0_12px_28px_rgba(17,27,49,0.14)]">
                  <p className="text-[11px] font-bold text-[#111b31]">Support Centre</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#63738e]">Service updates and account notices.</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex h-[266px]">
          <aside className="w-[122px] border-r border-[#e0e8f2] bg-[#f7fafd] px-3 py-4">
            <p className="px-1 text-[8px] font-bold tracking-[0.12em] text-[#8292aa]">WORKSPACE</p>
            <div className="mt-3 space-y-2.5 text-[9px] font-medium text-[#63738e]">
              <p className="rounded-md bg-[#e6f1fc] px-2 py-1.5 text-[#0067d8]">Overview</p>
              <p className="px-2">Payments</p>
              <p className="px-2">Accounts</p>
              <p className="px-2">Reports</p>
            </div>
          </aside>
          <div className="flex-1 p-5">
            <p className="text-[9px] font-bold tracking-[0.12em] text-[#7588a2]">CASH POSITION</p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-[22px] font-bold tracking-[-0.05em] text-[#111b31]">$4,283,640.72</p>
                <p className="mt-1 text-[9px] text-[#63738e]">Available across 4 accounts</p>
              </div>
              <div className="h-9 w-24 rounded-md border border-[#dce5f0] bg-white p-2">
                <div className="h-1.5 w-14 rounded bg-[#c8def6]" />
                <div className="mt-1.5 h-1.5 w-20 rounded bg-[#e5edf6]" />
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-[#dce5f0] bg-white p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-[#17243c]">Today’s approvals</p>
                <span className="rounded-full bg-[#fff1e9] px-2 py-0.5 text-[8px] font-bold text-[#bb4a14]">3 pending</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-[#eef3f8]">
                <div className="h-1.5 w-[63%] rounded-full bg-[#0067d8]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}