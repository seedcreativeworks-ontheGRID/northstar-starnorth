import { useState } from "react";
import { MoreHorizontal, ChevronDown, ChevronUp, DollarSign, BarChart2, CreditCard, Building, ArrowRightLeft, FileText, Download, X } from "lucide-react";
import { useAppStore, type DashboardUser } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type CardData = {
  id: string;
  title: string;
  subtitle: string;
  trend: string;
  trendType: 'positive' | 'negative';
  mainValue: string;
  mainCurrency: string;
  subValue?: string;
  subCurrency?: string;
  icon: React.ElementType;
  linkText: string;
};

const BEN_CARDS_DATA: CardData[] = [
  {
    id: "deposit",
    title: "Deposit Account",
    subtitle: "Northstar Chequing Business **5274",
    trend: "+3.93% This Quarter",
    trendType: "positive",
    mainValue: "1,847,263.54",
    mainCurrency: "CAD",
    subValue: "423,891.07",
    subCurrency: "USD",
    icon: DollarSign,
    linkText: "View All Chequing Accounts"
  },
  {
    id: "investments",
    title: "Investments Overview",
    subtitle: "Investment Totals in Canada and USA",
    trend: "+5.25% This Quarter",
    trendType: "positive",
    mainValue: "190,939.90",
    mainCurrency: "CAD",
    subValue: "169,939.90",
    subCurrency: "USD",
    icon: BarChart2,
    linkText: "View All Investments"
  },
  {
    id: "credit",
    title: "Business Credit Card Accounts",
    subtitle: "Credit Card Totals",
    trend: "-3.24% This Quarter",
    trendType: "negative",
    mainValue: "190,939.90",
    mainCurrency: "CAD",
    icon: CreditCard,
    linkText: "View Credit Card Accounts"
  },
  {
    id: "loans",
    title: "Loan Facilities Total",
    subtitle: "Total of all loan facilities in Canada and USA",
    trend: "+1.39% This Quarter",
    trendType: "positive",
    mainValue: "209,939.90",
    mainCurrency: "CAD",
    subValue: "170,939.90",
    subCurrency: "USD",
    icon: Building,
    linkText: "View All Loans"
  }
];

const JAMES_CARDS_DATA: CardData[] = [
  {
    id: "deposit",
    title: "Deposit Accounts Overview",
    subtitle: "Total deposit accounts in USA & Canada",
    trend: "+5.25% This Quarter",
    trendType: "positive",
    mainValue: "203,403.90",
    mainCurrency: "CAD",
    subValue: "180,949.90",
    subCurrency: "USD",
    icon: DollarSign,
    linkText: "View All Accounts",
  },
  {
    id: "investments",
    title: "Investments Overview",
    subtitle: "Investment Totals in Canada and USA",
    trend: "+1.39% This Quarter",
    trendType: "positive",
    mainValue: "190,939.90",
    mainCurrency: "CAD",
    subValue: "169,939.90",
    subCurrency: "USD",
    icon: BarChart2,
    linkText: "View All Investments",
  },
  {
    id: "credit",
    title: "Business Credit Card Accounts",
    subtitle: "Credit Card Totals",
    trend: "+3.93% This Quarter",
    trendType: "positive",
    mainValue: "190,939.90",
    mainCurrency: "CAD",
    icon: CreditCard,
    linkText: "View Credit Accounts",
  },
  {
    id: "loans",
    title: "Loan Facilities Total",
    subtitle: "Total of all loan facilities",
    trend: "+4.24% This Quarter",
    trendType: "positive",
    mainValue: "209,939.90",
    mainCurrency: "CAD",
    subValue: "170,939.90",
    subCurrency: "USD",
    icon: Building,
    linkText: "View All Loans",
  },
];

const CARDS_BY_USER: Record<DashboardUser, CardData[]> = {
  ben: BEN_CARDS_DATA,
  james: JAMES_CARDS_DATA,
};

function OverviewCardItem({ data }: { data: CardData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const { setTransferModalOpen, showDemoDisclosure } = useAppStore();
  const { toast } = useToast();

  const showStatement = () => {
    setIsMenuOpen(false);
    setIsStatementOpen(true);
  };

  const downloadHistory = () => {
    setIsMenuOpen(false);
    const blob = new Blob(
      [`Northstar transaction history for ${data.title}\nGenerated for demonstration purposes.`],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = `${data.id}-history.txt`;
    element.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Download complete",
      description: `Transaction history for ${data.title} has been saved.`,
    });
  };

  const handleLinkClick = () => {
    showDemoDisclosure({
      title: `${data.title} — account detail`,
      description: `Full account detail pages, including transaction history, statements, and account management tools for ${data.title.toLowerCase()}, are available in the live Northstar product. This demo environment displays summary data only.`,
    });
  };
  
  return (
    <div className="overview-card min-w-0 bg-card border border-border rounded-md p-4 flex flex-col shadow-sm">
      <div className="mb-4 flex min-w-0 flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <data.icon className="h-3.5 w-3.5" />
          </div>
          <span className={`max-w-full text-xs font-medium px-1.5 py-0.5 rounded ${data.trendType === 'positive' ? 'text-emerald-600 bg-emerald-50' : 'text-destructive bg-destructive/10'}`}>
            {data.trend}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground relative">
          <div className="relative">
            <button 
              aria-label={`More options for ${data.title}`} 
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-foreground p-1 rounded-sm transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-md py-1.5 z-20 text-xs">
                <button onClick={() => { setIsMenuOpen(false); setTransferModalOpen(true); }} className="w-full text-left px-3 py-2 text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  <ArrowRightLeft className="h-3.5 w-3.5"/> Transfer Funds
                </button>
                <button onClick={showStatement} className="w-full text-left px-3 py-2 text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5"/> View Statements
                </button>
                <button onClick={downloadHistory} className="w-full text-left px-3 py-2 text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  <Download className="h-3.5 w-3.5"/> Download History
                </button>
              </div>
            )}
          </div>
          <button 
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${data.title}`} 
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:text-foreground p-1 rounded-sm transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-foreground mb-0.5 break-words">{data.title}</h3>
        <p className="text-[11px] text-muted-foreground break-words">{data.subtitle}</p>
      </div>
      <div className="flex-1">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5 mb-1">
          <span className="overview-card-main-value font-semibold text-foreground tracking-tight">{data.mainValue}</span>
          <span className="text-xs text-muted-foreground font-medium">{data.mainCurrency}</span>
        </div>
        {data.subValue && (
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5">
            <span className="overview-card-sub-value font-medium text-foreground tracking-tight">{data.subValue}</span>
            <span className="text-[10px] text-muted-foreground font-medium">{data.subCurrency}</span>
          </div>
        )}
      </div>
      
      {isExpanded && (
         <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground space-y-2.5 animate-in fade-in slide-in-from-top-1">
           <div className="flex flex-wrap justify-between gap-2"><span className="text-foreground">Account Status</span> <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">Active</span></div>
           <div className="flex flex-wrap justify-between gap-2"><span className="text-foreground">Last Activity</span> <span>Today, 9:41 AM</span></div>
         </div>
      )}
      
      {!isExpanded && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <button
            type="button"
            onClick={handleLinkClick}
            className="text-xs text-primary font-medium hover:underline"
          >
            {data.linkText}
          </button>
        </div>
      )}

      {/* Statement preview dialog */}
      <Dialog open={isStatementOpen} onOpenChange={setIsStatementOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
          <DialogHeader className="p-4 border-b flex-row items-start justify-between">
            <div>
              <DialogTitle>{data.title} — Statement</DialogTitle>
              <DialogDescription className="mt-0.5">{data.subtitle} · Most recent statement</DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex-1 bg-muted/30 p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white border shadow-sm mx-auto max-w-[500px] p-6 sm:p-8 rounded-sm">
              {/* Statement header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-primary uppercase mb-1">NORTHSTAR</div>
                  <div className="text-[11px] text-muted-foreground">Statement Period: Jun 1 – Jun 30, 2026</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground">Closing Balance</div>
                  <div className="text-base font-semibold text-foreground">{data.mainValue} <span className="text-[10px] font-normal text-muted-foreground">{data.mainCurrency}</span></div>
                </div>
              </div>
              {/* Demo statement status */}
              <div className="mb-6 flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-medium text-emerald-700">
                  Demo statement preview
                </span>
              </div>
              {/* Skeleton rows */}
              <div className="space-y-3">
                {[100, 80, 90, 70, 85].map((w, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border/20">
                    <div className={`h-3 bg-muted/50 rounded`} style={{ width: `${w}px` }} />
                    <div className="h-3 bg-muted/40 rounded w-16" />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
                This static preview uses sample data. The download contains a
                plain-text demo statement, not a live bank document.
              </p>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-[11px]"
              onClick={() => setIsStatementOpen(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              className="rounded-full text-[11px]"
              onClick={() => {
                const blob = new Blob(
                  [`Northstar statement for ${data.title}\nPeriod: Jun 1 – Jun 30, 2026\nGenerated for demonstration purposes.`],
                  { type: "text/plain" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${data.id}-statement-jun-2026.txt`;
                a.click();
                URL.revokeObjectURL(url);
                toast({
                  title: "Demo statement downloaded",
                  description: `${data.title} Jun 2026 sample statement saved as a text file.`,
                });
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download demo statement (TXT)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function OverviewCards() {
  const { activeUser } = useAppStore();

  return (
    <section id="accounts" aria-label="Account overview" className="overview-card-grid mb-8">
      {CARDS_BY_USER[activeUser].map(data => <OverviewCardItem key={`${activeUser}-${data.id}`} data={data} />)}
    </section>
  );
}
