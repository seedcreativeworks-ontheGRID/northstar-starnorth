import { useState, type FormEvent } from "react";
import { Sparkles, X, ChevronDown, ChevronUp, ArrowLeft, Check, Send, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { DASHBOARD_USERS } from "@/store";
import { sendInsightMessage } from "@workspace/api-client-react";

type InsightKey = "shortfall" | "flagged" | "vendor";

type Insight = {
  key: InsightKey;
  title: string;
  date: string;
  copy: string;
  chatPrompt: string;
  chatReply: string;
  actions: string[];
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const BEN_INSIGHTS: Insight[] = [
  {
    key: "shortfall",
    title: "Transfer funds to cover payroll shortfall",
    date: "16 July",
    copy: "Your upcoming payroll of $129,493 CAD is scheduled to process tomorrow, but your current account balance may not fully cover it. Add funds before the processing deadline to avoid a failed or delayed payment.",
    chatPrompt: "Help me cover tomorrow's payroll shortfall.",
    chatReply: "I can help you prepare the funding transfer and make sure the payroll has the information it needs.",
    actions: ["Prepare payroll transfer", "Review available balance", "Set a payroll reminder"],
  },
  {
    key: "flagged",
    title: "Flagged payment awaiting your approval",
    date: "15 July",
    copy: "A wire payment of $42,500 to Contract Supplier Corporation has been flagged for dual approval. Review the payment before its scheduled release time.",
    chatPrompt: "Help me action the flagged payment.",
    chatReply: "I can help you review the payment and prepare the next steps for the right approvers.",
    actions: ["Review payment details", "Prepare approval request", "Contact the payee"],
  },
  {
    key: "vendor",
    title: "Vendor spend trending 23% above baseline",
    date: "12 July",
    copy: "Spend with AWS Services has increased by 23% compared with the previous 3-month average. The projected monthly run rate is $15,200.",
    chatPrompt: "Help me review the vendor spend increase.",
    chatReply: "I can help you investigate the increase, set a watchpoint, and decide what to do next.",
    actions: ["Review spend breakdown", "Set a spend alert", "Prepare a vendor follow-up"],
  },
];

const JAMES_INSIGHTS: Insight[] = [
  {
    key: "shortfall",
    title: "Put this month's surplus cash to work",
    date: "16 July",
    copy: "Your operating accounts are projected to finish the month with an $80,000 surplus. A high-yield investment account could improve returns while keeping funds accessible.",
    chatPrompt: "Help me compare options for the projected surplus.",
    chatReply: "I can help you compare liquidity, yield, and timing before you decide where to place the funds.",
    actions: ["Compare investment options", "Review available balance", "Set a maturity reminder"],
  },
  ...BEN_INSIGHTS.slice(1),
];

// Actions that can be completed (persisted) vs. actions that open another flow
const COMPLETABLE_ACTIONS = new Set([
  "Set a payroll reminder",
  "Set a spend alert",
  "Set a maturity reminder",
]);

// Actions that open the approval detail
const APPROVAL_ACTIONS = new Set([
  "Review payment details",
  "Prepare approval request",
]);

// Actions that open the transfer modal
const TRANSFER_ACTIONS = new Set([
  "Prepare payroll transfer",
]);

// Actions that scroll to accounts
const ACCOUNTS_ACTIONS = new Set([
  "Review available balance",
]);

// Actions that require honest disclosure (external/unsupported)
const DISCLOSURE_ACTIONS = new Set([
  "Review spend breakdown",
  "Compare investment options",
  "Contact the payee",
  "Prepare a vendor follow-up",
]);

export function InsightsDrawerTrigger({
  open,
  onOpenChange,
  compact = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compact?: boolean;
}) {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={() => onOpenChange(!open)}
      aria-expanded={open}
      aria-controls="business-insights-panel"
      className={`insights-trigger-button h-11 justify-center rounded-md border-border/70 px-3 sm:px-5 text-[12px] sm:text-[13px] font-medium gap-2 shadow-sm ${compact ? "insights-trigger-button-compact" : ""}`}
    >
      <Sparkles className="h-3.5 w-3.5 text-primary" />
      {compact ? (
        <>
          <span className="sm:hidden">Insights</span>
          <span className="hidden sm:inline">Northstar Business Insights</span>
        </>
      ) : (
        "Northstar Business Insights"
      )}
      <span className="flex h-4 w-4 rounded-full bg-primary text-[10px] text-white items-center justify-center ml-1 font-bold">
        3
      </span>
    </Button>
  );
}

function getDisclosureForAction(action: string): { title: string; description: string } {
  if (action === "Review spend breakdown") {
    return {
      title: "Spend Breakdown — Not Available in Demo",
      description: "The detailed vendor spend breakdown report is available in the full Northstar platform. In this demo environment, live spend data and drill-down reporting are not connected.",
    };
  }
  if (action === "Compare investment options") {
    return {
      title: "Investment Comparison — Not Available in Demo",
      description: "Comparing investment products requires a live connection to Northstar's treasury management suite. This feature is not available in the demo environment.",
    };
  }
  if (action === "Contact the payee") {
    return {
      title: "Vendor Contact — Not Available in Demo",
      description: "Initiating contact with a payee through Northstar's secure messaging requires a verified business account. This action is not available in the demo environment.",
    };
  }
  if (action === "Prepare a vendor follow-up") {
    return {
      title: "Vendor Follow-up — Not Available in Demo",
      description: "Preparing a vendor follow-up requires access to your vendor directory and outbound messaging. These features are not available in the demo environment.",
    };
  }
  return {
    title: "Feature Not Available in Demo",
    description: `The action "${action}" requires a live Northstar account connection and is not available in this demo environment.`,
  };
}

export function InsightsDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [view, setView] = useState<"list" | "chat">("list");
  const {
    activeUser,
    setTransferModalOpen,
    showDemoDisclosure,
    completeInsightActions,
    completedInsightActions,
  } = useAppStore();
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const { toast } = useToast();
  const [activeInsight, setActiveInsight] = useState<InsightKey | null>(null);
  const [chatInsight, setChatInsight] = useState<InsightKey>("shortfall");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const insights = activeUser === "james" ? JAMES_INSIGHTS : BEN_INSIGHTS;
  const activeChat = insights.find((insight) => insight.key === chatInsight) ?? insights[0];

  const toggleInsight = (key: InsightKey) => {
    setActiveInsight((current) => current === key ? null : key);
  };

  const handleTransferNow = () => {
    onOpenChange(false);
    setTransferModalOpen(true);
  };

  const openChat = (key: InsightKey) => {
    setChatInsight(key);
    setSelectedActions([]);
    setChatMessages([]);
    setChatInput("");
    setChatError(null);
    setView("chat");
  };

  const handleChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message || isSending) return;

    const userMessage: ChatMessage = { role: "user", content: message };
    const seededMessages: ChatMessage[] = [
      { role: "user", content: activeChat.chatPrompt },
      { role: "assistant", content: activeChat.chatReply },
    ];
    const conversationHistory = [
      ...seededMessages,
      ...chatMessages,
    ].slice(-8);

    setChatMessages((current) => [...current, userMessage]);
    setChatInput("");
    setChatError(null);
    setIsSending(true);

    try {
      const response = await sendInsightMessage({
        user: activeUser,
        insightKey: chatInsight,
        message,
        history: conversationHistory,
      });
      setChatMessages((current) => [
        ...current,
        { role: "assistant", content: response.reply },
      ]);
    } catch (error) {
      setChatError(
        error instanceof Error
          ? error.message
          : "Business Insights is temporarily unavailable. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const toggleAction = (action: string) => {
    // Don't allow toggling already-completed actions
    if (completedInsightActions.includes(action)) return;
    setSelectedActions((current) =>
      current.includes(action)
        ? current.filter((selected) => selected !== action)
        : [...current, action],
    );
  };

  const handleActionPlan = () => {
    if (selectedActions.length === 0) {
      toast({
        title: "Choose an action",
        description: "Select one or more actions to continue.",
        variant: "destructive",
      });
      return;
    }

    // Process each selected action according to its type.
    // Priority order: transfer > approval > accounts scroll > completable > disclosure
    // We process all selected actions, executing each one appropriately.

    const hasTransfer = selectedActions.some((a) => TRANSFER_ACTIONS.has(a));
    const hasApproval = selectedActions.some((a) => APPROVAL_ACTIONS.has(a));
    const hasAccounts = selectedActions.some((a) => ACCOUNTS_ACTIONS.has(a));
    const completableSelected = selectedActions.filter((a) => COMPLETABLE_ACTIONS.has(a));
    const disclosureSelected = selectedActions.filter((a) => DISCLOSURE_ACTIONS.has(a));

    // Persist completable actions immediately (don't lose them)
    if (completableSelected.length > 0) {
      completeInsightActions(completableSelected);
      completableSelected.forEach((action) => {
        toast({
          title: "Action saved",
          description: `"${action}" is complete for this browser-tab demo session.`,
        });
      });
    }

    // Handle transfer (closes drawer, opens modal)
    if (hasTransfer) {
      onOpenChange(false);
      setTransferModalOpen(true);
      return;
    }

    // Handle approval actions (dispatch event, close drawer)
    if (hasApproval) {
      onOpenChange(false);
      window.dispatchEvent(
        new CustomEvent("northstar:open-approval", { detail: { id: "app-2" } })
      );
      return;
    }

    // Handle accounts scroll (close drawer, scroll)
    if (hasAccounts) {
      onOpenChange(false);
      setTimeout(() => {
        const el = document.getElementById("accounts");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
      return;
    }

    // Show disclosure for unsupported external actions
    if (disclosureSelected.length > 0) {
      const disclosure = getDisclosureForAction(disclosureSelected[0]);
      showDemoDisclosure(disclosure);
      return;
    }

    // If only completable actions were selected, clear selection
    setSelectedActions([]);
  };

  if (!open) return null;

  return (
    <aside
      id="business-insights-panel"
      aria-label="Northstar Business Insights"
      className="dashboard-panel animate-in fade-in slide-in-from-right-4 duration-200 border border-border/60 bg-[#f8fafc] shadow-[-10px_0_28px_rgba(15,23,42,0.08)] lg:border-y-0 lg:border-r-0 lg:border-l"
    >
      <div className="h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <h2 className="min-w-0 break-words text-sm font-semibold text-foreground">Northstar Business Insights</h2>
          </div>
          <button onClick={() => onOpenChange(false)} aria-label="Close Business Insights panel" className="shrink-0 rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div>
          {view === "list" ? (
            <div className="p-5 sm:p-7">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Business Intelligence</p>
              <h3 className="mb-7 text-[22px] font-bold tracking-tight text-foreground">At a Glance</h3>
              
              <div className="space-y-3.5">
                {insights.map((insight) => {
                  const isSelected = activeInsight === insight.key;
                  const isMuted = activeInsight !== null && !isSelected;

                  return (
                    <section
                      key={insight.key}
                      className={`border-l-[3px] border-primary py-1 pl-4 transition-all duration-200 ${
                        isMuted ? "opacity-50 saturate-50" : "opacity-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleInsight(insight.key)}
                        aria-expanded={isSelected}
                        aria-controls={`insight-${insight.key}`}
                        className="flex w-full items-start justify-between gap-3 text-left"
                      >
                        <h4 className="text-[13px] font-semibold leading-5 text-foreground">{insight.title}</h4>
                        {isSelected ? (
                          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                      </button>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">{insight.date}</p>

                      {isSelected && (
                        <div id={`insight-${insight.key}`} className="mt-4 min-w-0 rounded-xl border border-border/60 bg-white p-4 sm:p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                              <Sparkles className="h-3 w-3" />
                              Business Insight
                            </div>
                            <span className="text-[10px] text-muted-foreground">{insight.date}</span>
                          </div>
                          <h5 className="mb-2 text-[13px] font-semibold text-foreground">{insight.title}</h5>
                          <p className="mb-5 text-[12px] leading-relaxed text-muted-foreground">{insight.copy}</p>
                          <div className="flex flex-wrap gap-2">
                            {activeUser === "ben" && insight.key === "shortfall" && (
                              <Button size="sm" onClick={handleTransferNow} className="h-8 rounded-full px-4 text-[11px] font-medium">
                                Transfer Now
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant={activeUser === "ben" && insight.key === "shortfall" ? "outline" : "default"}
                              onClick={() => openChat(insight.key)}
                              className="h-8 rounded-full border-border/80 px-4 text-[11px] font-medium"
                            >
                              Chat with us
                            </Button>
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
              
              <div className="mt-7 border-t border-border/70 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    showDemoDisclosure({
                      title: "AI Insights Policy — Not Available in Demo",
                      description:
                        "Full details of Northstar's AI Insights policy and responsible AI initiatives are available in the live platform under Settings → AI & Data. This content is not loaded in the demo environment.",
                    })
                  }
                  className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-2 rounded-md px-2 py-2 text-left text-[11px] text-primary transition-colors hover:bg-primary/5 hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  Learn more about our AI Insights Policy/Initiatives
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col bg-card">
              <div className="p-4 border-b border-border/40">
                <button 
                  onClick={() => setView("list")} 
                  className="flex items-center gap-1.5 text-[12px] text-primary font-medium hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to insight
                </button>
              </div>
              
              <div className="flex flex-col gap-6 p-6">
                <div className="mb-1 flex flex-col items-center">
                  <div className="h-10 w-10 bg-destructive rounded-full flex items-center justify-center text-white mb-4 relative">
                    <Sparkles className="h-5 w-5" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="text-[12px] text-foreground text-center">
                    Good day, {DASHBOARD_USERS[activeUser].name}. I&apos;m here to help with this insight.
                  </p>
                </div>

                <div className="self-end bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-[12px] leading-relaxed shadow-sm">
                  {activeChat.chatPrompt}
                </div>

                <div className="self-start max-w-[85%]">
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <div className="text-[12px] text-foreground leading-relaxed">
                      {activeChat.chatReply}
                    </div>
                  </div>
                  <div className="mt-4 min-w-0 rounded-xl border border-border/80 bg-background p-4 shadow-sm">
                    <p className="text-[11px] font-semibold text-foreground">Choose one or more actions</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">Select everything you&apos;d like to action in this conversation.</p>
                    <div className="mt-3 flex flex-col gap-2">
                      {activeChat.actions.map((action) => {
                        const isCompleted = completedInsightActions.includes(action);
                        const isSelected = selectedActions.includes(action);
                        return (
                          <button
                            key={action}
                            type="button"
                            aria-pressed={isSelected}
                            aria-disabled={isCompleted}
                            disabled={isCompleted}
                            onClick={() => toggleAction(action)}
                            className={`flex min-h-9 items-center justify-between rounded-md border px-3 py-2 text-left text-[11px] font-medium transition-colors ${
                              isCompleted
                                ? "border-green-200 bg-green-50 text-green-700 cursor-not-allowed opacity-80"
                                : isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border/80 text-foreground hover:border-primary/50 hover:bg-muted/30"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {isCompleted && <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />}
                              {action}
                            </span>
                            {isCompleted ? (
                              <span className="text-[10px] text-green-600 font-medium ml-2 shrink-0">Done</span>
                            ) : isSelected ? (
                              <Check className="h-3.5 w-3.5 shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      type="button"
                      onClick={handleActionPlan}
                      className="mt-4 h-8 w-full rounded-full text-[11px]"
                    >
                      Continue with selected actions
                    </Button>
                  </div>
                </div>

                {chatMessages.map((message, index) =>
                  message.role === "user" ? (
                    <div
                      key={`${message.role}-${index}`}
                      className="self-end max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-[12px] leading-relaxed text-primary-foreground shadow-sm"
                    >
                      {message.content}
                    </div>
                  ) : (
                    <div
                      key={`${message.role}-${index}`}
                      className="flex max-w-[90%] items-start gap-2 self-start"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Sparkles className="h-3 w-3" />
                      </div>
                      <div className="whitespace-pre-wrap text-[12px] leading-relaxed text-foreground">
                        {message.content}
                      </div>
                    </div>
                  ),
                )}

                {isSending && (
                  <div
                    className="flex items-center gap-2 self-start text-[12px] text-muted-foreground"
                    role="status"
                    aria-live="polite"
                  >
                    <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                    Thinking…
                  </div>
                )}

                {chatError && (
                  <div
                    className="self-start rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[11px] leading-relaxed text-destructive"
                    role="alert"
                  >
                    {chatError}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-background border-t border-border/50">
                <form className="relative" onSubmit={handleChatSubmit}>
                  <Input 
                    placeholder="What do you need help with?" 
                    className="rounded-full text-[12px] pr-10 border-border/80 h-10"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isSending}
                    maxLength={1200}
                    aria-label="Message Business Insights"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={isSending || chatInput.trim().length === 0}
                    className="absolute right-3 top-2.5 text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSending ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
