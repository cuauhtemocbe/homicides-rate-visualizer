/**
 * Tests for MetricsPanel
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsPanel } from './MetricsPanel';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { ResultadoSimulacion } from '../../data/types';

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
  });

  it('shows the exact computed percentage difference when the what-if scenario is worse', () => {
    useSimulationStore.setState({ resultadoSimulacion: baseResultado });

    render(<MetricsPanel />);

    expect(screen.getByText('+15.0%')).toBeInTheDocument();
    expect(screen.getByText(/↑ 3,080/)).toBeInTheDocument();
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
  });

  it('renders nothing while the simulation has not run yet', () => {
    const { container } = render(<MetricsPanel />);
    expect(container).toBeEmptyDOMElement();
  });
});
