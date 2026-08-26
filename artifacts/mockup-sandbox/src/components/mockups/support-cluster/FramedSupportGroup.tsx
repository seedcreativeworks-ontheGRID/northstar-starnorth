import "./_group.css";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronRight,
  Globe,
  Landmark,
  LifeBuoy,
  LogOut,
  Sparkles,
  User,
  X,
} from "lucide-react";

const menuLink: React.CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: 12,
  textDecoration: "none",
};

function NotificationsPopover() {
  return (
    <div className="ns-popover ns-notifications">
      <div className="ns-popover-title">Notifications</div>
      <div className="ns-notification">
        <b>Action Required: Payroll Funding</b>
        <span>Your upcoming payroll requires $129,493 CAD. Please ensure sufficient funds.</span>
        <small>2 hours ago</small>
      </div>
      <div className="ns-notification">
        <b>New Document Available</b>
        <span>Your July 2026 Transfer Activity Report is ready for review.</span>
        <small>1 day ago</small>
      </div>
    </div>
  );
}

function HelpPopover() {
  return (
    <div id="support-panel" aria-label="Help and Support" className="ns-popover ns-help">
      <div className="ns-help-heading"><LifeBuoy size={15} /> Help &amp; Support</div>
      <p>Find guidance, browse help articles, or chat with our support team.</p>
      {["Help Resource Centre", "Getting Started", "Chat with us"].map((item) => (
        <a key={item} href="#" onClick={(event) => event.preventDefault()} className="ns-guidance-link">
          {item}<ChevronRight size={13} />
        </a>
      ))}
    </div>
  );
}

function SupportCentrePopover() {
  const groups = [
    { icon: User, title: "Self Help", links: ["Help Resource Centre", "Getting Started", "Personalized Training"] },
    { icon: LogOut, title: "Support Requests", links: ["Manage Support", "Submit a Support Ticket"] },
    { icon: Globe, title: "Support Hubs", links: ["Getting Started"] },
    { icon: Landmark, title: "Implementation Tracker", links: ["Track requests", "Attention needed"] },
    { icon: User, title: "Contact Us", links: ["Chat with us", "General Contact"] },
    { icon: Bell, title: "eTask Manager", links: ["Attention needed"] },
  ];
  return (
    <div id="support-centre-menu" aria-label="Support Centre links" className="ns-popover ns-centre">
      <div className="ns-centre-grid">
        {groups.map(({ icon: Icon, title, links }) => (
          <div key={title}>
            <h4><Icon size={14} />{title}</h4>
            {links.map((link) => (
              <a key={link} href="#" onClick={(event) => event.preventDefault()} style={menuLink}>
                {link}{link === "Attention needed" && <i className="ns-red-dot" />}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertBanner({ onDismiss }: { onDismiss: () => void }) {
  const [undo, setUndo] = useState(false);
  return (
    <div className="ns-alert" aria-live="polite">
      <div className="ns-alert-copy">
        <Sparkles size={20} />
        <span>{undo ? <><b>Payroll of $129,493 CAD is due in 1 day has been hidden.</b> Undo to restore it, or dismiss again to continue.</> : <><b>Payroll of $129,493 CAD is due in 1 day</b> — Your balance may be insufficient to cover it.</>}</span>
      </div>
      <div className="ns-alert-actions">
        <button onClick={() => setUndo(false)}>{undo ? "Undo" : "Transfer now"}</button>
        <button className="ns-icon-button ns-alert-close" aria-label="Hide payroll insight" onClick={() => undo ? onDismiss() : setUndo(true)}><X size={18} /></button>
      </div>
    </div>
  );
}

export function FramedSupportGroup() {
  const [open, setOpen] = useState<"notifications" | "help" | "centre" | null>(null);
  const [alertVisible, setAlertVisible] = useState(true);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const clusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!clusterRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  const toggle = (target: "notifications" | "help" | "centre") => setOpen((active) => active === target ? null : target);

  return (
    <div className="northstar-support-cluster ns-frame">
      <style>{`
        .ns-frame { width:680px;height:360px;background:hsl(210,40%,97%);display:flex;flex-direction:column;overflow:hidden }
        .ns-frame button,.ns-frame a { font-family:inherit } .ns-frame button:focus-visible,.ns-frame a:focus-visible { outline:2px solid var(--ring);outline-offset:2px }
        .ns-header { height:60px;padding:0 20px;display:flex;align-items:center;gap:12px;background:#fff;border-bottom:1px solid var(--border);flex-shrink:0 }
        .ns-brand{display:flex;align-items:center;gap:8px;margin-right:8px;white-space:nowrap}.ns-brand span{font-size:14px;font-weight:700;letter-spacing:-.01em}
        .ns-nav{display:flex;align-items:center;gap:4px;flex:1;min-width:0}.ns-nav a{padding:4px 10px;border-radius:6px;font-size:13px;font-weight:500;white-space:nowrap}.ns-nav a:first-child{font-weight:600;color:var(--primary);background:hsl(213 100% 42%/.06)}.ns-nav a:not(:first-child){color:var(--muted-foreground)}
        .ns-right{margin-left:auto;display:flex;align-items:center;gap:10px;flex-shrink:0}.ns-relative{position:relative}.ns-icon-button{border:0;background:transparent;display:flex;align-items:center;justify-content:center;color:var(--muted-foreground);cursor:pointer;padding:4px;border-radius:5px}.ns-icon-button:hover{background:var(--muted)}
        .ns-bell-dot{position:absolute;right:2px;top:2px;width:8px;height:8px;border-radius:999px;background:var(--destructive);border:1.5px solid #fff}
        .ns-support-frame{display:flex;align-items:center;height:42px;padding:3px;background:hsl(213 100% 42%/.035);border:1px solid hsl(213 100% 42%/.20);border-radius:7px;box-shadow:0 1px 3px rgba(15,23,42,.055)}
        .ns-support-action{height:34px;border:0;border-radius:4px;background:transparent;color:var(--primary);padding:0 10px;display:flex;align-items:center;gap:7px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s,box-shadow .15s}
        .ns-support-action:hover{background:hsl(213 100% 42%/.075)}.ns-support-action[data-open="true"]{background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.10)}.ns-support-divider{width:1px;height:20px;background:hsl(213 100% 42%/.18)}
        .ns-help-symbol{display:grid;place-items:center;width:20px;height:20px;border-radius:5px;background:hsl(213 100% 42%/.10)}.ns-support-action[data-open="true"] .ns-help-symbol{background:var(--primary);color:#fff}.ns-chevron{transition:transform .15s}.ns-support-action[data-open="true"] .ns-chevron{transform:rotate(90deg)}.ns-red-dot{width:6px;height:6px;background:var(--destructive);border-radius:999px;display:inline-block;flex:0 0 auto}
        .ns-popover{position:absolute;right:0;top:calc(100% + 8px);z-index:20;background:var(--popover);border:1px solid var(--border);border-radius:6px;box-shadow:0 4px 16px rgba(15,23,42,.12);color:var(--foreground)}.ns-notifications{width:320px}.ns-popover-title{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600}.ns-notification{padding:10px 12px;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:3px}.ns-notification:last-child{border:0}.ns-notification b{font-size:12px}.ns-notification span{font-size:11px;line-height:1.4;color:var(--muted-foreground)}.ns-notification small{font-size:10px;color:var(--muted-foreground);font-weight:500}
        .ns-help{width:280px;padding:16px}.ns-help-heading{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600}.ns-help-heading svg{color:var(--primary)}.ns-help p{font-size:12px;color:var(--muted-foreground);line-height:1.5;margin:10px 0 12px}.ns-guidance-link{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;margin-top:6px;border-radius:5px;background:hsl(213 100% 42%/.035);color:var(--foreground);font-size:12px;font-weight:500;text-decoration:none}.ns-guidance-link:hover{background:hsl(213 100% 42%/.09)}
        .ns-centre{width:420px}.ns-centre-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px 32px;padding:20px}.ns-centre-grid h4{display:flex;align-items:center;gap:6px;font-size:12px;margin:0 0 8px}.ns-centre-grid a{display:flex;align-items:center;gap:6px;margin:0 0 6px}.ns-centre-grid a:hover{color:var(--primary)!important}
        .ns-body{padding:16px 20px;display:flex;flex-direction:column;gap:12px;min-height:0;flex:1}.ns-alert-row{display:flex;gap:12px;align-items:center;min-width:0}.ns-alert-wrap{flex:1;min-width:0}.ns-alert{min-height:60px;border-radius:6px;padding:12px 24px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;background:linear-gradient(to right,#0068b4,#0078bf,#0088ca);box-shadow:0 1px 3px rgba(0,0,0,.1);color:#fff}.ns-alert-copy{display:flex;align-items:center;gap:12px;font-size:12px;line-height:1.4}.ns-alert-actions{display:flex;align-items:center;gap:8px}.ns-alert-actions>button:first-child{height:32px;padding:0 12px;border-radius:99px;border:1px solid rgba(255,255,255,.7);background:transparent;color:#fff;font-size:11px;font-weight:600;white-space:nowrap;cursor:pointer}.ns-alert-close{color:#fff}.ns-insights{height:44px;padding:0 14px;border:1px solid hsl(214,32%,85%);border-radius:6px;background:#fff;box-shadow:0 1px 3px rgba(15,23,42,.06);font-size:12px;font-weight:600;color:var(--foreground);display:flex;gap:8px;align-items:center;white-space:nowrap;cursor:pointer}.ns-insight-count{width:16px;height:16px;border-radius:50%;background:var(--primary);color:#fff;font-size:10px;display:grid;place-items:center}
        .ns-overview{padding-bottom:4px}.ns-overview p{font-size:10px;font-weight:600;letter-spacing:.08em;color:var(--muted-foreground);margin:0 0 2px;text-transform:uppercase}.ns-overview h1{font-size:20px;letter-spacing:-.02em;margin:0}.ns-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.ns-card{background:#fff;border:1px solid var(--border);border-radius:6px;padding:12px}.ns-card span{display:block;font-size:10px;color:var(--muted-foreground);margin-bottom:5px}.ns-card b{font-size:16px}.ns-card small{display:block;font-size:9px;color:var(--muted-foreground);margin-top:6px}
        @media(max-width:700px){.ns-header{padding:0 12px;gap:5px}.ns-brand{margin-right:1px}.ns-nav a:nth-child(n+3){display:none}.ns-nav a{padding:4px 7px;font-size:11px}.ns-right{gap:6px}.ns-support-frame{height:40px;padding:2px}.ns-support-action{height:34px;padding:0 7px;font-size:10px}.ns-alert{padding:10px 12px}.ns-alert-copy{font-size:11px}.ns-insights{padding:0 10px;font-size:11px}.ns-cards{gap:7px}.ns-card{padding:9px}.ns-card b{font-size:14px}}
      `}</style>
      <header className="ns-header">
        <div className="ns-brand"><Landmark size={22} color="var(--primary)" /><span>Northstar</span></div>
        <nav className="ns-nav" aria-label="Main navigation">
          {["Overview", "Payments", "Accounts", "Reports", "Marketplace"].map((item) => <a href="#" onClick={(event) => event.preventDefault()} key={item}>{item}</a>)}
        </nav>
        <div className="ns-right" ref={clusterRef}>
          <div className="ns-relative">
            <button className="ns-icon-button" aria-label="Notifications, 2 unread" aria-expanded={open === "notifications"} onClick={() => toggle("notifications")}><Bell size={20} /><i className="ns-bell-dot" /></button>
            {open === "notifications" && <NotificationsPopover />}
          </div>
          <div className="ns-support-frame" aria-label="Support tools">
            <div className="ns-relative">
              <button className="ns-support-action" data-open={open === "help"} aria-expanded={open === "help"} aria-controls="support-panel" onClick={() => toggle("help")}>
                <span className="ns-help-symbol"><LifeBuoy size={14} strokeWidth={2.25} /></span><span>Help &amp; Support</span><ChevronRight className="ns-chevron" size={13} />
              </button>
              {open === "help" && <HelpPopover />}
            </div>
            <span className="ns-support-divider" aria-hidden="true" />
            <div className="ns-relative">
              <button className="ns-support-action" data-open={open === "centre"} aria-expanded={open === "centre"} aria-controls="support-centre-menu" onClick={() => toggle("centre")}>Support Centre <i className="ns-red-dot" /></button>
              {open === "centre" && <SupportCentrePopover />}
            </div>
          </div>
        </div>
      </header>
      <main className="ns-body">
        <div className="ns-alert-row">
          {alertVisible && <div className="ns-alert-wrap"><AlertBanner onDismiss={() => setAlertVisible(false)} /></div>}
          <button className="ns-insights" aria-expanded={insightsOpen} onClick={() => setInsightsOpen((value) => !value)}><Sparkles size={14} color="var(--primary)" />Northstar Business Insights <span className="ns-insight-count">3</span></button>
        </div>
        <div className="ns-overview"><p>Good morning</p><h1>Overview</h1></div>
        <div className="ns-cards">
          {[["Total Balance", "$2.4M", "+3.2% this month"], ["Pending Payments", "$129.5K", "1 payroll due tomorrow"], ["Incoming", "$84.2K", "Expected this week"], ["Accounts", "8", "Across 3 entities"]].map(([label, value, sub]) => <div className="ns-card" key={label}><span>{label}</span><b>{value}</b><small>{sub}</small></div>)}
        </div>
      </main>
    </div>
  );
}