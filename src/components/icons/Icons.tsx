/**
 * Custom icon set replacing native emoji glyphs in interactive controls
 * (emoji rendering varies across OS/browser fonts; these keep one consistent look)
 */

interface IconProps {
  className?: string;
}

const DEFAULT_CLASS = 'w-5 h-5';

export const HelpIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.279 2.575-3.006 2.907-.542.104-.994.54-.994 1.093v.5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17h.01" />
    <circle cx="12" cy="12" r="9" strokeWidth={2} />
  </svg>
);

export const SunIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const MoonIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export const ResetIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export const LinkIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" />
  </svg>
);

export const CheckIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const TargetIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" strokeWidth={2} />
    <circle cx="12" cy="12" r="5" strokeWidth={2} />
    <circle cx="12" cy="12" r="1" strokeWidth={2} />
  </svg>
);

export const SlotsIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={2} />
    <path strokeLinecap="round" strokeWidth={2} d="M9 4v16M15 4v16" />
  </svg>
);

export const CalculatorIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth={2} />
    <path strokeLinecap="round" strokeWidth={2} d="M7 7h10M7 12h.01M11 12h.01M15 12h.01M7 16h.01M11 16h.01M15 16h.01" />
  </svg>
);

export const ChartIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
  </svg>
);

export const TipIcon = ({ className = DEFAULT_CLASS }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.5.36.8.93.8 1.55V16h5.4v-.55c0-.62.3-1.19.8-1.55A6 6 0 0012 3z" />
  </svg>
);
