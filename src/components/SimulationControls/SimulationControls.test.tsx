/**
 * Tests for SimulationControls
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SimulationControls } from './SimulationControls';
import { useSimulationStore } from '../../store/useSimulationStore';
import { SimulationEngine } from '../../engine/SimulationEngine';

describe('SimulationControls', () => {
  beforeEach(() => {
    useSimulationStore.getState().resetToHistorico();
  });

  it('selecting a different president in slot 2 updates the store and recalculates', async () => {
    const user = userEvent.setup();
    render(<SimulationControls />);

    // Desktop and mobile layouts both render a slot-2 select; either reflects the shared store state.
    const [select] = screen.getAllByTestId('slot-2');
    await user.selectOptions(select, 'amlo');

    const state = useSimulationStore.getState();
    expect(state.slotsActuales.slot2).toBe('amlo');

    const engine = new SimulationEngine();
    const expected = engine.calculateWhatIfScenario(state.slotsActuales);
    expect(state.resultadoSimulacion?.valores).toEqual(expected.valores);
  });

  it('clicking reset restores the historical scenario after slots were changed', async () => {
    const user = userEvent.setup();
    render(<SimulationControls />);

    const [select] = screen.getAllByTestId('slot-2');
    await user.selectOptions(select, 'amlo');
    expect(useSimulationStore.getState().slotsActuales.slot2).toBe('amlo');

    await user.click(screen.getByTestId('reset-button'));

    expect(useSimulationStore.getState().slotsActuales).toEqual(
      new SimulationEngine().getConfiguracionHistorica()
    );
  });

  it('renders the reset button with a custom icon instead of an emoji', () => {
    render(<SimulationControls />);

    const button = screen.getByTestId('reset-button');
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button.textContent).not.toContain('⟲');
  });
});
