/**
 * Clamps a tooltip's width so it never exceeds the viewport minus margins.
 */
export function getClampedTooltipWidth(
  naturalWidth: number,
  viewportWidth: number,
  margin: number,
): number {
  return Math.min(naturalWidth, viewportWidth - margin * 2);
}

/**
 * Computes the horizontal offset (in px) to add to a tooltip that is
 * centered on its trigger, so its bounding box stays within the viewport.
 */
export function getTooltipHorizontalDelta(
  triggerCenterX: number,
  tooltipWidth: number,
  viewportWidth: number,
  margin: number,
): number {
  const naturalLeft = triggerCenterX - tooltipWidth / 2;
  const maxLeft = Math.max(margin, viewportWidth - tooltipWidth - margin);
  const clampedLeft = Math.min(Math.max(naturalLeft, margin), maxLeft);
  return clampedLeft - naturalLeft;
}
