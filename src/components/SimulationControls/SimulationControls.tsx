/**
 * Controles de Simulación (Slots + Reset)
 */

import { useSimulationStore } from '../../store/useSimulationStore';
import { PresidentSlot } from './PresidentSlot';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import type { PresidenteId } from '../../data/types';

export const SimulationControls = () => {
  const { slotsActuales, setSlot, resetToHistorico } = useSimulationStore();

  const handleSlotChange = (slotNumber: 1 | 2 | 3 | 4) => (presidenteId: PresidenteId) => {
    setSlot(slotNumber, presidenteId);
  };

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-dark-text">
          Controles de Simulación
        </h3>
        <InfoTooltip
          content="Selecciona qué presidente gobernaría en cada sexenio. El simulador aplicará su tasa de crecimiento real al valor acumulado."
          position="bottom"
        />
      </div>

      {/* Desktop: horizontal layout with arrows */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-4 mb-6">
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

      {/* Mobile: vertical stack with dividers */}
      <div className="md:hidden space-y-4 mb-6">
        <PresidentSlot
          slotNumber={0}
          currentPresident={slotsActuales.slot0}
          disabled={true}
        />

        <div className="border-t border-dark-border my-2" />

        <PresidentSlot
          slotNumber={1}
          currentPresident={slotsActuales.slot1}
          onChange={handleSlotChange(1)}
        />

        <div className="border-t border-dark-border my-2" />

        <PresidentSlot
          slotNumber={2}
          currentPresident={slotsActuales.slot2}
          onChange={handleSlotChange(2)}
        />

        <div className="border-t border-dark-border my-2" />

        <PresidentSlot
          slotNumber={3}
          currentPresident={slotsActuales.slot3}
          onChange={handleSlotChange(3)}
        />

        <div className="border-t border-dark-border my-2" />

        <PresidentSlot
          slotNumber={4}
          currentPresident={slotsActuales.slot4}
          onChange={handleSlotChange(4)}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={resetToHistorico}
          className="
            bg-accent text-white px-6 py-2 rounded-lg
            hover:bg-blue-600 transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent
          "
          data-testid="reset-button"
          aria-label="Resetear simulación al escenario histórico real"
        >
          ⟲ Resetear a Histórico
        </button>
        <InfoTooltip
          content="Restaura la configuración original: Fox → Calderón → Peña Nieto → AMLO → Sheinbaum"
          position="bottom"
        />
      </div>
    </div>
  );
};
