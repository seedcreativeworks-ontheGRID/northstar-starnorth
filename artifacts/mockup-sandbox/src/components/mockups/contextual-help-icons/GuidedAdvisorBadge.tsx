import { useState } from "react";
import { Landmark } from "lucide-react";

import "./_group.css";

function GuidedAdvisorIcon({
  className,
  strokeWidth = 2.1,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.1 15.65a7.55 7.55 0 0 1 .2-7.5A7.42 7.42 0 0 1 11.8 4.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M18.32 13.98a7.3 7.3 0 0 1-1.6 3.01 7.5 7.5 0 0 1-8.25 1.91"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle
        cx="12.03"
        cy="10.15"
        r="2.17"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M7.94 17.95c.43-2.38 2.05-3.72 4.09-3.72 2.03 0 3.64 1.34 4.07 3.72"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="m18.1 4.02.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55.55-1.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth=".35"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SupportTools({
  initialOpen,
  stateLabel,
}: {
  initialOpen: boolean;
  stateLabel: string;
}) {
  const [isSupportOpen, setIsSupportOpen] = useState(initialOpen);
  const [isSupportCentreOpen, setIsSupportCentreOpen] = useState(false);

  return (
    <section className="w-[264px] overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <div className="flex h-8 items-center justify-between border-b border-border/50 bg-background px-3 text-[9px] text-muted-foreground">
        <span>Business Banking</span>
        <span>James Whitmore</span>
      </div>
      <div className="flex h-16 items-center justify-between px-3">
        <div className="flex items-center gap-1.5 text-primary">
          <Landmark className="h-5 w-5" />
          <span className="text-[12px] font-bold tracking-tight">Northstar</span>
        </div>
        <div
          role="group"
          aria-label="Support tools"
          className="relative flex h-10 shrink-0 items-center rounded-md border border-primary/20 bg-primary/[0.035] p-1 shadow-sm"
        >
          <button
            type="button"
            aria-label={isSupportOpen ? "Close Help and Support" : "Open Help and Support"}
            aria-expanded={isSupportOpen}
            onClick={() => {
              setIsSupportCentreOpen(false);
              setIsSupportOpen((open) => !open);
            }}
            className={`grid h-8 w-8 place-items-center rounded-[5px] text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isSupportOpen ? "bg-background shadow-sm" : "hover:bg-primary/[0.075]"
            }`}
          >
            <span
              className={`grid h-6 w-6 place-items-center rounded-[5px] transition-colors ${
                isSupportOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
              }`}
            >
              <GuidedAdvisorIcon className="h-4 w-4" />
            </span>
          </button>
          <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-primary/20" />
          <button
            type="button"
            aria-expanded={isSupportCentreOpen}
            aria-haspopup="true"
            onClick={() => {
              setIsSupportOpen(false);
              setIsSupportCentreOpen((open) => !open);
            }}
            className={`flex h-8 items-center rounded-[5px] px-2 text-[11px] font-semibold text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              isSupportCentreOpen ? "bg-background shadow-sm" : "hover:bg-primary/[0.075]"
            }`}
          >
            <span className="whitespace-nowrap">Support Centre</span>
            <span aria-hidden="true" className="ml-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 bg-muted/40 px-3 py-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {stateLabel}
        </span>
        <span className="text-[9px] text-muted-foreground">32px toggle · 16px icon</span>
      </div>
    </section>
  );
}

function MagnifiedDetail() {
  return (
    <aside className="flex w-[164px] flex-col items-center">
      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Icon detail · 4×
      </p>
      <div className="relative grid h-32 w-32 place-items-center rounded-[20px] border border-primary/20 bg-primary/[0.035] shadow-sm">
        <div className="absolute -left-3 top-1/2 h-px w-3 bg-primary/30" />
        <div className="absolute -right-3 top-1/2 h-px w-3 bg-primary/30" />
        <div className="absolute -top-3 left-1/2 h-3 w-px bg-primary/30" />
        <div className="absolute -bottom-3 left-1/2 h-3 w-px bg-primary/30" />
        <span className="grid h-24 w-24 place-items-center rounded-[20px] bg-primary text-primary-foreground">
          <GuidedAdvisorIcon className="h-16 w-16" strokeWidth={1.5} />
        </span>
      </div>
      <p className="mt-3 text-center text-[9px] leading-4 text-muted-foreground">
        Advisor + guidance halo
        <br />
        sparkle signals contextual assist
      </p>
    </aside>
  );
}

export function GuidedAdvisorBadge() {
  return (
    <main className="contextual-help-current flex h-[300px] min-h-[300px] w-[760px] min-w-[760px] flex-col overflow-hidden bg-muted/60 px-5 py-4">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
            Guided advisor badge
          </p>
          <h1 className="mt-0.5 text-sm font-bold tracking-tight text-foreground">
            Contextual Help — trusted expertise
          </h1>
        </div>
        <p className="text-[9px] text-muted-foreground">Advisor bust · guidance halo · assist marker</p>
      </header>
      <div className="flex flex-1 items-start justify-between gap-3">
        <SupportTools initialOpen={false} stateLabel="Inactive" />
        <SupportTools initialOpen stateLabel="Active" />
        <MagnifiedDetail />
      </div>
    </main>
  );
}