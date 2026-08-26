import { useState } from "react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  CreditCard,
  FileText,
  MoreVertical,
  RefreshCw,
  ReceiptText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store";

type SummaryTransaction = {
  id: string;
  title: string;
  detail: string;
  amount: string;
  direction: "in" | "out";
  icon: typeof FileText;
};

const TRANSACTIONS: SummaryTransaction[] = [
  { id: "tax-return", title: "2025 CRA Tax Return", detail: "Refund", amount: "+ $32,450.60", direction: "in", icon: ReceiptText },
  { id: "telc-invoice", title: "TELC Invoice Payment", detail: "Settlement", amount: "+ $64,820.75", direction: "in", icon: FileText },
  { id: "cheque-deposits", title: "Cheque Deposits", detail: "Deposits", amount: "+ $98,250.30", direction: "in", icon: CreditCard },
  { id: "acme-invoice", title: "ACME Invoice Payment", detail: "Payments", amount: "- $38,420.50", direction: "out", icon: FileText },
  { id: "abc-contract", title: "ABC Contract Payment", detail: "Payment", amount: "- $52,640.80", direction: "out", icon: ReceiptText },
  { id: "credit-payment", title: "Credit Card Payment", detail: "Expense", amount: "- $27,385.25", direction: "out", icon: CreditCard },
];

function ActivityCard({
  direction,
  total,
  onSelect,
  rows,
}: {
  direction: "in" | "out";
  total: string;
  onSelect: (transaction: SummaryTransaction) => void;
  rows: SummaryTransaction[];
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { showDemoDisclosure } = useAppStore();
  const visibleRows = rows.filter(
    (transaction) => transaction.direction === direction,
  );
  const DirectionIcon = direction === "in" ? BanknoteArrowDown : BanknoteArrowUp;

  const refresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setIsRefreshing(false);
      const ts = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date());
      toast({
        title: `Money ${direction === "in" ? "in" : "out"} refreshed`,
        description: `Activity updated at ${ts}.`,
      });
    }, 800);
  };

  return (
    <section className="overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between border-b border-border/50 p-4">
        <div>
          <div className="flex items-center gap-1.5">
            <DirectionIcon className="h-4 w-4 text-primary" />
            <h2 className="text-[12px] font-semibold text-foreground">
              Money {direction === "in" ? "In" : "Out"}
            </h2>
          </div>
          <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {direction === "in" ? "+" : "-"} {total}
            <span className="ml-1 text-[10px] font-medium text-muted-foreground">CAD</span>
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Recent Transactions</p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <button type="button" aria-label={`Refresh money ${direction}`} onClick={refresh} className="rounded p-1 hover:bg-muted hover:text-foreground">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            aria-label={`More money ${direction} options`}
            onClick={() =>
              showDemoDisclosure({
                title: `Money ${direction === "in" ? "in" : "out"} options`,
                description: `In the live product, this menu lets you filter by date range, category, or counterparty, and export the money-${direction === "in" ? "in" : "out"} activity as a report. Those options are not available in this demo environment.`,
              })
            }
            className="rounded p-1 hover:bg-muted hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-border/40">
        {visibleRows.map((transaction) => {
          const Icon = transaction.icon;
          return (
            <button
              key={transaction.id}
              type="button"
              onClick={() => onSelect(transaction)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-medium text-foreground">{transaction.title}</span>
                  <span className="block text-[10px] text-muted-foreground">{transaction.detail}</span>
                </span>
              </span>
              <span className="shrink-0 text-[11px] font-semibold text-foreground">{transaction.amount}</span>
            </button>
          );
        })}
      </div>
      <div className="border-t border-border/50 p-3">
        <button
          type="button"
          onClick={() => toast({ title: `Money ${direction === "in" ? "in" : "out"} activity`, description: "All matching transactions are currently displayed." })}
          className="rounded-full border border-border px-3 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/5"
        >
          View All Transactions
        </button>
      </div>
    </section>
  );
}

export function JamesActivitySummary() {
  const [selectedTransaction, setSelectedTransaction] = useState<SummaryTransaction | null>(null);
  const { transactions } = useAppStore();
  const sessionTransfers = transactions
    .filter((transaction) => transaction.id.startsWith("tx-session-"))
    .map<SummaryTransaction>((transaction) => ({
      id: transaction.id,
      title: transaction.type,
      detail: "Session transfer",
      amount: `${transaction.debit !== null ? "-" : "+"} $${(
        transaction.debit ??
        transaction.credit ??
        0
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      direction: transaction.debit !== null ? "out" : "in",
      icon: FileText,
    }));
  const rows = [...sessionTransfers, ...TRANSACTIONS];
  const moneyInTotal =
    195521.65 +
    transactions
      .filter((transaction) => transaction.id.startsWith("tx-session-"))
      .reduce((total, transaction) => total + (transaction.credit ?? 0), 0);

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityCard
          direction="in"
          total={moneyInTotal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          rows={rows}
          onSelect={setSelectedTransaction}
        />
        <ActivityCard
          direction="out"
          total="118,446.55"
          rows={rows}
          onSelect={setSelectedTransaction}
        />
      </div>
      <Dialog open={selectedTransaction !== null} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="w-[calc(100vw-1.5rem)] rounded-xl sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{selectedTransaction?.title}</DialogTitle>
            <DialogDescription>{selectedTransaction?.detail}</DialogDescription>
          </DialogHeader>
          <div className="detail-grid border-b border-border/40 pb-3 text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="text-right font-semibold text-foreground">{selectedTransaction?.amount} CAD</span>
          </div>
          <div className="detail-grid text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="text-right font-medium text-emerald-600">Posted</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
