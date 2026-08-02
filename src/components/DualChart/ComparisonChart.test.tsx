/**
 * Tests for ComparisonChart
 */

import { render, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import type { ResultadoSimulacion } from '../../data/types';
import { useSimulationStore } from '../../store/useSimulationStore';
import { ComparisonChart } from './ComparisonChart';

describe('ComparisonChart', () => {
  // Recharts' ResponsiveContainer measures its DOM node via getBoundingClientRect,
  // which jsdom always reports as 0x0 — stub it so the chart actually renders SVG lines.
  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 800,
      height: 500,
      top: 0,
      left: 0,
      bottom: 500,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);
  });

  afterAll(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    useSimulationStore.setState({ resultadoSimulacion: null });
  });

  it('shows a branded loading state with role="status" until a simulation result exists', () => {
    render(<ComparisonChart />);
    const status = screen.getByRole('status', { name: 'Calculando simulación...' });
    expect(status).toBeInTheDocument();
    expect(status.textContent).toContain('Calculando simulación...');
  });

  it('renders both the Real and ¿Y si? series with correct labels once a result exists', () => {
    const resultado: ResultadoSimulacion = {
      slots: { slot0: 'fox', slot1: 'calderon', slot2: 'pena', slot3: 'amlo', slot4: 'sheinbaum' },
      valores: [10452, 25963, 36685, 29752, 15000],
      valorFinal: 15000,
      diferencia: -5536,
      diferenciaPorcentual: -26.96,
    };
    useSimulationStore.setState({ resultadoSimulacion: resultado });

    render(<ComparisonChart />);

    expect(screen.getByText('Real:')).toBeInTheDocument();
    expect(screen.getByText('¿Y si?:')).toBeInTheDocument();
    // HISTORICO_REAL final value (fixed real data, unaffected by the simulated result)
    expect(screen.getByText('20.5 mil')).toBeInTheDocument();
    // resultadoSimulacion.valorFinal formatted
    expect(screen.getByText('15 mil')).toBeInTheDocument();

    expect(
      screen.getByRole('img', {
        name: /comparando la realidad histórica con el escenario ¿y si\?/i,
      }),
    ).toBeInTheDocument();
  });

  const renderWithResult = () => {
    const resultado: ResultadoSimulacion = {
      slots: { slot0: 'fox', slot1: 'calderon', slot2: 'pena', slot3: 'amlo', slot4: 'sheinbaum' },
      valores: [10452, 25963, 36685, 29752, 15000],
      valorFinal: 15000,
      diferencia: -5536,
      diferenciaPorcentual: -26.96,
    };
    useSimulationStore.setState({ resultadoSimulacion: resultado });
    return render(<ComparisonChart />);
  };

  it('renders the Real line in a neutral color, distinct from the danger color used for "worse" results', () => {
    const { container } = renderWithResult();

    const [realPath] = Array.from(container.querySelectorAll('.recharts-line-curve'));
    expect(realPath.getAttribute('stroke')?.toUpperCase()).not.toBe('#EF4444');
  });

  it('renders the What-If line in a color distinct from the Real line', () => {
    const { container } = renderWithResult();

    const [realPath, whatIfPath] = Array.from(container.querySelectorAll('.recharts-line-curve'));
    expect(whatIfPath.getAttribute('stroke')).not.toBe(realPath.getAttribute('stroke'));
  });

  it('renders both the Real and What-If lines as thin solid strokes', () => {
    const { container } = renderWithResult();

    const [realPath, whatIfPath] = Array.from(container.querySelectorAll('.recharts-line-curve'));
    expect(realPath.getAttribute('stroke-dasharray')).toBeFalsy();
    expect(whatIfPath.getAttribute('stroke-dasharray')).toBeFalsy();
    expect(Number(realPath.getAttribute('stroke-width'))).toBeLessThan(3);
    expect(Number(whatIfPath.getAttribute('stroke-width'))).toBeLessThan(3);
  });

  it('renders the Real markers as circles and the What-If markers as a distinct non-circular shape', () => {
    const { container } = renderWithResult();

    const realDots = container.querySelectorAll('circle.recharts-dot');
    const whatIfMarkers = container.querySelectorAll('[data-testid="whatif-marker"]');

    expect(realDots.length).toBeGreaterThan(0);
    expect(whatIfMarkers.length).toBeGreaterThan(0);
    whatIfMarkers.forEach((marker) => {
      expect(marker.tagName.toLowerCase()).not.toBe('circle');
    });
  });

  it('renders legend swatches reflecting marker shape instead of a dash pattern', () => {
    const { container, getByTestId } = renderWithResult();

    const [realPath, whatIfPath] = Array.from(container.querySelectorAll('.recharts-line-curve'));
    const realSwatch = getByTestId('legend-swatch-real');
    const whatIfSwatch = getByTestId('legend-swatch-whatif');

    expect(realSwatch.style.borderColor || realSwatch.style.backgroundColor).toBeTruthy();
    expect(realSwatch.getAttribute('data-dashed')).toBe('false');
    expect(realSwatch.getAttribute('data-shape')).toBe('circle');
    expect(whatIfSwatch.getAttribute('data-dashed')).toBe('false');
    expect(whatIfSwatch.getAttribute('data-shape')).toBe('square');
    expect(realPath.getAttribute('stroke')).toBeTruthy();
    expect(whatIfPath.getAttribute('stroke')).toBeTruthy();
  });

  it('keeps the two lines distinguishable by marker shape alone, independent of color', () => {
    const { container } = renderWithResult();

    const realDots = container.querySelectorAll('circle.recharts-dot');
    const whatIfMarkers = container.querySelectorAll('[data-testid="whatif-marker"]');

    expect(realDots.length).toBeGreaterThan(0);
    expect(whatIfMarkers.length).toBeGreaterThan(0);
    expect(container.querySelector('circle.recharts-dot')?.tagName.toLowerCase()).toBe('circle');
    expect(container.querySelector('[data-testid="whatif-marker"]')?.tagName.toLowerCase()).toBe(
      'rect',
    );
  });
});
