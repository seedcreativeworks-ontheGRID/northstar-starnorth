import { Shell } from "@/components/layout/Shell";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ReportsList } from "@/components/dashboard/ReportsList";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { JamesActivitySummary } from "@/components/dashboard/JamesActivitySummary";
import { InsightsDrawer, InsightsDrawerTrigger } from "@/components/dashboard/InsightsDrawer";
import { SupportPanel } from "@/components/dashboard/SupportPanel";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { TransferModal } from "@/components/dashboard/TransferModal";
import { ApprovalsList } from "@/components/dashboard/ApprovalsList";
import { DASHBOARD_USERS, useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { Landmark, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const {
    activeUser,
    isPayrollAlertVisible,
    isHomepageInsightsComplete,
    completeHomepageInsights,
    isSignedOut,
    restartDemo,
  } = useAppStore();
  const [isInsightsOpen, setInsightsOpen] = useState(false);
  const [isSupportOpen, setSupportOpen] = useState(false);

  // James's view keeps a single right panel: opening Insights closes
  // Help & Support and vice versa. Ben keeps side-by-side panels.
  const isExclusivePanelView = activeUser === "james";

  const handleInsightsOpenChange = (open: boolean) => {
    setInsightsOpen(open);
    if (open && isExclusivePanelView) setSupportOpen(false);
  };

  const handleSupportOpenChange = (open: boolean) => {
    setSupportOpen(open);
    if (open && isExclusivePanelView) setInsightsOpen(false);
  };

  // If the user switches to James while both panels are open, keep only
  // the most recently relevant panel rule simple: collapse to Insights.
  useEffect(() => {
    if (isExclusivePanelView && isInsightsOpen && isSupportOpen) {
      setSupportOpen(false);
    }
  }, [isExclusivePanelView, isInsightsOpen, isSupportOpen]);
  const [approvalReviewRequest, setApprovalReviewRequest] = useState(0);
  const [cashReportRequest, setCashReportRequest] = useState(0);
  const openPanelCount = Number(isInsightsOpen) + Number(isSupportOpen);
  const shouldShowHeaderInsights =
    isHomepageInsightsComplete && !isInsightsOpen;

  useEffect(() => {
    const openApproval = () =>
      setApprovalReviewRequest((request) => request + 1);
    window.addEventListener("northstar:open-approval", openApproval);
    return () =>
      window.removeEventListener("northstar:open-approval", openApproval);
  }, []);

  const reviewApprovalFromInsight = () => setApprovalReviewRequest((request) => request + 1);
  const openCashReportFromInsight = () => setCashReportRequest((request) => request + 1);

  if (isSignedOut) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-10">
        <section
          aria-labelledby="signed-out-title"
          className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg sm:p-8"
        >
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Landmark className="h-7 w-7" />
          </div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            Northstar Business
          </p>
          <h1
            id="signed-out-title"
            className="text-2xl font-semibold tracking-tight text-foreground"
          >
            You’re signed out
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your tab-scoped demo session has been cleared. No banking
            instruction or external account was changed.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            Demo activity is stored only for the current browser-tab session.
          </div>
          <Button
            onClick={restartDemo}
            className="mt-6 h-10 rounded-full px-6"
          >
            Start a new demo session
          </Button>
        </section>
      </main>
    );
  }

  return (
    <Shell
      isSupportOpen={isSupportOpen}
      onSupportOpenChange={handleSupportOpenChange}
    >
      <div className="dashboard-layout" data-panel-count={openPanelCount}>
        <div className="dashboard-main order-1">
          <div className="dashboard-content mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header Section */}
            <div className="dashboard-welcome-row mb-7">
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                Welcome {DASHBOARD_USERS[activeUser].name}!
              </h1>
              {shouldShowHeaderInsights && (
                <div className="dashboard-heading-trigger">
                  <InsightsDrawerTrigger
                    open={isInsightsOpen}
                    onOpenChange={handleInsightsOpenChange}
                    compact
                  />
                </div>
              )}
            </div>

            {/* Payroll alert and Insights trigger */}
            {!isHomepageInsightsComplete && isPayrollAlertVisible && (
              <div className="mb-6 rounded-xl border border-border/70 bg-card p-2.5 shadow-[0_2px_12px_rgba(15,23,42,0.08)]">
                <div className="dashboard-alert-row" data-alert-visible={isPayrollAlertVisible}>
                  <div className="min-w-0 flex-1">
                    <AlertBanner
                      key={activeUser}
                      onSequenceComplete={completeHomepageInsights}
                      onReviewApproval={reviewApprovalFromInsight}
                      onOpenCashReport={openCashReportFromInsight}
                    />
                  </div>
                  {!isInsightsOpen && (
                    <div className="dashboard-insights-trigger">
                      <InsightsDrawerTrigger
                        open={isInsightsOpen}
                        onOpenChange={handleInsightsOpenChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Top Level Cards */}
            <OverviewCards />

            {/* Conditional Approvals */}
            <ApprovalsList reviewRequest={approvalReviewRequest} />

            {activeUser === "james" ? (
              <JamesActivitySummary />
            ) : (
              <>
                {/* Transaction Table */}
                <ActivityFeed />
              </>
            )}
            {/* Reports are available to both profile views. */}
            <ReportsList cashReportRequest={cashReportRequest} />

            {/* Cash-flow widget and persistent product footer */}
            <CashFlowChart />
            <DashboardFooter />
          </div>
        </div>
        {openPanelCount > 0 && (
          <div
            className="dashboard-panel-rail order-2"
            data-panel-count={openPanelCount}
            aria-label="Dashboard side panels"
          >
            <InsightsDrawer
              open={isInsightsOpen}
              onOpenChange={handleInsightsOpenChange}
            />
            <SupportPanel
              open={isSupportOpen}
              onOpenChange={handleSupportOpenChange}
            />
          </div>
        )}
      </div>
      
      {/* Shared Global Transfer Modal */}
      <TransferModal />
    </Shell>
  );
}
