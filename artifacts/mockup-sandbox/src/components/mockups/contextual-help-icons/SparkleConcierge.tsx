import { useState } from "react";
import { Landmark } from "lucide-react";

import "./_group.css";

function ConciergeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.4 10.85a5.6 5.6 0 0 1 11.2 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.65 11.2v2.15c0 .86.7 1.56 1.56 1.56h.66v-5.27h-.66c-.86 0-1.56.7-1.56 1.56Z"
        fill="currentColor"
      />
      <path
        d="M18.35 11.2v2.15c0 .86-.7 1.56-1.56 1.56h-.66v-5.27h.66c.86 0 1.56.7 1.56 1.56Z"
        fill="currentColor"
      />
      <path
        d="M10.6 8.3a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        stroke="currentColor"
        strokeWidth="1.65"
      />
      <path
        d="M6.95 19.25c.42-3 1.86-4.5 4.3-4.5 1.35 0 2.45.45 3.24 1.34"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17.5 13.4 18.1 15l1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z"
        fill="currentColor"
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
                isSupportOpen
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <ConciergeMark className="h-3.5 w-3.5" />
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
          {isSupportOpen ? "Help open" : stateLabel}
        </span>
        <span className="text-[9px] text-muted-foreground">32px toggle · 14px icon</span>
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
          <ConciergeMark className="h-14 w-14" />
        </span>
      </div>
      <p className="mt-3 text-center text-[9px] leading-4 text-muted-foreground">
        Concierge + Northstar cue
        <br />
        proactive human guidance
      </p>
    </aside>
  );
}

export function SparkleConcierge() {
  return (
    <main className="contextual-help-current flex h-screen min-h-[300px] w-full min-w-[760px] flex-col overflow-hidden bg-muted/60 px-5 py-4">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
            Concierge hypothesis
          </p>
          <h1 className="mt-0.5 text-sm font-bold tracking-tight text-foreground">
            Contextual Help — Sparkle Concierge
          </h1>
        </div>
        <p className="text-[9px] text-muted-foreground">
          Human guidance, context-aware assistance
        </p>
      </header>
      <div className="flex flex-1 items-start justify-between gap-3">
        <SupportTools initialOpen={false} stateLabel="Inactive" />
        <SupportTools initialOpen stateLabel="Active" />
        <MagnifiedDetail />
      </div>
    </main>
  );
}