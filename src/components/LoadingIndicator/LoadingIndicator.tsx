/**
 * LoadingIndicator - shared on-brand loading state for async chart/simulation states
 */

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Props {
  label: string;
  className?: string;
}

export const LoadingIndicator = ({ label, className = '' }: Props) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      role="status"
      aria-label={label}
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      <div
        className={`w-10 h-10 rounded-sm border-4 border-dark-border border-t-accent ${
          prefersReducedMotion ? '' : 'animate-spin'
        }`}
      />
      <span className="text-dark-text-secondary text-sm">{label}</span>
    </div>
  );
};
