/**
 * InfoTooltip - Reusable tooltip component for contextual help
 */

import { useState } from 'react';

interface Props {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const InfoTooltip = ({ content, position = 'top', className = '' }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="
          inline-flex items-center justify-center
          w-5 h-5 rounded-full
          bg-accent/20 text-accent
          hover:bg-accent hover:text-white
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
          text-xs font-bold
          cursor-help
        "
        aria-label="Más información"
      >
        ?
      </button>

      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 ${positionClasses[position]}
            px-3 py-2 rounded-lg
            bg-dark-card border border-dark-border
            text-dark-text text-sm
            shadow-lg
            max-w-xs
            pointer-events-none
          `}
        >
          {content}
          {/* Tooltip arrow */}
          <div
            className={`
              absolute w-2 h-2 bg-dark-card border-dark-border
              transform rotate-45
              ${position === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
              ${position === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
              ${position === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-t' : ''}
              ${position === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};
