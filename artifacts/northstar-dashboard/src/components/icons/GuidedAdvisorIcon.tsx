import type { SVGProps } from "react";

type GuidedAdvisorIconProps = SVGProps<SVGSVGElement> & {
  strokeWidth?: number;
};

export function GuidedAdvisorIcon({
  strokeWidth = 2.1,
  ...props
}: GuidedAdvisorIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
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