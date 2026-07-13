/**
 * Tests for App header controls (issue #14: custom icon set)
 */

import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

const EMOJI_PATTERN = /❓|☀️|🌙|⟲/;

describe('App header controls', () => {
  beforeAll(() => {
    // jsdom does not implement <dialog> interactivity; HelpModal relies on it
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  beforeEach(() => {
    // Skip the first-visit welcome modal so it doesn't interfere with header assertions
    localStorage.setItem('mx-simulator:has-visited', 'true');
  });

  it('renders the help button with a custom icon instead of an emoji', () => {
    render(<App />);

    const helpButtons = screen.getAllByRole('button', { name: 'Abrir ayuda' });
    expect(helpButtons.length).toBeGreaterThan(0);
    helpButtons.forEach((button) => {
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(button.textContent).not.toMatch(EMOJI_PATTERN);
    });
  });

  it('renders the theme toggle with a custom icon instead of an emoji', () => {
    render(<App />);

    const themeButtons = screen.getAllByRole('button', { name: 'Cambiar tema' });
    expect(themeButtons.length).toBeGreaterThan(0);
    themeButtons.forEach((button) => {
      expect(button.querySelector('svg')).toBeInTheDocument();
      expect(button.textContent).not.toMatch(EMOJI_PATTERN);
    });
  });
});
