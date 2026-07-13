import { describe, it, expect } from 'vitest';
import { getClampedTooltipWidth, getTooltipHorizontalDelta } from './tooltipPosition';

const MARGIN = 8;

describe('getClampedTooltipWidth', () => {
  it('keeps the natural width when it already fits the viewport', () => {
    expect(getClampedTooltipWidth(320, 390, MARGIN)).toBe(320);
  });

  it('shrinks the width to fit narrow viewports', () => {
    expect(getClampedTooltipWidth(320, 320, MARGIN)).toBe(320 - MARGIN * 2);
  });
});

describe('getTooltipHorizontalDelta', () => {
  it.each([
    { width: 320, edge: 'right' as const, triggerCenterX: 310 },
    { width: 390, edge: 'right' as const, triggerCenterX: 380 },
    { width: 320, edge: 'left' as const, triggerCenterX: 10 },
  ])(
    'keeps the tooltip bounding box within a ${width}px viewport near the $edge edge',
    ({ width, triggerCenterX }) => {
      const tooltipWidth = getClampedTooltipWidth(320, width, MARGIN);
      const delta = getTooltipHorizontalDelta(triggerCenterX, tooltipWidth, width, MARGIN);

      const naturalLeft = triggerCenterX - tooltipWidth / 2;
      const finalLeft = naturalLeft + delta;
      const finalRight = finalLeft + tooltipWidth;

      expect(finalLeft).toBeGreaterThanOrEqual(MARGIN - 0.001);
      expect(finalRight).toBeLessThanOrEqual(width - MARGIN + 0.001);
    }
  );

  it('does not shift a tooltip that is already centered and fits', () => {
    const delta = getTooltipHorizontalDelta(200, 100, 400, MARGIN);
    expect(delta).toBe(0);
  });
});
