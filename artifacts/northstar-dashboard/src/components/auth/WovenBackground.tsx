import React from "react";

export function WovenBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute top-0 left-0 h-full w-[200vw] animate-river-flow text-sky-200"
        viewBox="0 0 2400 1000"
        preserveAspectRatio="none"
      >
        <g fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M 0 400 C 300 550, 900 250, 1200 400 C 1500 550, 2100 250, 2400 400" className="opacity-[0.04]" />
          <path d="M 0 450 C 300 300, 900 600, 1200 450 C 1500 300, 2100 600, 2400 450" className="opacity-[0.05]" />
          <path d="M 0 500 C 300 650, 900 350, 1200 500 C 1500 650, 2100 350, 2400 500" className="opacity-[0.03]" />
          <path d="M 0 350 C 300 200, 900 500, 1200 350 C 1500 200, 2100 500, 2400 350" className="opacity-[0.06]" />
          <path d="M 0 550 C 400 700, 800 400, 1200 550 C 1600 700, 2000 400, 2400 550" className="opacity-[0.04]" />
          <path d="M 0 300 C 400 150, 800 450, 1200 300 C 1600 150, 2000 450, 2400 300" className="opacity-[0.05]" />
          <path d="M 0 420 C 400 620, 800 220, 1200 420 C 1600 620, 2000 220, 2400 420" className="opacity-[0.07]" />
          <path d="M 0 480 C 400 280, 800 680, 1200 480 C 1600 280, 2000 680, 2400 480" className="opacity-[0.06]" />
          <path d="M 0 380 C 200 450, 1000 350, 1200 380 C 1400 450, 2200 350, 2400 380" className="opacity-[0.08]" />
          <path d="M 0 520 C 200 450, 1000 550, 1200 520 C 1400 450, 2200 550, 2400 520" className="opacity-[0.07]" />
          <path d="M 0 440 C 600 600, 600 250, 1200 440 C 1800 600, 1800 250, 2400 440" className="opacity-[0.05]" />
        </g>
      </svg>
    </div>
  );
}