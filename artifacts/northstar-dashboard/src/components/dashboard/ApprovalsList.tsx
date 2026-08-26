import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";

export function ApprovalsList({ reviewRequest = 0 }: { reviewRequest?: number }) {
  const {
    approvals,
    updateApprovalStatus,
    isPersistedDataLoading,
    persistedDataError,
    reloadPersistedData,
    showDemoDisclosure,
  } = useAppStore();
  const { toast } = useToast();
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [pendingApprovalId, setPendingApprovalId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    setPendingApprovalId(id);
    setActionError(null);

    try {
      const result = await updateApprovalStatus(id, action);
      toast({
        title: action === "approved" ? "Approval granted" : "Approval rejected",
        description: `"${result.title}" has been ${action}.`,
      });
    } catch {
      setActionError(
        "We couldn't save that decision. The approval is unchanged so you can try again.",
      );
    } finally {
      setPendingApprovalId(null);
    }
  };

  const selectedApproval = approvals.find(a => a.id === selectedApprovalId);

  useEffect(() => {
    if (reviewRequest === 0) return;

    document.getElementById("approvals")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setSelectedApprovalId("app-2");
  }, [reviewRequest]);

  return (
    <div id="approvals" className="bg-card border border-border rounded-md shadow-sm mb-8 overflow-hidden">
      <div className="p-6 pb-4 border-b border-border/50 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-foreground">Approvals</h2>
        <button
          aria-label="More approval options"
          className="text-muted-foreground hover:text-foreground"
          onClick={() =>
            showDemoDisclosure({
              title: "Approval management",
              description:
                "In the live product, this menu lets you export pending approvals, configure approval thresholds, and set up delegate reviewers. Those workflows are not available in this demo environment.",
            })
          }
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      {isPersistedDataLoading && (
        <div
          className="px-4 sm:px-5 py-3 border-b border-border/30 text-[11px] text-muted-foreground"
          role="status"
        >
          Loading saved approval decisions…
        </div>
      )}
      {persistedDataError && (
        <div
          className="px-4 sm:px-5 py-3 border-b border-amber-200 bg-amber-50 text-[11px] text-amber-900 flex items-center justify-between gap-4"
          role="alert"
        >
          <span>
            Saved decisions could not be loaded. Demo approvals are still
            available.
          </span>
          <button
            onClick={() => void reloadPersistedData()}
            className="font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}
      {actionError && (
        <div
          className="px-4 sm:px-5 py-3 border-b border-red-200 bg-red-50 text-[11px] text-red-800"
          role="alert"
        >
          {actionError}
        </div>
      )}
      <div className="divide-y divide-border/30">
        {approvals.map((approval) => (
          <div key={approval.id} className="approval-row p-4 sm:p-5 hover:bg-muted/10 transition-colors">
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold text-foreground mb-0.5">{approval.title}</h3>
              <p className="text-[11px] text-muted-foreground break-words">{approval.detail}</p>
            </div>
            <div className="approval-actions">
              {approval.status === "pending" ? (
                <>
                  <button
                    onClick={() => void handleAction(approval.id, "approved")}
                    disabled={isPersistedDataLoading || pendingApprovalId !== null}
                    className="px-4 py-1.5 rounded-full border border-border/70 text-[11px] font-medium text-foreground hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                  >
                    {pendingApprovalId === approval.id ? "Saving…" : "Approve"}
                  </button>
                  <button
                    onClick={() => void handleAction(approval.id, "rejected")}
                    disabled={isPersistedDataLoading || pendingApprovalId !== null}
                    className="px-4 py-1.5 rounded-full border border-border/70 text-[11px] font-medium text-foreground hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                  >
                    {pendingApprovalId === approval.id ? "Saving…" : "Reject"}
                  </button>
                </>
              ) : (
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  approval.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {approval.status}
                </span>
              )}
              <button onClick={() => setSelectedApprovalId(approval.id)} className="px-4 py-1.5 text-[11px] font-medium text-primary hover:underline">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedApprovalId} onOpenChange={(open) => !open && setSelectedApprovalId(null)}>
        <DialogContent className="sm:max-w-[420px] p-6 rounded-xl">
          <DialogHeader className="mb-4">
            <DialogTitle>{selectedApproval?.title}</DialogTitle>
            <DialogDescription>Approval ID: {selectedApproval?.id}</DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4 text-sm">
              <div className="detail-grid border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Detail</span>
                <span className="font-medium text-foreground text-right">{selectedApproval.detail}</span>
              </div>
              <div className="detail-grid border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-foreground text-right capitalize">{selectedApproval.status}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
