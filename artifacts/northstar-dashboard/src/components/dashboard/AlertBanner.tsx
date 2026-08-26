import { useState } from "react";
import { BarChart3, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";

const HOMEPAGE_INSIGHTS = {
  ben: [
    {
      title: "Payroll of $129,493 CAD is due in 1 day",
      detail: "Your balance may be insufficient to cover it.",
      actionLabel: "Transfer now",
      icon: Sparkles,
      action: "transfer" as const,
    },
    {
      title: "A $42,500 wire payment is awaiting approval",
      detail: "Review the payment before its scheduled release time.",
      actionLabel: "Review approval",
      icon: ShieldCheck,
      action: "approval" as const,
    },
    {
      title: "Your cash position report is ready to review",
      detail: "Use it to check virtual-account liquidity before upcoming payables.",
      actionLabel: "Open report",
      icon: BarChart3,
      action: "report" as const,
    },
  ],
  james: [
    {
      title: "This month you have an $80,000 surplus",
      detail: "Consider opening a high-yield investment account with 3% interest.",
      actionLabel: "Open account",
      icon: Sparkles,
      action: "investment" as const,
    },
    {
      title: "A $42,500 wire payment is awaiting approval",
      detail: "Review the payment before its scheduled release time.",
      actionLabel: "Review approval",
      icon: ShieldCheck,
      action: "approval" as const,
    },
    {
      title: "Your cash position report is ready to review",
      detail: "Use it to check virtual-account liquidity before upcoming payables.",
      actionLabel: "Open report",
      icon: BarChart3,
      action: "report" as const,
    },
  ],
};

type AlertBannerProps = {
  onSequenceComplete: () => void;
  onReviewApproval: () => void;
  onOpenCashReport: () => void;
};

export function AlertBanner({
  onSequenceComplete,
  onReviewApproval,
  onOpenCashReport,
}: AlertBannerProps) {
  const {
    activeUser,
    isPayrollAlertVisible,
    dismissPayrollAlert,
    setTransferModalOpen,
    showDemoDisclosure,
  } = useAppStore();
  const [insightIndex, setInsightIndex] = useState(0);
  const [showUndo, setShowUndo] = useState(false);

  if (!isPayrollAlertVisible) return null;

  const insights = HOMEPAGE_INSIGHTS[activeUser];
  const insight = insights[insightIndex];
  const InsightIcon = insight.icon;

  const handleDismiss = () => {
    if (!showUndo) {
      setShowUndo(true);
      return;
    }

    if (insightIndex === insights.length - 1) {
      dismissPayrollAlert();
      onSequenceComplete();
      return;
    }

    setInsightIndex((current) => current + 1);
    setShowUndo(false);
  };

  const handleAction = () => {
    if (insight.action === "transfer") {
      setTransferModalOpen(true);
      return;
    }

    if (insight.action === "approval") {
      onReviewApproval();
      return;
    }

    if (insight.action === "investment") {
      showDemoDisclosure({
        title: "Opening a new investment account",
        description:
          "In the live Northstar product, this action launches a guided account-opening journey where a specialist helps you compare high-yield investment options and configure your new account. Account creation is not available in this demo environment.",
      });
      return;
    }

    onOpenCashReport();
  };

  return (
    <div
      className="payroll-alert min-h-[60px] rounded-md bg-gradient-to-r from-[#0068b4] via-[#0078bf] to-[#0088ca] px-4 py-3 text-primary-foreground shadow-sm sm:px-6"
      data-undo-visible={showUndo}
      aria-live="polite"
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-5">
        <InsightIcon className="h-5 w-5 shrink-0 opacity-95" />
        <span className="min-w-0 text-[13px] font-medium leading-5 sm:text-[14px]">
          {showUndo ? (
            <>
              <strong>{insight.title} has been hidden.</strong> Undo to restore it, or dismiss again to continue to the next insight.
            </>
          ) : (
            <>
              <strong>{insight.title}</strong> — {insight.detail}
            </>
          )}
        </span>
      </div>
      <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 min-w-0 rounded-full border-white/70 bg-transparent px-4 text-[13px] font-medium text-white hover:bg-white/10 hover:text-white"
          onClick={showUndo ? () => setShowUndo(false) : handleAction}
        >
          {showUndo ? "Undo" : insight.actionLabel}
        </Button>
        <button 
          onClick={handleDismiss}
          aria-label={showUndo ? `Dismiss ${insight.title} and show the next insight` : `Hide ${insight.title}`}
          className="rounded-sm p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
