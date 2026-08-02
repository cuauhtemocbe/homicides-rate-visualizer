/**
 * Tests for MetricsPanel
 */

import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ResultadoSimulacion } from '../../data/types';
import { useSimulationStore } from '../../store/useSimulationStore';
import { MetricsPanel } from './MetricsPanel';

const HIGHLIGHT_CLASS = 'animate-metrics-highlight';

const mockMatchMedia = (matches: boolean) => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
};

const baseResultado: ResultadoSimulacion = {
  slots: { slot0: 'fox', slot1: 'calderon', slot2: 'pena', slot3: 'amlo', slot4: 'sheinbaum' },
  valores: [10452, 25963, 36685, 29752, 23616],
  valorFinal: 23616,
  diferencia: 3080,
  diferenciaPorcentual: 15.04,
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
    expect(screen.getByTestId('diferencia-value').textContent).toContain('↑');
    expect(screen.getByTestId('diferencia-value').textContent).toContain('3,080');
    expect(screen.getByTestId('diferencia-value')).toHaveClass('text-danger');
  });

  it('shows the exact computed percentage difference when the what-if scenario is better', () => {
    useSimulationStore.setState({
      resultadoSimulacion: {
        ...baseResultado,
        valorFinal: 15000,
        diferencia: -5536,
        diferenciaPorcentual: -26.96,
      },
    });

    render(<MetricsPanel />);

    expect(screen.getByText('-27.0%')).toBeInTheDocument();
    expect(screen.getByTestId('diferencia-value').textContent).toContain('↓');
    expect(screen.getByTestId('diferencia-value').textContent).toContain('5,536');
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
        resultadoSimulacion: {
          ...baseResultado,
          valorFinal: 20000,
          diferencia: -3616,
          diferenciaPorcentual: -15.3,
        },
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
        resultadoSimulacion: {
          ...baseResultado,
          valorFinal: 20000,
          diferencia: -3616,
          diferenciaPorcentual: -15.3,
        },
      });
    });

    expect(screen.getByTestId('metrics-panel')).not.toHaveClass(HIGHLIGHT_CLASS);
  });

  it('applies the font-display class to the three headline numbers (issue #17)', () => {
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    expect(screen.getByText('20,536')).toHaveClass('font-display');
    expect(screen.getByTestId('whatif-value')).toHaveClass('font-display');
    expect(screen.getByTestId('whatif-value').textContent).toContain('23,616');
    expect(screen.getByTestId('diferencia-value')).toHaveClass('font-display');
  });

  it('does not apply the font-display class to labels or units (issue #17)', () => {
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    expect(screen.getByText('Realidad Histórica')).not.toHaveClass('font-display');
    expect(screen.getAllByText('homicidios')[0]).not.toHaveClass('font-display');
  });

  it('marks the "Simulación ¿Y si?" figure with a stamp badge distinguishing it from the historical value (issue #21)', () => {
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    const stamp = screen.getByTestId('whatif-stamp');
    expect(stamp).toBeInTheDocument();
    expect(stamp.className).toMatch(/rotate/);

    const realidadContainer = screen.getByText('Realidad Histórica').closest('div');
    expect(realidadContainer?.querySelector('[data-testid="whatif-stamp"]')).toBeNull();
  });
});

describe('MetricsPanel rolling digit animation (issue #19)', () => {
  afterEach(() => {
    useSimulationStore.setState({ resultadoSimulacion: null });
    vi.unstubAllGlobals();
  });

  it('does not animate the digits on the initial result', () => {
    mockMatchMedia(false);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    const { container } = render(<MetricsPanel />);

    expect(container.querySelector('.transition-transform')).not.toBeInTheDocument();
  });

  it('animates the digits when a slot change produces a new result', () => {
    mockMatchMedia(false);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    const { container } = render(<MetricsPanel />);
    expect(container.querySelector('.transition-transform')).not.toBeInTheDocument();

    act(() => {
      useSimulationStore.setState({
        resultadoSimulacion: {
          ...baseResultado,
          valorFinal: 20000,
          diferencia: -3616,
          diferenciaPorcentual: -15.3,
        },
      });
    });

    expect(container.querySelector('.transition-transform')).toBeInTheDocument();
  });

  it('does not animate the digits when the user prefers reduced motion', () => {
    mockMatchMedia(true);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    const { container } = render(<MetricsPanel />);

    act(() => {
      useSimulationStore.setState({
        resultadoSimulacion: {
          ...baseResultado,
          valorFinal: 20000,
          diferencia: -3616,
          diferenciaPorcentual: -15.3,
        },
      });
    });

    expect(container.querySelector('.transition-transform')).not.toBeInTheDocument();
    expect(screen.getByTestId('whatif-value').textContent).toContain('20,000');
  });

  it('reflects a sign change from positive to negative diferencia with the correct icon and color', () => {
    mockMatchMedia(false);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);
    expect(screen.getByTestId('diferencia-value')).toHaveClass('text-danger');
    expect(screen.getByTestId('diferencia-value').textContent).toContain('↑');

    act(() => {
      useSimulationStore.setState({
        resultadoSimulacion: {
          ...baseResultado,
          valorFinal: 15000,
          diferencia: -5536,
          diferenciaPorcentual: -26.96,
        },
      });
    });

    expect(screen.getByTestId('diferencia-value')).toHaveClass('text-success');
    expect(screen.getByTestId('diferencia-value').textContent).toContain('↓');
    expect(screen.getByTestId('diferencia-value').textContent).toContain('5,536');
  });

  it('settles on the final value after rapid consecutive changes', () => {
    mockMatchMedia(false);
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    act(() => {
      useSimulationStore.setState({
        resultadoSimulacion: {
          ...baseResultado,
          valorFinal: 18000,
          diferencia: -5616,
          diferenciaPorcentual: -23.7,
        },
      });
      useSimulationStore.setState({
        resultadoSimulacion: {
          ...baseResultado,
          valorFinal: 20000,
          diferencia: -3616,
          diferenciaPorcentual: -15.3,
        },
      });
    });

    expect(screen.getByTestId('whatif-value').textContent).toContain('20,000');
    expect(screen.getByTestId('diferencia-value').textContent).toContain('3,616');
  });
});
