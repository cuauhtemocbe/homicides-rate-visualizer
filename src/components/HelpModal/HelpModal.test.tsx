/**
 * Tests for HelpModal (issue #23: replace emoji glyphs with icons)
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HelpModal } from './HelpModal';

const EMOJI_PATTERN = /👋|❓|🎯|🎰|🧮|📊|💡|⟲/u;

describe('HelpModal', () => {
  beforeAll(() => {
    // jsdom does not implement <dialog> interactivity; reflect `open` so the
    // modal's content is part of the accessibility tree during tests
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  });

  it('renders the title without emoji glyphs', () => {
    render(<HelpModal isOpen={true} onClose={() => {}} isWelcome={false} />);

    const title = screen.getByRole('heading', { name: /Guía del Simulador/ });
    expect(title.textContent).not.toMatch(EMOJI_PATTERN);
    expect(title.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the welcome title without emoji glyphs', () => {
    render(<HelpModal isOpen={true} onClose={() => {}} isWelcome={true} />);

    const title = screen.getByRole('heading', { name: /Bienvenido al simulador/ });
    expect(title.textContent).not.toMatch(EMOJI_PATTERN);
    expect(title.querySelector('svg')).toBeInTheDocument();
  });

  it('renders each section heading with an icon and no emoji', () => {
    render(<HelpModal isOpen={true} onClose={() => {}} />);

    const headings = [
      /¿Qué hace este simulador\?/,
      /Sistema de Slots/,
      /Algoritmo de Cascada/,
      /Cómo interpretar los gráficos/,
      /Tips de uso/
    ].map((name) => screen.getByRole('heading', { name }));

    headings.forEach((heading) => {
      expect(heading.textContent).not.toMatch(EMOJI_PATTERN);
      expect(heading.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('renders the reset button reference with an icon instead of the "⟲" glyph', () => {
    render(<HelpModal isOpen={true} onClose={() => {}} />);

    const resetReference = screen.getByText('Resetear').closest('strong');
    expect(resetReference).not.toBeNull();
    expect(resetReference!.textContent).not.toMatch(EMOJI_PATTERN);
    expect(resetReference!.querySelector('svg')).toBeInTheDocument();
  });
});
