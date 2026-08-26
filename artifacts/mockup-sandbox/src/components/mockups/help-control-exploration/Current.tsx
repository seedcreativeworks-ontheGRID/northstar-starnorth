import './_group.css';
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Bell,
  LifeBuoy,
  Globe,
  User,
  LogOut,
  Landmark,
  Search,
  ChevronRight,
  ArrowLeft,
  MessageCircle,
  FileText,
  Send,
  ThumbsUp,
  ThumbsDown,
  Shield,
  CreditCard,
  ArrowRightLeft,
  Users,
  Check,
  X,
} from "lucide-react";

// ─── Support panel data ────────────────────────────────────────────────────────

type Category = { id: string; name: string; icon: React.ElementType };

const CATEGORIES: Category[] = [
  { id: "account", name: "Account Management", icon: Users },
  { id: "payments", name: "Payments & Transfers", icon: ArrowRightLeft },
  { id: "cards", name: "Corporate Cards", icon: CreditCard },
  { id: "security", name: "Security & Access", icon: Shield },
];

type Article = { id: string; categoryId: string; title: string; excerpt: string };

const ARTICLES: Article[] = [
  {
    id: "role-management",
    categoryId: "account",
    title: "How to manage user roles and permissions",
    excerpt: "Learn how to add team members and assign appropriate access levels.",
  },
  {
    id: "payment-times",
    categoryId: "payments",
    title: "Understanding payment processing times",
    excerpt: "Typical timelines for domestic and international transfers.",
  },
  {
    id: "corporate-card",
    categoryId: "cards",
    title: "Requesting a physical corporate card",
    excerpt: "How to order a physical card for yourself or a team member.",
  },
  {
    id: "setup-2fa",
    categoryId: "security",
    title: "Setting up two-factor authentication (2FA)",
    excerpt: "Secure your account using an authenticator app or SMS.",
  },
  {
    id: "dispute-charge",
    categoryId: "security",
    title: "Disputing an unauthorized card charge",
    excerpt: "Steps to take if you notice a transaction you don't recognize.",
  },
];

type ChatMessage = { id: string; sender: "user" | "agent"; text: string };

// ─── Compact support panel (representation of real panel) ─────────────────────

function SupportPanelContent({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"home" | "article" | "chat">("home");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "agent", text: "Hi there. I'm a Northstar support specialist. How can I help you today?" },
  ]);
  const [feedbackState, setFeedbackState] = useState<"none" | "helpful" | "not-helpful">("none");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === "chat" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [view, chatMessages]);

  const activeArticle = useMemo(() => ARTICLES.find((a) => a.id === activeArticleId) || null, [activeArticleId]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ARTICLES.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  }, [searchQuery]);

  const categoryArticles = useMemo(
    () => ARTICLES.filter((a) => a.categoryId === activeCategoryId),
    [activeCategoryId],
  );

  const handleOpenArticle = (id: string) => {
    setActiveArticleId(id);
    setFeedbackState("none");
    setView("article");
  };

  const handleBackToHome = () => {
    setView("home");
    setActiveArticleId(null);
    setSearchQuery("");
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId((c) => (c === categoryId ? null : categoryId));
    setSearchQuery("");
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: "user", text: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "agent", text: "Thanks for reaching out. I'm looking into this for you right now." },
      ]);
    }, 1000);
  };

  return (
    <div
      id="support-panel"
      aria-label="Help and Support"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: 320,
        maxHeight: 420,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        border: "1px solid var(--northstar-line)",
        borderRadius: 8,
        boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--northstar-line)",
          background: "rgba(255,255,255,0.97)",
          padding: "12px 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LifeBuoy style={{ width: 15, height: 15, color: "var(--northstar-blue)", flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--northstar-ink)" }}>Help & Support</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Support panel"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            borderRadius: 4,
            color: "var(--northstar-muted)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", background: "rgba(255,255,255,0.5)" }}>
        {view === "home" && (
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 13,
                  height: 13,
                  color: "var(--northstar-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                style={{
                  width: "100%",
                  padding: "7px 10px 7px 30px",
                  fontSize: 12,
                  border: "1px solid var(--northstar-line)",
                  borderRadius: 7,
                  background: "#fff",
                  color: "var(--northstar-ink)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {searchQuery.trim() ? (
              <div>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--northstar-muted)",
                    marginBottom: 8,
                  }}
                >
                  Search Results
                </p>
                {filteredArticles.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {filteredArticles.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleOpenArticle(a.id)}
                        style={{
                          background: "#fff",
                          border: "1px solid var(--northstar-line)",
                          borderRadius: 8,
                          padding: "10px 12px",
                          textAlign: "left",
                          cursor: "pointer",
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--northstar-ink)", marginBottom: 2 }}>{a.title}</p>
                          <p style={{ fontSize: 11, color: "var(--northstar-muted)", lineHeight: 1.4 }}>{a.excerpt}</p>
                        </div>
                        <ChevronRight style={{ width: 14, height: 14, color: "var(--northstar-muted)", flexShrink: 0, marginTop: 2 }} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: "var(--northstar-muted)", textAlign: "center", padding: "20px 0" }}>No results found.</p>
                )}
              </div>
            ) : (
              <>
                {/* Browse by topic */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--northstar-muted)", marginBottom: 8 }}>
                    Browse by Topic
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        aria-pressed={activeCategoryId === cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          padding: "10px 8px",
                          borderRadius: 10,
                          border: activeCategoryId === cat.id ? "1px solid rgba(0,103,216,0.4)" : "1px solid var(--northstar-line)",
                          background: activeCategoryId === cat.id ? "rgba(0,103,216,0.08)" : "#fff",
                          cursor: "pointer",
                          textAlign: "center",
                        }}
                      >
                        <cat.icon style={{ width: 16, height: 16, color: "var(--northstar-blue)" }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--northstar-ink)" }}>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  {activeCategoryId && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--northstar-ink)" }}>
                          {CATEGORIES.find((c) => c.id === activeCategoryId)?.name} articles
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveCategoryId(null)}
                          style={{ fontSize: 11, fontWeight: 500, color: "var(--northstar-blue)", background: "none", border: "none", cursor: "pointer" }}
                        >
                          Clear
                        </button>
                      </div>
                      {categoryArticles.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => handleOpenArticle(a.id)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 8,
                            padding: "9px 11px",
                            borderRadius: 7,
                            border: "1px solid var(--northstar-line)",
                            background: "#fff",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                        >
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 500, color: "var(--northstar-ink)", marginBottom: 2 }}>{a.title}</p>
                            <p style={{ fontSize: 11, color: "var(--northstar-muted)", lineHeight: 1.4 }}>{a.excerpt}</p>
                          </div>
                          <ChevronRight style={{ width: 13, height: 13, color: "var(--northstar-muted)", flexShrink: 0, marginTop: 2 }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular articles */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--northstar-muted)", marginBottom: 6 }}>
                    Popular Articles
                  </p>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {ARTICLES.slice(0, 3).map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleOpenArticle(a.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 6,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <FileText style={{ width: 14, height: 14, color: "var(--northstar-muted)", flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--northstar-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {a.title}
                          </span>
                        </div>
                        <ChevronRight style={{ width: 13, height: 13, color: "rgba(99,115,142,0.5)", flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {view === "article" && activeArticle && (
          <div style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(220,229,240,0.6)", flexShrink: 0 }}>
              <button
                onClick={handleBackToHome}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--northstar-blue)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <ArrowLeft style={{ width: 12, height: 12 }} />
                Back to Help Center
              </button>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--northstar-ink)", marginBottom: 10, lineHeight: 1.35 }}>
                {activeArticle.title}
              </h2>
              <p style={{ fontSize: 12, color: "var(--northstar-muted)", lineHeight: 1.55 }}>{activeArticle.excerpt}</p>
              <div style={{ marginTop: 16, borderTop: "1px solid var(--northstar-line)", paddingTop: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: "var(--northstar-ink)", textAlign: "center", marginBottom: 10 }}>
                  Was this article helpful?
                </p>
                {feedbackState === "none" ? (
                  <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                    {(["helpful", "not-helpful"] as const).map((fb) => (
                      <button
                        key={fb}
                        onClick={() => setFeedbackState(fb)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11,
                          fontWeight: 500,
                          padding: "5px 12px",
                          borderRadius: 99,
                          border: "1px solid var(--northstar-line)",
                          background: "#fff",
                          cursor: "pointer",
                          color: "var(--northstar-ink)",
                        }}
                      >
                        {fb === "helpful" ? <ThumbsUp style={{ width: 12, height: 12 }} /> : <ThumbsDown style={{ width: 12, height: 12 }} />}
                        {fb === "helpful" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: 11, color: "var(--northstar-muted)" }}>
                    <Check style={{ width: 12, height: 12, color: "#16a34a" }} />
                    Thank you for your feedback.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(220,229,240,0.6)", background: "#fff", flexShrink: 0 }}>
              <button
                onClick={() => setView(activeArticleId ? "article" : "home")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--northstar-blue)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <ArrowLeft style={{ width: 12, height: 12 }} />
                {activeArticleId ? "Back to article" : "Back to Help Center"}
              </button>
            </div>
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 14px 6px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "rgba(0,103,216,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <LifeBuoy style={{ width: 20, height: 20, color: "var(--northstar-blue)" }} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--northstar-ink)" }}>Northstar Support</p>
                <p style={{ fontSize: 11, color: "var(--northstar-muted)", textAlign: "center", marginTop: 2 }}>Typically replies in under 5 minutes.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                    {msg.sender === "agent" && (
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "var(--northstar-blue)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 7,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <LifeBuoy style={{ width: 12, height: 12, color: "#fff" }} />
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "8px 12px",
                        borderRadius: msg.sender === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                        fontSize: 12,
                        lineHeight: 1.45,
                        background: msg.sender === "user" ? "var(--northstar-blue)" : "#fff",
                        color: msg.sender === "user" ? "#fff" : "var(--northstar-ink)",
                        border: msg.sender === "agent" ? "1px solid var(--northstar-line)" : "none",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--northstar-line)", background: "#f8fafc", flexShrink: 0 }}>
              <form onSubmit={handleSendChat} style={{ position: "relative" }}>
                <input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 38px 8px 14px",
                    fontSize: 12,
                    borderRadius: 99,
                    border: "1px solid var(--northstar-line)",
                    background: "#fff",
                    color: "var(--northstar-ink)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  aria-label="Send message"
                  style={{
                    position: "absolute",
                    right: 5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--northstar-blue)",
                    border: "none",
                    cursor: chatInput.trim() ? "pointer" : "default",
                    opacity: chatInput.trim() ? 1 : 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <Send style={{ width: 12, height: 12, marginLeft: -1 }} />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      {(view === "home" || view === "article") && (
        <div
          style={{
            padding: "12px 14px",
            borderTop: "1px solid var(--northstar-line)",
            background: "#fff",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              borderRadius: 10,
              border: "1px solid rgba(0,103,216,0.1)",
              background: "rgba(0,103,216,0.04)",
              padding: "10px 12px",
            }}
          >
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--northstar-ink)", marginBottom: 1 }}>Still need help?</p>
              <p style={{ fontSize: 11, color: "var(--northstar-muted)" }}>Chat with our support team.</p>
            </div>
            <button
              onClick={() => setView("chat")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 500,
                padding: "6px 12px",
                borderRadius: 99,
                border: "none",
                background: "var(--northstar-blue)",
                color: "#fff",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <MessageCircle style={{ width: 12, height: 12 }} />
              Chat with us
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function Current() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSupportCentreOpen, setIsSupportCentreOpen] = useState(false);
  const supportCentreRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
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
      className="northstar-help-exploration"
      style={{
        width: 680,
        height: 360,
        background: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 48,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--northstar-muted)",
          marginBottom: 16,
        }}
      >
        Current — Header utility strip (desktop, 1280px)
      </p>

      {/* Header strip */}
      <div
        style={{
          width: 560,
          background: "#ffffff",
          borderRadius: 10,
          border: "1px solid var(--northstar-line)",
          boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
          padding: "0 20px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Landmark style={{ width: 26, height: 26, color: "var(--northstar-blue)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em", color: "var(--northstar-blue)" }}>
            Northstar
          </span>
        </div>

        {/* Nav stub */}
        <div style={{ display: "flex", gap: 24 }}>
          {["Accounts", "Payments", "Reports"].map((label) => (
            <span
              key={label}
              style={{ fontSize: 13, fontWeight: 500, color: "var(--northstar-muted)" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Right utility cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
          {/* Bell / Notifications */}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--northstar-muted)",
                transition: "color 0.15s",
              }}
            >
              <Bell style={{ width: 18, height: 18 }} />
              {/* Unread dot */}
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#d92b2b",
                  border: "1.5px solid #fff",
                }}
              />
            </button>

            {isNotificationsOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 300,
                  background: "#fff",
                  border: "1px solid var(--northstar-line)",
                  borderRadius: 8,
                  boxShadow: "0 6px 24px rgba(15,23,42,0.10)",
                  zIndex: 50,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid rgba(220,229,240,0.5)",
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--northstar-ink)" }}>Notifications</p>
                </div>
                <div>
                  {[
                    {
                      title: "Action Required: Payroll Funding",
                      body: "Your upcoming payroll requires $129,493 CAD. Please ensure sufficient funds.",
                      time: "2 hours ago",
                    },
                    {
                      title: "New Document Available",
                      body: "Your July 2026 Transfer Activity Report is ready for review.",
                      time: "1 day ago",
                    },
                  ].map((n, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 14px",
                        borderTop: i > 0 ? "1px solid rgba(220,229,240,0.5)" : undefined,
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--northstar-ink)", marginBottom: 3 }}>{n.title}</p>
                      <p style={{ fontSize: 10, color: "var(--northstar-muted)", lineHeight: 1.45, marginBottom: 3 }}>{n.body}</p>
                      <p style={{ fontSize: 10, fontWeight: 500, color: "var(--northstar-muted)" }}>{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help & Support (LifeBuoy) — exact current design */}
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
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: isSupportOpen ? "rgba(0,103,216,0.1)" : "none",
                color: isSupportOpen ? "var(--northstar-blue)" : "var(--northstar-muted)",
                transition: "background 0.15s, color 0.15s",
                outline: "none",
              }}
            >
              <LifeBuoy style={{ width: 20, height: 20 }} />
            </button>

            {isSupportOpen && <SupportPanelContent onClose={() => setIsSupportOpen(false)} />}
          </div>

          {/* Support Centre pill */}
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
                alignItems: "center",
                height: 32,
                padding: "0 14px",
                borderRadius: 99,
                border: "1px solid var(--northstar-line)",
                background: "transparent",
                fontSize: 11,
                fontWeight: 500,
                color: "var(--northstar-blue)",
                cursor: "pointer",
                gap: 6,
                transition: "background 0.15s",
              }}
            >
              Support Centre
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#d92b2b",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </button>

            {isSupportCentreOpen && (
              <div
                id="support-centre-menu"
                aria-label="Support Centre links"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: 360,
                  background: "#fff",
                  border: "1px solid var(--northstar-line)",
                  borderRadius: 8,
                  boxShadow: "0 6px 24px rgba(15,23,42,0.10)",
                  zIndex: 50,
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px 28px",
                }}
              >
                {[
                  { icon: User, label: "Self Help", links: ["Help Resource Centre", "Getting Started", "Personalized Training"] },
                  { icon: LogOut, label: "Support Requests", links: ["Manage Support", "Submit a Support Ticket"] },
                  { icon: Globe, label: "Support Hubs", links: ["Getting Started"] },
                  { icon: Landmark, label: "Implementation Tracker", links: ["Track requests", "Attention needed"] },
                  { icon: User, label: "Contact Us", links: ["Chat with us", "General Contact"] },
                  { icon: Bell, label: "eTask Manager", links: ["Attention needed"] },
                ].map((section) => (
                  <div key={section.label}>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--northstar-ink)",
                        marginBottom: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <section.icon style={{ width: 12, height: 12 }} />
                      {section.label}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                      {section.links.map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            style={{ fontSize: 11, color: "var(--northstar-muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                          >
                            {link}
                            {link === "Attention needed" && (
                              <span
                                style={{ width: 5, height: 5, borderRadius: "50%", background: "#d92b2b", display: "inline-block" }}
                              />
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Annotation */}
      <p
        style={{
          marginTop: 14,
          fontSize: 10,
          color: "var(--northstar-muted)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Click the life-ring to open Help &amp; Support &nbsp;|&nbsp; Click the bell or Support Centre pill to see those controls
      </p>
    </div>
  );
}
