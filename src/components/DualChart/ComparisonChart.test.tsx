/**
 * Tests for ComparisonChart
 */

import { describe, it, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonChart } from './ComparisonChart';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { ResultadoSimulacion } from '../../data/types';

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
      }
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
      toJSON: () => {}
    } as DOMRect);
  });

  afterAll(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    useSimulationStore.setState({ resultadoSimulacion: null });
  });

  it('shows a loading state until a simulation result exists', () => {
    render(<ComparisonChart />);
    expect(screen.getByText('Calculando simulación...')).toBeInTheDocument();
  });

  it('renders both the Real and ¿Y si? series with correct labels once a result exists', () => {
    const resultado: ResultadoSimulacion = {
      slots: { slot0: 'fox', slot1: 'calderon', slot2: 'pena', slot3: 'amlo', slot4: 'sheinbaum' },
      valores: [10452, 25963, 36685, 29752, 15000],
      valorFinal: 15000,
      diferencia: -5536,
      diferenciaPorcentual: -26.96
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
        name: /comparando la realidad histórica con el escenario ¿y si\?/i
      })
    ).toBeInTheDocument();
  });

  const renderWithResult = () => {
    const resultado: ResultadoSimulacion = {
      slots: { slot0: 'fox', slot1: 'calderon', slot2: 'pena', slot3: 'amlo', slot4: 'sheinbaum' },
      valores: [10452, 25963, 36685, 29752, 15000],
      valorFinal: 15000,
      diferencia: -5536,
      diferenciaPorcentual: -26.96
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

  it('renders the Real line solid and the What-If line dashed', () => {
    const { container } = renderWithResult();

    const [realPath, whatIfPath] = Array.from(container.querySelectorAll('.recharts-line-curve'));
    expect(realPath.getAttribute('stroke-dasharray')).toBeFalsy();
    expect(whatIfPath.getAttribute('stroke-dasharray')).toBeTruthy();
  });

  it('renders legend swatches matching the Real and What-If line colors and patterns', () => {
    const { container, getByTestId } = renderWithResult();

    const [realPath, whatIfPath] = Array.from(container.querySelectorAll('.recharts-line-curve'));
    const realSwatch = getByTestId('legend-swatch-real');
    const whatIfSwatch = getByTestId('legend-swatch-whatif');

    expect(realSwatch.style.borderColor || realSwatch.style.backgroundColor).toBeTruthy();
    expect(realSwatch.getAttribute('data-dashed')).toBe('false');
    expect(whatIfSwatch.getAttribute('data-dashed')).toBe('true');
    expect(realPath.getAttribute('stroke')).toBeTruthy();
    expect(whatIfPath.getAttribute('stroke')).toBeTruthy();
  });
});
