/**
 * Tests for ShareButton (issue #14: custom icon set)
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShareButton } from './ShareButton';

const EMOJI_PATTERN = /🔗|✓/;

describe('ShareButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a custom icon instead of an emoji in the idle state', () => {
    render(<ShareButton />);

    const button = screen.getByRole('button', { name: 'Compartir configuración actual' });
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button.textContent).not.toMatch(EMOJI_PATTERN);
  });

  it('renders a custom checkmark icon instead of an emoji after a successful copy', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    const user = userEvent.setup();
    render(<ShareButton />);

    const button = screen.getByRole('button', { name: 'Compartir configuración actual' });
    await user.click(button);

    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button.textContent).not.toMatch(EMOJI_PATTERN);
  });
});
