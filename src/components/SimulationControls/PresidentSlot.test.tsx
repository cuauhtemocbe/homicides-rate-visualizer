/**
 * Tests for PresidentSlot
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PresidentSlot } from './PresidentSlot';

describe('PresidentSlot', () => {
  it('slot 0 (Fox) is disabled and explains why via aria-describedby', () => {
    render(<PresidentSlot slotNumber={0} currentPresident="fox" disabled />);

    const select = screen.getByTestId('slot-0');
    expect(select).toBeDisabled();

    const describedById = select.getAttribute('aria-describedby');
    expect(describedById).toBe('slot-0-disabled');
    expect(document.getElementById(describedById!)).toHaveTextContent(
      'Fijo - Punto de partida histórico',
    );
  });
});
