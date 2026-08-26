import { Landmark, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store";

export function DashboardFooter() {
  const { showDemoDisclosure } = useAppStore();

  return (
    <footer className="flex flex-col gap-4 border-t border-border/70 py-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="flex h-6 items-center gap-1 rounded-full bg-primary px-2 text-[9px] font-bold tracking-wide text-primary-foreground">
          <Landmark className="h-3 w-3" />
          NORTHSTAR
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Deposits protected by the Northstar Deposit Protection Corporation
        </span>
      </div>
      <nav aria-label="Footer links" className="flex items-center gap-3 font-medium text-primary">
        <button
          type="button"
          className="hover:underline"
          onClick={() =>
            showDemoDisclosure({
              title: "Privacy policy",
              description:
                "The full Northstar Privacy Policy, including data handling, retention, and your rights under applicable privacy legislation, is available at northstarbank.example/privacy. This demo environment does not load external pages.",
            })
          }
        >
          Privacy
        </button>
        <span className="text-border">|</span>
        <button
          type="button"
          className="hover:underline"
          onClick={() =>
            showDemoDisclosure({
              title: "Legal notices",
              description:
                "Northstar legal notices, terms of service, and regulatory disclosures are available at northstarbank.example/legal. This demo environment does not load external pages.",
            })
          }
        >
          Legal
        </button>
        <span className="text-border">|</span>
        <button
          type="button"
          className="hover:underline"
          onClick={() =>
            showDemoDisclosure({
              title: "Security centre",
              description:
                "The Northstar Security Centre provides guidance on protecting your account, reporting fraud, and managing security settings. It is accessible at northstarbank.example/security. This demo environment does not load external pages.",
            })
          }
        >
          Security
        </button>
      </nav>
    </footer>
  );
}
