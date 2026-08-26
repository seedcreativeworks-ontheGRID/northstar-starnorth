import { useState, useMemo, useRef, useEffect } from "react";
import {
  LifeBuoy,
  X,
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
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Category = {
  id: string;
  name: string;
  icon: React.ElementType;
};

const CATEGORIES: Category[] = [
  { id: "account", name: "Account Management", icon: Users },
  { id: "payments", name: "Payments & Transfers", icon: ArrowRightLeft },
  { id: "cards", name: "Corporate Cards", icon: CreditCard },
  { id: "security", name: "Security & Access", icon: Shield },
];

type Article = {
  id: string;
  categoryId: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
};

const ARTICLES: Article[] = [
  {
    id: "role-management",
    categoryId: "account",
    title: "How to manage user roles and permissions",
    excerpt: "Learn how to add team members and assign appropriate access levels.",
    content: (
      <div className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
        <p>
          Northstar allows you to assign specific roles to team members to ensure they have the exact access they need to do their jobs safely.
        </p>
        <h3 className="text-[14px] font-semibold text-foreground mt-6 mb-2">Available Roles</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-foreground font-medium">Administrator:</strong> Full access to all accounts, settings, and user management.</li>
          <li><strong className="text-foreground font-medium">Finance Manager:</strong> Can initiate and approve transfers, view statements, but cannot add new users.</li>
          <li><strong className="text-foreground font-medium">Viewer:</strong> Read-only access to balances and transaction history.</li>
        </ul>
        <h3 className="text-[14px] font-semibold text-foreground mt-6 mb-2">Changing a role</h3>
        <p>
          Navigate to Settings &gt; Team. Click the three dots next to a team member's name and select "Edit Role". Changes take effect immediately.
        </p>
      </div>
    ),
  },
  {
    id: "payment-times",
    categoryId: "payments",
    title: "Understanding payment processing times",
    excerpt: "Typical timelines for domestic and international transfers.",
    content: (
      <div className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
        <p>
          Payment processing times vary based on the method, destination, and time of initiation. All times are based on business days (Monday-Friday, excluding banking holidays).
        </p>
        <div className="rounded-md border border-border/60 bg-white overflow-x-auto mt-4">
          <table className="w-full min-w-[300px] text-left text-[12px]">
            <thead className="bg-muted/30 border-b border-border/60">
              <tr>
                <th className="px-4 py-2 font-medium text-foreground">Transfer Type</th>
                <th className="px-4 py-2 font-medium text-foreground">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="px-4 py-2 border-t border-border/60">Domestic Wire</td>
                <td className="px-4 py-2 border-t border-border/60">Same day (if before 3 PM EST)</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-border/60">EFT / ACH</td>
                <td className="px-4 py-2 border-t border-border/60">1-2 business days</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border-t border-border/60">International Wire</td>
                <td className="px-4 py-2 border-t border-border/60">2-5 business days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "corporate-card",
    categoryId: "cards",
    title: "Requesting a physical corporate card",
    excerpt: "How to order a physical card for yourself or a team member.",
    content: (
      <div className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
        <p>
          Virtual cards are issued instantly, but you can also request a physical card to be mailed to your office or a team member's address.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-foreground">
          <li>Go to the <strong className="font-medium">Cards</strong> section in the dashboard.</li>
          <li>Click <strong className="font-medium">Issue New Card</strong>.</li>
          <li>Select <strong className="font-medium">Physical Card</strong> as the format.</li>
          <li>Assign the card to a user and set a spending limit.</li>
          <li>Confirm the shipping address. Cards typically arrive within 5-7 business days.</li>
        </ol>
      </div>
    ),
  },
  {
    id: "setup-2fa",
    categoryId: "security",
    title: "Setting up two-factor authentication (2FA)",
    excerpt: "Secure your account using an authenticator app or SMS.",
    content: (
      <div className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
        <p>
          We strongly recommend enabling 2FA for all team members to protect your business accounts.
        </p>
        <p>
          To enable 2FA:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-foreground">
          <li>Click on your profile avatar in the bottom left and select <strong className="font-medium">Security</strong>.</li>
          <li>Under Two-Factor Authentication, click <strong className="font-medium">Enable</strong>.</li>
          <li>Choose your preferred method: Authenticator App (recommended) or SMS.</li>
          <li>Follow the on-screen instructions to verify your device.</li>
        </ol>
        <p>
          Make sure to save your backup codes in a secure location in case you lose access to your primary device.
        </p>
      </div>
    ),
  },
  {
    id: "dispute-charge",
    categoryId: "security",
    title: "Disputing an unauthorized card charge",
    excerpt: "Steps to take if you notice a transaction you don't recognize.",
    content: (
      <div className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
        <p>
          If you see a charge on your Northstar card that you did not authorize, act quickly to secure your account.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-foreground">
          <li><strong className="font-medium">Freeze the card:</strong> Go to the Cards section, select the affected card, and click "Freeze". This prevents any further unauthorized charges.</li>
          <li><strong className="font-medium">Review the transaction:</strong> Click on the suspicious transaction to view merchant details. Sometimes charges appear under a parent company name.</li>
          <li><strong className="font-medium">Submit a dispute:</strong> From the transaction details panel, click "Dispute Charge" and provide the required information.</li>
        </ol>
        <p>
          Our team will investigate and typically resolve disputes within 10-14 business days.
        </p>
      </div>
    ),
  },
];

type ChatMessage = {
  id: string;
  sender: "user" | "agent";
  text: string;
};

// Simulated demo chat response with realistic delay
const DEMO_AGENT_RESPONSE =
  "Thanks for sharing that. This simulated response demonstrates how support guidance would appear here. No real ticket was created, no message was logged, and no agent was notified.";
const DEMO_RESPONSE_DELAY_MS = 1200;

export function SupportPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [view, setView] = useState<"home" | "article" | "chat">("home");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hi there. I'm a simulated Northstar support assistant. How can I help you today? Note: this is a demo — no real support ticket will be submitted.",
    },
  ]);
  const [feedbackState, setFeedbackState] = useState<"none" | "helpful" | "not-helpful">("none");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const agentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (view === "chat" && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [view, chatMessages, isAgentTyping]);

  // Listen for northstar:support-action events to switch views
  useEffect(() => {
    const handleSupportAction = (event: Event) => {
      const customEvent = event as CustomEvent<{ view: "home" | "chat" }>;
      const targetView = customEvent.detail?.view;
      if (targetView === "home" || targetView === "chat") {
        setView(targetView);
      }
    };
    window.addEventListener("northstar:support-action", handleSupportAction);
    return () => {
      window.removeEventListener("northstar:support-action", handleSupportAction);
    };
  }, []);

  // Clean up agent response timer on unmount
  useEffect(() => {
    return () => {
      if (agentTimerRef.current !== null) {
        clearTimeout(agentTimerRef.current);
      }
    };
  }, []);

  const activeArticle = useMemo(() => ARTICLES.find((a) => a.id === activeArticleId) || null, [activeArticleId]);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return ARTICLES.filter((a) => a.title.toLowerCase().includes(query) || a.excerpt.toLowerCase().includes(query));
  }, [searchQuery]);

  const categoryArticles = useMemo(
    () => ARTICLES.filter((article) => article.categoryId === activeCategoryId),
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
    setActiveCategoryId((current) => current === categoryId ? null : categoryId);
    setSearchQuery("");
  };

  const handleFeedback = (feedback: "helpful" | "not-helpful") => {
    setFeedbackState(feedback);
    toast({
      title: feedback === "helpful" ? "Thanks for your feedback!" : "Feedback received",
      description:
        feedback === "helpful"
          ? "We're glad this article was helpful."
          : "Thanks for letting us know. We'll work on improving this article.",
    });
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isAgentTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: chatInput.trim(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsAgentTyping(true);

    // Simulate agent typing and response
    agentTimerRef.current = setTimeout(() => {
      setIsAgentTyping(false);
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: DEMO_AGENT_RESPONSE,
      };
      setChatMessages((prev) => [...prev, responseMessage]);
      setChatCompleted(true);
      toast({
        title: "Demo response sent",
        description: "This is a simulated support response. No real ticket has been submitted.",
      });
    }, DEMO_RESPONSE_DELAY_MS);
  };

  if (!open) return null;

  return (
    <aside
      id="support-panel"
      aria-label="Help and Support"
      className="dashboard-panel animate-in fade-in slide-in-from-right-4 duration-200 border border-border/60 bg-[#f8fafc] shadow-[-10px_0_28px_rgba(15,23,42,0.08)] lg:border-y-0 lg:border-r-0 lg:border-l"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border/60 bg-white/95 px-5 py-4 backdrop-blur">
           <div className="flex min-w-0 items-center gap-2">
             <LifeBuoy className="h-4 w-4 shrink-0 text-primary" />
             <h2 className="min-w-0 break-words text-sm font-semibold text-foreground">Help & Support</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Close Support panel"
             className="shrink-0 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden bg-background/50">
          {view === "home" && (
            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search help articles..."
                  className="rounded-lg border-border/80 bg-white pl-9 shadow-sm"
                />
              </div>

              {searchQuery.trim() ? (
                <div className="space-y-4">
                  <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Search Results
                  </h3>
                  {filteredArticles.length > 0 ? (
                    <div className="space-y-2">
                      {filteredArticles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => handleOpenArticle(article.id)}
                          className="group w-full rounded-xl border border-border/60 bg-white p-3 text-left transition-all hover:border-primary/40 hover:shadow-sm"
                        >
                           <div className="flex min-w-0 items-start justify-between gap-2">
                             <div className="min-w-0">
                              <h4 className="text-[13px] font-medium text-foreground transition-colors group-hover:text-primary">
                                {article.title}
                              </h4>
                              <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">{article.excerpt}</p>
                            </div>
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-[13px] font-medium text-foreground">No results found</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">
                        Try adjusting your search terms or contact support for help.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Browse by Topic
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          aria-pressed={activeCategoryId === category.id}
                          onClick={() => handleCategoryChange(category.id)}
                           className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border p-3 sm:p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                            activeCategoryId === category.id
                              ? "border-primary/50 bg-primary/10 shadow-sm"
                              : "border-border/60 bg-white hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          <category.icon className="h-5 w-5 text-primary" />
                             <span className="break-words text-[12px] font-medium text-foreground">{category.name}</span>
                        </button>
                      ))}
                    </div>
                    {activeCategoryId && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-[12px] font-semibold text-foreground">
                            {CATEGORIES.find((category) => category.id === activeCategoryId)?.name} articles
                          </h4>
                          <button
                            type="button"
                            onClick={() => setActiveCategoryId(null)}
                            className="text-[11px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            Clear
                          </button>
                        </div>
                        {categoryArticles.map((article) => (
                          <button
                            key={article.id}
                            type="button"
                            onClick={() => handleOpenArticle(article.id)}
                            className="group flex w-full items-start justify-between gap-3 rounded-lg border border-border/60 bg-white p-3 text-left transition-all hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                             <div className="min-w-0">
                              <span className="text-[12px] font-medium text-foreground transition-colors group-hover:text-primary">
                                {article.title}
                              </span>
                              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{article.excerpt}</p>
                            </div>
                            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Popular Articles
                    </h3>
                    <div className="space-y-2">
                      {ARTICLES.slice(0, 3).map((article) => (
                        <button
                          key={article.id}
                          onClick={() => handleOpenArticle(article.id)}
                           className="group flex w-full min-w-0 items-center justify-between gap-2 rounded-lg p-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                           <div className="flex min-w-0 items-center gap-3">
                             <FileText className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                             <span className="min-w-0 break-words text-left text-[13px] font-medium text-foreground transition-colors group-hover:text-primary">
                              {article.title}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {view === "article" && activeArticle && (
            <div className="flex flex-1 flex-col overflow-y-auto bg-white">
              <div className="shrink-0 border-b border-border/40 p-4">
                <button
                  onClick={handleBackToHome}
                  className="flex items-center gap-1.5 rounded-sm text-[12px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Help Center
                </button>
              </div>

               <div className="min-w-0 flex-1 p-4 sm:p-6">
                 <h2 className="mb-6 break-words text-[20px] font-bold leading-snug tracking-tight text-foreground">
                  {activeArticle.title}
                </h2>
                <div className="prose prose-sm max-w-none">{activeArticle.content}</div>

                <div className="mt-10 border-t border-border/60 pt-6">
                  <p className="mb-4 text-center text-[12px] font-medium text-foreground">Was this article helpful?</p>
                  {feedbackState === "none" ? (
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-full text-[12px]"
                        onClick={() => handleFeedback("helpful")}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> Yes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 rounded-full text-[12px]"
                        onClick={() => handleFeedback("not-helpful")}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" /> No
                      </Button>
                    </div>
                  ) : (
                    <div className="mx-auto flex w-fit animate-in fade-in zoom-in-95 items-center justify-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-[12px] text-muted-foreground duration-200">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      Thank you for your feedback.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {view === "chat" && (
            <div className="flex h-full flex-col bg-card">
              <div className="shrink-0 border-b border-border/40 bg-white p-4">
                <button
                  onClick={() => setView(activeArticleId ? "article" : "home")}
                  className="flex items-center gap-1.5 rounded-sm text-[12px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {activeArticleId ? "Back to article" : "Back to Help Center"}
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5" ref={scrollRef}>
                {/* Demo disclaimer banner */}
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-800" role="note">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span>
                    <strong>Demo chat</strong> — This is a simulated conversation. No support ticket will be submitted and no agent will be notified.
                  </span>
                </div>

                <div className="mb-2 flex flex-col items-center justify-center pt-2">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LifeBuoy className="h-6 w-6" />
                  </div>
                  <h3 className="text-[14px] font-medium text-foreground">Northstar Support</h3>
                  <p className="mt-1 max-w-[250px] text-center text-[12px] text-muted-foreground">
                    Simulated demo — no real support agent connected.
                  </p>
                </div>

                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "agent" && (
                      <div className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <LifeBuoy className="h-3.5 w-3.5" />
                      </div>
                    )}
                     <div
                       className={`max-w-[85%] break-words rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                        msg.sender === "user"
                          ? "rounded-br-sm bg-primary text-primary-foreground shadow-sm"
                          : "rounded-bl-sm border border-border/60 bg-white text-foreground shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAgentTyping && (
                  <div className="flex justify-start" role="status" aria-live="polite">
                    <div className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <LifeBuoy className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border/60 bg-white px-4 py-2.5 shadow-sm">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                {chatCompleted && (
                  <div
                    className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-[11px] leading-relaxed text-green-800 animate-in fade-in duration-300"
                    role="status"
                    aria-live="polite"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                    <span>
                      <strong>Simulated response delivered.</strong> No real
                      ticket was created. You can continue exploring the demo or
                      return to the Help Center.
                    </span>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-border/50 bg-background p-4">
                <form onSubmit={handleSendChat} className="relative">
                  <Input
                    placeholder="Type your message..."
                    className="h-11 rounded-full border-border/80 bg-white pr-10 text-[13px] shadow-sm focus-visible:ring-primary/50"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isAgentTyping}
                    aria-label="Type your support message"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isAgentTyping}
                    aria-label="Send message"
                    className="absolute right-2 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
                  >
                    <Send className="-ml-0.5 h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Global sticky footer action (only visible in home or article) */}
          {(view === "home" || view === "article") && (
            <div className="mt-auto shrink-0 border-t border-border/60 bg-white p-5">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                <div>
                  <h4 className="text-[13px] font-semibold text-foreground">Still need help?</h4>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    Open a clearly labeled simulated chat.
                  </p>
                </div>
                <Button
                  onClick={() => setView("chat")}
                  size="sm"
                  className="h-9 shrink-0 rounded-full px-4 text-[12px] shadow-sm"
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  Chat with us
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
