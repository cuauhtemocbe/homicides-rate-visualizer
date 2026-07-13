/**
 * Tests for ComparisonChart
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComparisonChart } from './ComparisonChart';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { ResultadoSimulacion } from '../../data/types';

describe('ComparisonChart', () => {
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
});
