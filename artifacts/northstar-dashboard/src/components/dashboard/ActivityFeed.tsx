import { useState, useMemo, useEffect } from "react";
import { RefreshCw, MoreVertical, Search, X } from "lucide-react";
import { useAppStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const formatCurrency = (amount: number | null) => {
  if (amount === null) return "-";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

function formatRefreshTimestamp() {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}

export function ActivityFeed() {
  const {
    transactions,
    selectedAccountFilter,
    setSelectedAccountFilter,
    searchQuery,
    setSearchQuery,
    isPersistedDataLoading,
    persistedDataError,
    reloadPersistedData,
    showDemoDisclosure,
  } = useAppStore();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("10 minutes ago");

  const filters = [
    "Northstar Chequing Business #1",
    "Northstar Chequing Business #2",
    "Business Investment Account",
    "Business Investment Account #2",
    "Business Credit Account #2"
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await reloadPersistedData();
    setIsRefreshing(false);
    const ts = formatRefreshTimestamp();
    setLastRefreshed(`Just now (${ts})`);
    toast({
      title: "Activity refreshed",
      description: `Transaction feed updated at ${ts}.`,
    });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      let matchesAccount = true;
      if (selectedAccountFilter.includes("Chequing")) {
        matchesAccount = tx.account.includes("Chequing");
      } else if (selectedAccountFilter.includes("Investment")) {
        matchesAccount = tx.account.includes("Investment") || tx.account.includes("Escrow");
      } else if (selectedAccountFilter.includes("Credit")) {
        matchesAccount = tx.account.includes("Credit");
      }
      
      const matchesSearch = tx.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tx.account.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAccount && matchesSearch;
    });
  }, [transactions, selectedAccountFilter, searchQuery]);

  const selectedTx = transactions.find(t => t.id === selectedTxId);

  return (
    <div className="bg-card border border-border rounded-md shadow-sm mb-8 overflow-hidden">
      <div className="p-4 sm:p-6 sm:pb-4 border-b border-border/50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Recent Transaction Activity</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Refreshed {lastRefreshed}</p>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <button
              onClick={() => void handleRefresh()}
              disabled={isRefreshing || isPersistedDataLoading}
              aria-label="Refresh activity"
              className="hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing || isPersistedDataLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              aria-label="More options"
              className="hover:text-foreground"
              onClick={() =>
                showDemoDisclosure({
                  title: "Activity feed options",
                  description:
                    "In the live product, this menu lets you export transactions, schedule automated reports, and configure custom feed filters. Those options are not available in this demo environment.",
                })
              }
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="activity-toolbar">
          <div className="flex min-w-0 flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedAccountFilter(filter)}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  selectedAccountFilter === filter
                    ? "border-primary text-primary bg-primary/5 font-medium"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="activity-search relative">
            {isSearchOpen ? (
              <div className="flex min-w-0 items-center animate-in fade-in slide-in-from-right-4">
                <Search className="h-3.5 w-3.5 absolute left-3 text-muted-foreground" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search transactions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  className="h-8 w-full min-w-0 rounded-full border border-border pl-8 pr-8 text-[11px] bg-muted/20 outline-none focus:border-primary/50"
                />
                <button 
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                  aria-label="Close search"
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isPersistedDataLoading && (
        <div
          className="px-4 sm:px-6 py-3 border-b border-border/30 text-[11px] text-muted-foreground"
          role="status"
        >
          Loading saved transaction activity…
        </div>
      )}
      {persistedDataError && (
        <div
          className="px-4 sm:px-6 py-3 border-b border-amber-200 bg-amber-50 text-[11px] text-amber-900 flex items-center justify-between gap-4"
          role="alert"
        >
          <span>
            Saved transfers could not be loaded. Seeded demo activity is still
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

      <div className="activity-table-view overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-border/50 text-foreground font-semibold">
              <th className="px-6 py-4 font-semibold">Account Name</th>
              <th className="px-6 py-4 font-semibold">Transaction Type</th>
              <th className="px-6 py-4 font-semibold text-right">Credit</th>
              <th className="px-6 py-4 font-semibold text-right">Debit</th>
              <th className="px-6 py-4 font-semibold text-right">Transaction posted</th>
              <th className="px-6 py-4 font-semibold text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No transactions found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => setSelectedTxId(tx.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedTxId(tx.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${tx.type} transaction on ${tx.account}`}
                  className="hover:bg-muted/30 transition-colors group cursor-pointer focus:outline-none focus:bg-muted/40"
                >
                  <td className="px-6 py-3.5 text-foreground">{tx.account}</td>
                  <td className="px-6 py-3.5 text-muted-foreground">{tx.type}</td>
                  <td className="px-6 py-3.5 text-right font-medium text-foreground">
                    {formatCurrency(tx.credit)}
                  </td>
                  <td className="px-6 py-3.5 text-right font-medium text-foreground">
                    {tx.debit !== null ? `-${formatCurrency(tx.debit)}` : "-"}
                  </td>
                  <td className="px-6 py-3.5 text-right text-muted-foreground">{tx.posted}</td>
                  <td className="px-6 py-3.5 text-right text-muted-foreground">{tx.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="activity-card-view">
        {filteredTransactions.length === 0 ? (
          <div className="px-4 py-8 text-center text-[12px] text-muted-foreground">
            No transactions found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {filteredTransactions.map((tx) => (
              <button
                key={tx.id}
                type="button"
                onClick={() => setSelectedTxId(tx.id)}
                aria-label={`View details for ${tx.type} transaction on ${tx.account}`}
                className="w-full p-4 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-[12px] font-semibold leading-5 text-foreground">{tx.account}</p>
                    <p className="mt-0.5 break-words text-[11px] text-muted-foreground">{tx.type}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    {tx.posted}
                  </span>
                </div>
                <dl className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 text-[11px]">
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">Credit</dt>
                    <dd className="mt-0.5 break-words font-medium text-foreground">{formatCurrency(tx.credit)}</dd>
                  </div>
                  <div className="min-w-0 text-right">
                    <dt className="text-muted-foreground">Debit</dt>
                    <dd className="mt-0.5 break-words font-medium text-foreground">
                      {tx.debit !== null ? `-${formatCurrency(tx.debit)}` : "-"}
                    </dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">Transaction posted</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{tx.posted}</dd>
                  </div>
                  <div className="min-w-0 text-right">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="mt-0.5 font-medium text-foreground">{tx.date}</dd>
                  </div>
                </dl>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/50">
        <button
          className="text-[11px] text-primary font-medium px-2 py-1 rounded hover:bg-primary/5 transition-colors"
          onClick={() => {
            document.getElementById("reports")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          View all Reports
        </button>
      </div>

      <Dialog open={!!selectedTxId} onOpenChange={(open) => !open && setSelectedTxId(null)}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-[420px] p-4 sm:p-6 rounded-xl">
          <DialogHeader className="mb-4">
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>ID: {selectedTx?.id}</DialogDescription>
          </DialogHeader>
          
          {selectedTx && (
            <div className="space-y-4 text-sm">
              <div className="detail-grid border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Account</span>
                <span className="min-w-0 break-words font-medium text-foreground text-right">{selectedTx.account}</span>
              </div>
              <div className="detail-grid border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Type</span>
                <span className="min-w-0 break-words font-medium text-foreground text-right">{selectedTx.type}</span>
              </div>
              <div className="detail-grid border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-foreground text-right">
                  {selectedTx.credit !== null ? formatCurrency(selectedTx.credit) : `-${formatCurrency(selectedTx.debit)}`}
                </span>
              </div>
              <div className="detail-grid border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-emerald-600 text-right">Posted</span>
              </div>
              <div className="detail-grid border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground text-right">{selectedTx.date}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
