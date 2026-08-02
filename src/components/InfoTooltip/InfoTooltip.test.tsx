/**
 * Tests for InfoTooltip (issue #25: redesigned trigger and panel)
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InfoTooltip } from './InfoTooltip';

describe('InfoTooltip', () => {
  it('uses the new institutional accent token on the trigger instead of blue', () => {
    render(<InfoTooltip content="Texto de ayuda" />);

    const trigger = screen.getByRole('button', { name: 'Más información' });
    expect(trigger.className).toMatch(/accent/);
    expect(trigger.className).not.toMatch(/blue/);
  });

  it('gives the trigger a distinct visual treatment from a plain filled circle', () => {
    render(<InfoTooltip content="Texto de ayuda" />);

    const trigger = screen.getByRole('button', { name: 'Más información' });
    expect(trigger.className).not.toMatch(/rounded-full/);
  });

  it('applies the palette tokens to the tooltip panel', () => {
    render(<InfoTooltip content="Texto de ayuda" />);

    const trigger = screen.getByRole('button', { name: 'Más información' });
    fireEvent.focus(trigger);

    const panel = screen.getByRole('tooltip');
    expect(panel.className).toMatch(/bg-dark-card/);
    expect(panel.className).toMatch(/border-dark-border/);
    expect(panel.className).toMatch(/text-dark-text/);
  });

  it('shows the tooltip on focus and hides it on blur', () => {
    render(<InfoTooltip content="Texto de ayuda" />);

    const trigger = screen.getByRole('button', { name: 'Más información' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.focus(trigger);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Texto de ayuda');

    fireEvent.blur(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows the tooltip on mouse hover and hides it on mouse leave', () => {
    render(<InfoTooltip content="Texto de ayuda" />);

    const trigger = screen.getByRole('button', { name: 'Más información' });
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('closes the tooltip when tapping outside on touch devices', () => {
    render(
      <div>
        <InfoTooltip content="Texto de ayuda" />
        <button type="button">Fuera</button>
      </div>,
    );

    const trigger = screen.getByRole('button', { name: 'Más información' });
    fireEvent.click(trigger);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Fuera' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
