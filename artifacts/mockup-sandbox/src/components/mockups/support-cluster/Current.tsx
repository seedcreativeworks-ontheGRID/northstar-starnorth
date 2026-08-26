import './_group.css';
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  LifeBuoy,
  Globe,
  User,
  LogOut,
  Landmark,
  ChevronRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
  X,
} from "lucide-react";

// ─── Notification popover stub ──────────────────────────────────────────────

function NotificationsPopover() {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "calc(100% + 8px)",
        width: 320,
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
          Notifications
        </h4>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid var(--border)",
            cursor: "pointer",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 3, color: "var(--foreground)" }}>
            Action Required: Payroll Funding
          </p>
          <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 3, lineHeight: 1.4 }}>
            Your upcoming payroll requires $129,493 CAD. Please ensure sufficient funds.
          </p>
          <p style={{ fontSize: 10, color: "var(--muted-foreground)", fontWeight: 500 }}>2 hours ago</p>
        </div>
        <div style={{ padding: "10px 12px", cursor: "pointer" }}>
          <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 3, color: "var(--foreground)" }}>
            New Document Available
          </p>
          <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 3, lineHeight: 1.4 }}>
            Your July 2026 Transfer Activity Report is ready for review.
          </p>
          <p style={{ fontSize: 10, color: "var(--muted-foreground)", fontWeight: 500 }}>1 day ago</p>
        </div>
      </div>
    </div>
  );
}

// ─── Support Centre popover stub ─────────────────────────────────────────────

function SupportCentrePopover() {
  return (
    <div
      id="support-centre-menu"
      aria-label="Support Centre links"
      style={{
        position: "absolute",
        right: 0,
        top: "calc(100% + 8px)",
        width: 420,
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
        zIndex: 50,
        padding: 0,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px 32px",
          padding: 20,
        }}
      >
        {/* Self Help */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <User style={{ width: 14, height: 14 }} />
            Self Help
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {["Help Resource Centre", "Getting Started", "Personalized Training"].map((label) => (
              <li key={label}>
                <a
                  href="#"
                  style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
                  onClick={(e) => e.preventDefault()}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Requests */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <LogOut style={{ width: 14, height: 14, transform: "rotate(180deg)" }} />
            Support Requests
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {["Manage Support", "Submit a Support Ticket"].map((label) => (
              <li key={label}>
                <a
                  href="#"
                  style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
                  onClick={(e) => e.preventDefault()}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Hubs */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Globe style={{ width: 14, height: 14 }} />
            Support Hubs
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <a
                href="#"
                style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
                onClick={(e) => e.preventDefault()}
              >
                Getting Started
              </a>
            </li>
          </ul>
        </div>

        {/* Implementation Tracker */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Landmark style={{ width: 14, height: 14 }} />
            Implementation Tracker
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <li>
              <a
                href="#"
                style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
                onClick={(e) => e.preventDefault()}
              >
                Track requests
              </a>
            </li>
            <li>
              <a
                href="#"
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onClick={(e) => e.preventDefault()}
              >
                Attention needed
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--destructive)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <User style={{ width: 14, height: 14 }} />
            Contact Us
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {["Chat with us", "General Contact"].map((label) => (
              <li key={label}>
                <a
                  href="#"
                  style={{ fontSize: 12, color: "var(--muted-foreground)", textDecoration: "none" }}
                  onClick={(e) => e.preventDefault()}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* eTask Manager */}
        <div>
          <h4
            style={{
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Bell style={{ width: 14, height: 14 }} />
            eTask Manager
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li>
              <a
                href="#"
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onClick={(e) => e.preventDefault()}
              >
                Attention needed
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--destructive)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Alert Banner (faithful extraction of AlertBanner.tsx) ───────────────────

function AlertBanner({ onDismiss }: { onDismiss: () => void }) {
  const [showUndo, setShowUndo] = useState(false);
  const InsightIcon = Sparkles;
  const title = "Payroll of $129,493 CAD is due in 1 day";
  const detail = "Your balance may be insufficient to cover it.";
  const actionLabel = "Transfer now";

  const handleDismiss = () => {
    if (!showUndo) {
      setShowUndo(true);
    } else {
      onDismiss();
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 20,
        minHeight: 60,
        borderRadius: 6,
        background: "linear-gradient(to right, #0068b4, #0078bf, #0088ca)",
        padding: "12px 24px",
        color: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
      aria-live="polite"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <InsightIcon style={{ width: 20, height: 20, flexShrink: 0, opacity: 0.95 }} />
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, minWidth: 0 }}>
          {showUndo ? (
            <>
              <strong>{title} has been hidden.</strong> Undo to restore it, or dismiss again to continue.
            </>
          ) : (
            <>
              <strong>{title}</strong> — {detail}
            </>
          )}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <button
          style={{
            height: 36,
            padding: "0 16px",
            borderRadius: 99,
            border: "1px solid rgba(255,255,255,0.7)",
            background: "transparent",
            fontSize: 13,
            fontWeight: 500,
            color: "#ffffff",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onClick={() => setShowUndo(false)}
        >
          {showUndo ? "Undo" : actionLabel}
        </button>
        <button
          onClick={handleDismiss}
          aria-label={showUndo ? "Dismiss and show next insight" : `Hide ${title}`}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: 4,
            color: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
}

// ─── Business Insights trigger (faithful extraction of InsightsDrawerTrigger) ─

function InsightsDrawerTrigger({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <button
      onClick={() => onOpenChange(!open)}
      aria-expanded={open}
      aria-controls="business-insights-panel"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 44,
        padding: "0 20px",
        borderRadius: 6,
        border: "1px solid hsl(214, 32%, 85%)",
        background: "#ffffff",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--foreground)",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        fontFamily: "inherit",
        flexShrink: 0,
      }}
    >
      <Sparkles style={{ width: 14, height: 14, color: "var(--primary)", flexShrink: 0 }} />
      Northstar Business Insights
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "var(--primary)",
          color: "#ffffff",
          fontSize: 10,
          fontWeight: 700,
          marginLeft: 4,
          flexShrink: 0,
        }}
      >
        3
      </span>
    </button>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function Current() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSupportCentreOpen, setIsSupportCentreOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(true);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  const supportCentreRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click / Escape
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!supportCentreRef.current?.contains(e.target as Node)) {
        setIsSupportCentreOpen(false);
      }
      if (!supportRef.current?.contains(e.target as Node)) {
        setIsSupportOpen(false);
      }
      if (!notifRef.current?.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSupportCentreOpen(false);
        setIsSupportOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="northstar-support-cluster"
      style={{
        width: 680,
        height: 360,
        background: "hsl(210, 40%, 97%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 60,
            padding: "0 20px",
            gap: 12,
          }}
        >
          {/* Logo mark */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
            <Landmark style={{ width: 22, height: 22, color: "var(--primary)", flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>
              Northstar
            </span>
          </div>

          {/* Nav items (abbreviated) */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flex: 1,
              minWidth: 0,
            }}
          >
            {["Overview", "Payments", "Accounts", "Reports", "Marketplace"].map((item, i) => (
              <a
                key={item}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontSize: 13,
                  fontWeight: i === 0 ? 600 : 500,
                  color: i === 0 ? "var(--primary)" : "var(--muted-foreground)",
                  padding: "4px 10px",
                  borderRadius: 6,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  background: i === 0 ? "hsl(213,100%,42%,0.06)" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* ── Right cluster: Notifications · Help & Support · Support Centre ── */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            {/* Notifications */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                aria-label="Notifications, 2 unread"
                aria-expanded={isNotificationsOpen}
                onClick={() => {
                  setIsSupportCentreOpen(false);
                  setIsSupportOpen(false);
                  setIsNotificationsOpen((v) => !v);
                }}
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "var(--muted-foreground)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Bell style={{ width: 20, height: 20 }} />
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--destructive)",
                    border: "1.5px solid #ffffff",
                  }}
                />
              </button>
              {isNotificationsOpen && <NotificationsPopover />}
            </div>

            {/* Help & Support */}
            <div ref={supportRef} style={{ position: "relative" }}>
              <button
                type="button"
                aria-label={isSupportOpen ? "Close Help and Support" : "Open Help and Support"}
                aria-expanded={isSupportOpen}
                aria-controls="support-panel"
                onClick={() => {
                  setIsNotificationsOpen(false);
                  setIsSupportCentreOpen(false);
                  setIsSupportOpen((v) => !v);
                }}
                style={{
                  display: "flex",
                  height: 36,
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 6,
                  border: isSupportOpen
                    ? "1px solid var(--primary)"
                    : "1px solid hsl(213,100%,42%,0.20)",
                  background: isSupportOpen
                    ? "hsl(213,100%,42%,0.10)"
                    : "hsl(213,100%,42%,0.035)",
                  color: "var(--primary)",
                  padding: "0 10px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    background: isSupportOpen ? "var(--primary)" : "hsl(213,100%,42%,0.10)",
                    flexShrink: 0,
                  }}
                >
                  <LifeBuoy
                    style={{
                      width: 14,
                      height: 14,
                      color: isSupportOpen ? "#ffffff" : "var(--primary)",
                    }}
                    strokeWidth={2.25}
                  />
                </span>
                <span style={{ display: "flex", flexDirection: "column", textAlign: "left", lineHeight: 1 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, display: "block" }}>
                    Help &amp; Support
                  </span>
                </span>
                <ChevronRight
                  style={{
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    transform: isSupportOpen ? "rotate(90deg)" : "none",
                    transition: "transform 0.15s",
                  }}
                  strokeWidth={2}
                />
              </button>

              {/* Help & Support panel stub */}
              {isSupportOpen && (
                <div
                  id="support-panel"
                  aria-label="Help and Support"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: 280,
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
                    zIndex: 50,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <LifeBuoy style={{ width: 15, height: 15, color: "var(--primary)" }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Help &amp; Support</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5, marginBottom: 12 }}>
                    Find guidance, browse help articles, or chat with our support team.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {["Help Resource Centre", "Getting Started", "Chat with us"].map((label) => (
                      <a
                        key={label}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: 12,
                          fontWeight: 500,
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          color: "var(--foreground)",
                          textDecoration: "none",
                        }}
                      >
                        {label}
                        <ChevronRight style={{ width: 13, height: 13, color: "var(--muted-foreground)" }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Support Centre */}
            <div ref={supportCentreRef} style={{ position: "relative" }}>
              <button
                type="button"
                aria-expanded={isSupportCentreOpen}
                aria-controls="support-centre-menu"
                onClick={() => {
                  setIsNotificationsOpen(false);
                  setIsSupportOpen(false);
                  setIsSupportCentreOpen((v) => !v);
                }}
                style={{
                  display: "flex",
                  height: 32,
                  alignItems: "center",
                  borderRadius: 99,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  padding: "0 16px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--primary)",
                  cursor: "pointer",
                  gap: 8,
                  fontFamily: "inherit",
                }}
              >
                Support Centre
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--destructive)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
              </button>
              {isSupportCentreOpen && <SupportCentrePopover />}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body content: AlertBanner + InsightsDrawerTrigger ── */}
      <div
        style={{
          flex: 1,
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 0,
        }}
      >
        {/* Alert row: banner + insights trigger side-by-side when both visible */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
            flexWrap: "nowrap",
          }}
        >
          {isAlertVisible && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <AlertBanner onDismiss={() => setIsAlertVisible(false)} />
            </div>
          )}
          <div style={{ flexShrink: 0, marginLeft: isAlertVisible ? 0 : "auto" }}>
            <InsightsDrawerTrigger open={isInsightsOpen} onOpenChange={setIsInsightsOpen} />
          </div>
        </div>

        {/* Placeholder body — welcome heading context */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 4,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted-foreground)",
                marginBottom: 2,
              }}
            >
              Good morning
            </p>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Overview
            </h1>
          </div>
        </div>

        {/* Skeleton cards row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
            flex: 1,
            alignContent: "start",
          }}
        >
          {[
            { label: "Total Balance", value: "$2.4M", sub: "+3.2% this month" },
            { label: "Pending Payments", value: "$129.5K", sub: "1 payroll due tomorrow" },
            { label: "Awaiting Approval", value: "$42.5K", sub: "1 wire transfer" },
            { label: "Monthly Inflow", value: "$890K", sub: "vs $820K last month" },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              style={{
                background: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label}
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
                {value}
              </p>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
