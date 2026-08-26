import { useEffect, useState } from "react";
import { MoreVertical, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store";

const REPORTS = [
  { id: "r1", name: "Transfer Activity Report", sub: "Bank - PDF", action: "View Report" },
  { id: "r2", name: "Cash Position Report: Virtual Account", sub: "Bank - HTML", action: "View Report" },
  { id: "r3", name: "Q3 2026 Transfer Template Report", sub: "Account Transfers - TXT", action: "Download Report" },
  { id: "r4", name: "Jul 2026 Transfer Activity Report", sub: "Account Transfers - PDF", action: "Download Report" },
  { id: "r5", name: "ACH Settlement Advice Report - H170731178144", sub: "Electronic Reports Delivery - PDF", action: "Download Report" },
];

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function createPdfBlob(title: string) {
  const encoder = new TextEncoder();
  const content = [
    "BT",
    "/F1 18 Tf",
    "72 720 Td",
    `(${escapePdfText(title)}) Tj`,
    "/F1 11 Tf",
    "0 -30 Td",
    "(Northstar Business Report) Tj",
    "0 -20 Td",
    "(Generated for demonstration purposes.) Tj",
    "ET",
    "",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  pdf += offsets
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return new Blob([encoder.encode(pdf)], { type: "application/pdf" });
}

function downloadReport(report: typeof REPORTS[number], toast: ReturnType<typeof useToast>["toast"]) {
  let blob: Blob;
  let extension = ".pdf";
  let mimeType = "application/pdf";

  if (report.sub.includes("TXT")) {
    mimeType = "text/plain";
    extension = ".txt";
    blob = new Blob([`Mock report data for ${report.name}`], { type: mimeType });
  } else if (report.sub.includes("HTML")) {
    mimeType = "text/html";
    extension = ".html";
    blob = new Blob([`<h1>${report.name}</h1><p>Mock report data.</p>`], { type: mimeType });
  } else {
    blob = createPdfBlob(report.name);
  }

  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.href = url;
  element.download = `Report_${report.id}${extension}`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  setTimeout(() => URL.revokeObjectURL(url), 100);

  toast({
    title: "Download complete",
    description: `${report.name} sample file has been saved to your downloads.`,
  });
}

export function ReportsList({ cashReportRequest = 0 }: { cashReportRequest?: number }) {
  const [previewReportId, setPreviewReportId] = useState<string | null>(null);
  const { toast } = useToast();
  const { showDemoDisclosure } = useAppStore();

  const handleAction = (reportId: string, action: string) => {
    const report = REPORTS.find(r => r.id === reportId);
    if (!report) return;

    if (action === "Download Report") {
      downloadReport(report, toast);
    } else {
      // "View Report"
      setPreviewReportId(reportId);
    }
  };

  const previewReport = REPORTS.find(r => r.id === previewReportId);

  // Respond to northstar:open-report custom events (including r4 which normally downloads)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (!detail?.id) return;
      const report = REPORTS.find(r => r.id === detail.id);
      if (report) {
        document.getElementById("reports")?.scrollIntoView({ behavior: "smooth", block: "center" });
        setPreviewReportId(report.id);
      }
    };
    window.addEventListener("northstar:open-report", handler);
    return () => window.removeEventListener("northstar:open-report", handler);
  }, []);

  useEffect(() => {
    if (cashReportRequest === 0) return;

    document.getElementById("reports")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setPreviewReportId("r2");
  }, [cashReportRequest]);

  return (
    <div id="reports" className="bg-card border border-border rounded-md shadow-sm mb-16 overflow-hidden">
      <div className="p-6 pb-4 border-b border-border/50 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-foreground">Reports</h2>
        <button
          aria-label="More report options"
          className="text-muted-foreground hover:text-foreground"
          onClick={() =>
            showDemoDisclosure({
              title: "Report management options",
              description:
                "In the live product, this menu provides options to schedule recurring reports, share reports with team members, configure delivery preferences, and manage report templates. These features are not available in this demo environment.",
            })
          }
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex flex-col divide-y divide-border/30">
        {REPORTS.map((report) => (
          <div key={report.id} className="report-row p-4 sm:p-5 hover:bg-muted/20 transition-colors">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground mb-1 break-words">{report.name}</h3>
              <p className="text-[11px] text-muted-foreground">{report.sub}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleAction(report.id, report.action)}
              className="report-action h-8 text-[11px] rounded-full border-border/70 text-foreground font-medium hover:bg-muted/50 shrink-0"
            >
              {report.action}
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!previewReportId} onOpenChange={(open) => !open && setPreviewReportId(null)}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden rounded-xl">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{previewReport?.name}</DialogTitle>
            <DialogDescription>{previewReport?.sub}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 bg-muted/30 p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white border shadow-sm mx-auto max-w-[500px] p-4 sm:p-8 rounded-sm">
              {/* Demo report preview */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-primary uppercase mb-1">NORTHSTAR</div>
                  <div className="text-sm font-semibold text-foreground mb-0.5">{previewReport?.name}</div>
                  <div className="text-[11px] text-muted-foreground">{previewReport?.sub}</div>
                </div>
              </div>
              <div className="mb-6 flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-100 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-medium text-emerald-700">
                  Sample report preview
                </span>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-muted/30 w-full rounded" />
                <div className="h-4 bg-muted/30 w-full rounded" />
                <div className="h-4 bg-muted/30 w-5/6 rounded" />
              </div>
              <div className="mt-12 space-y-4">
                <div className="h-12 bg-muted/20 w-full rounded" />
                <div className="h-12 bg-muted/20 w-full rounded" />
                <div className="h-12 bg-muted/20 w-full rounded" />
              </div>
              <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
                This preview contains representative sample content only. A
                downloaded file is generated for demonstration and is not a
                live banking record.
              </p>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-[11px]"
              onClick={() => setPreviewReportId(null)}
            >
              Close
            </Button>
            {previewReport && (
              <Button
                size="sm"
                className="rounded-full text-[11px]"
                onClick={() => {
                  downloadReport(previewReport, toast);
                  setPreviewReportId(null);
                }}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download sample report
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
