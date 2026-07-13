/**
 * InfoTooltip - Reusable tooltip component for contextual help
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getClampedTooltipWidth, getTooltipHorizontalDelta } from '../../utils/tooltipPosition';

interface Props {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const VIEWPORT_MARGIN = 8;

export const InfoTooltip = ({ content, position = 'top', className = '' }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  // On touch devices there's no hover, so a tap outside is what closes the tooltip
  useEffect(() => {
    if (!isVisible) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isVisible]);

  // Clamp the panel to the viewport so it doesn't overflow near screen edges
  useLayoutEffect(() => {
    if (!isVisible || (position !== 'top' && position !== 'bottom')) {
      setPanelStyle({});
      return;
    }

    const computePosition = () => {
      const container = containerRef.current;
      const panel = panelRef.current;
      if (!container || !panel) return;

      const viewportWidth = window.innerWidth;
      const containerRect = container.getBoundingClientRect();
      const triggerCenterX = containerRect.left + containerRect.width / 2;
      const naturalWidth = panel.getBoundingClientRect().width;
      const width = getClampedTooltipWidth(naturalWidth, viewportWidth, VIEWPORT_MARGIN);
      const delta = getTooltipHorizontalDelta(triggerCenterX, width, viewportWidth, VIEWPORT_MARGIN);
      const isClamped = width < naturalWidth;

      setPanelStyle({
        minWidth: isClamped ? undefined : '20rem',
        width: isClamped ? `${width}px` : undefined,
        transform: `translateX(calc(-50% + ${delta}px))`
      });
    };

    computePosition();
    window.addEventListener('resize', computePosition);
    return () => window.removeEventListener('resize', computePosition);
  }, [isVisible, position]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setIsVisible(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onClick={() => setIsVisible(true)}
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
          ref={panelRef}
          role="tooltip"
          className={`
            absolute z-50 ${positionClasses[position]}
            px-4 py-3 rounded-lg
            bg-dark-card border border-dark-border
            text-dark-text text-sm leading-relaxed
            shadow-lg
          `}
          style={{ maxWidth: '32rem', minWidth: '20rem', ...panelStyle }}
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
