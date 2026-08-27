import { useState } from "react";
import { Landmark } from "lucide-react";

import "./_group.css";

function AISupportCallerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.85 10.1a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3.75 18.55c.45-3.04 2.43-4.8 5.1-4.8 1.36 0 2.52.45 3.36 1.27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14.62 12.32c.56-.55 1.37-.55 1.93 0l.67.67c.32.32.38.8.14 1.19l-.5.82c.42.8 1.08 1.46 1.88 1.88l.82-.5c.39-.24.87-.18 1.19.14l.67.67c.55.56.55 1.37 0 1.93l-.6.6c-.47.47-1.17.64-1.8.44-3.04-.94-5.45-3.35-6.4-6.4-.2-.63-.02-1.33.45-1.8l.55-.64Z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 5.05v2.1M17.7 6.1h2.1M20.6 8.25v1.35M19.93 8.93h1.34"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
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
              <AISupportCallerIcon className="h-3.5 w-3.5" />
            </span>
          </button>

          <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-primary/20" />

          <button
            type="button"
            aria-label="Open Support Centre"
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
          <AISupportCallerIcon className="h-14 w-14" />
        </span>
      </div>
      <p className="mt-3 text-center text-[9px] leading-4 text-muted-foreground">
        Human support + call path
        <br />
        restrained AI assistance
      </p>
    </aside>
  );
}

export function AISupportCaller() {
  return (
    <main className="contextual-help-current flex h-[300px] min-h-[300px] w-[760px] min-w-[760px] flex-col overflow-hidden bg-muted/60 px-5 py-4">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-primary">
            Design hypothesis · human-led
          </p>
          <h1 className="mt-0.5 text-sm font-bold tracking-tight text-foreground">
            Contextual Help — AI Support Caller
          </h1>
        </div>
        <p className="text-[9px] text-muted-foreground">Human help, context-aware assistance</p>
      </header>

      <div className="flex flex-1 items-start justify-between gap-3">
        <SupportTools initialOpen={false} stateLabel="Inactive" />
        <SupportTools initialOpen stateLabel="Active" />
        <MagnifiedDetail />
      </div>
    </main>
  );
}