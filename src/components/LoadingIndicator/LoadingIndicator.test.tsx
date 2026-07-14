/**
 * Tests for LoadingIndicator (issue #18: on-brand loading states)
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingIndicator } from './LoadingIndicator';

const mockMatchMedia = (matches: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
};

describe('LoadingIndicator', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders with role="status" and an accessible label', () => {
    mockMatchMedia(false);
    render(<LoadingIndicator label="Cargando gráfica..." />);

    const status = screen.getByRole('status', { name: 'Cargando gráfica...' });
    expect(status).toBeInTheDocument();
    expect(status.textContent).toContain('Cargando gráfica...');
  });

  it('applies a spin animation class when motion is not reduced', () => {
    mockMatchMedia(false);
    const { container } = render(<LoadingIndicator label="Cargando..." />);

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('does not apply a spin/pulse animation class when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    const { container } = render(<LoadingIndicator label="Cargando..." />);

    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
  });
});
