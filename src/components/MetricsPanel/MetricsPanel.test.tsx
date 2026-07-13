/**
 * Tests for MetricsPanel
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { MetricsPanel } from './MetricsPanel';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { ResultadoSimulacion } from '../../data/types';

const HIGHLIGHT_CLASS = 'animate-metrics-highlight';

const mockMatchMedia = (matches: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
};

const baseResultado: ResultadoSimulacion = {
  slots: { slot0: 'fox', slot1: 'calderon', slot2: 'pena', slot3: 'amlo', slot4: 'sheinbaum' },
  valores: [10452, 25963, 36685, 29752, 23616],
  valorFinal: 23616,
  diferencia: 3080,
  diferenciaPorcentual: 15.04
};

describe('MetricsPanel', () => {
  afterEach(() => {
    useSimulationStore.setState({ resultadoSimulacion: null });
    vi.unstubAllGlobals();
  });

  it('shows the exact computed percentage difference when the what-if scenario is worse', () => {
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    expect(screen.getByText('+15.0%')).toBeInTheDocument();
    expect(screen.getByText(/↑ 3,080/)).toBeInTheDocument();
    expect(screen.getByTestId('diferencia-value')).toHaveClass('text-danger');
  });

  it('shows the exact computed percentage difference when the what-if scenario is better', () => {
    useSimulationStore.setState({
      resultadoSimulacion: {
        ...baseResultado,
        valorFinal: 15000,
        diferencia: -5536,
        diferenciaPorcentual: -26.96
      }
    });

    render(<MetricsPanel />);

    expect(screen.getByText('-27.0%')).toBeInTheDocument();
    expect(screen.getByText(/↓ 5,536/)).toBeInTheDocument();
    expect(screen.getByTestId('diferencia-value')).toHaveClass('text-success');
  });

  it('renders nothing while the simulation has not run yet', () => {
    const { container } = render(<MetricsPanel />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not apply the highlight animation on initial load', () => {
    mockMatchMedia(false);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    expect(screen.getByTestId('metrics-panel')).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it('applies the highlight animation when a slot change produces a new result', () => {
    mockMatchMedia(false);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);
    expect(screen.getByTestId('metrics-panel')).not.toHaveClass(HIGHLIGHT_CLASS);

    act(() => {
      useSimulationStore.setState({
        resultadoSimulacion: { ...baseResultado, valorFinal: 20000, diferencia: -3616, diferenciaPorcentual: -15.3 }
      });
    });

    expect(screen.getByTestId('metrics-panel')).toHaveClass(HIGHLIGHT_CLASS);
  });

  it('does not apply the highlight animation when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    act(() => {
      useSimulationStore.setState({
        resultadoSimulacion: { ...baseResultado, valorFinal: 20000, diferencia: -3616, diferenciaPorcentual: -15.3 }
      });
    });

    expect(screen.getByTestId('metrics-panel')).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it('applies the font-display class to the three headline numbers (issue #17)', () => {
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    expect(screen.getByText('20,536')).toHaveClass('font-display');
    expect(screen.getByText('23,616')).toHaveClass('font-display');
    expect(screen.getByTestId('diferencia-value')).toHaveClass('font-display');
  });

  it('does not apply the font-display class to labels or units (issue #17)', () => {
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    expect(screen.getByText('Realidad Histórica')).not.toHaveClass('font-display');
    expect(screen.getAllByText('homicidios')[0]).not.toHaveClass('font-display');
  });
});
