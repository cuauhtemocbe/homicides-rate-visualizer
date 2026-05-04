/**
 * Controles de Simulación (Slots + Reset)
 */

import { useSimulationStore } from '../../store/useSimulationStore';
import { PresidentSlot } from './PresidentSlot';
import type { PresidenteId } from '../../data/types';

export const SimulationControls = () => {
  const { slotsActuales, setSlot, resetToHistorico } = useSimulationStore();

  const handleSlotChange = (slotNumber: 1 | 2 | 3 | 4) => (presidenteId: PresidenteId) => {
    setSlot(slotNumber, presidenteId);
  };

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <h3 className="text-lg font-bold text-dark-text mb-4 text-center">
        Controles de Simulación
      </h3>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <PresidentSlot
          slotNumber={0}
          currentPresident={slotsActuales.slot0}
          disabled={true}
        />

        <span className="text-dark-text-secondary text-2xl">→</span>

        <PresidentSlot
          slotNumber={1}
          currentPresident={slotsActuales.slot1}
          onChange={handleSlotChange(1)}
        />

        <span className="text-dark-text-secondary text-2xl">→</span>

        <PresidentSlot
          slotNumber={2}
          currentPresident={slotsActuales.slot2}
          onChange={handleSlotChange(2)}
        />

        <span className="text-dark-text-secondary text-2xl">→</span>

        <PresidentSlot
          slotNumber={3}
          currentPresident={slotsActuales.slot3}
          onChange={handleSlotChange(3)}
        />

        <span className="text-dark-text-secondary text-2xl">→</span>

        <PresidentSlot
          slotNumber={4}
          currentPresident={slotsActuales.slot4}
          onChange={handleSlotChange(4)}
        />
      </div>

      <div className="text-center">
        <button
          onClick={resetToHistorico}
          className="
            bg-accent text-white px-6 py-2 rounded-lg
            hover:bg-blue-600 transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent
          "
          data-testid="reset-button"
        >
          ⟲ Resetear a Histórico
        </button>
      </div>
    </div>
  );
};
