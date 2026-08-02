/**
 * Controles de Simulación (Slots + Reset)
 */

import type { PresidenteId } from '../../data/types';
import { useSimulationStore } from '../../store/useSimulationStore';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { ResetIcon } from '../icons/Icons';
import { PresidentSlot } from './PresidentSlot';

export const SimulationControls = () => {
  const { slotsActuales, setSlot, resetToHistorico } = useSimulationStore();

  const handleSlotChange = (slotNumber: 1 | 2 | 3 | 4) => (presidenteId: PresidenteId) => {
    setSlot(slotNumber, presidenteId);
  };

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-dark-text">Controles de Simulación</h3>
        <InfoTooltip
          content="Selecciona qué presidente gobernaría en cada sexenio. El simulador aplicará su tasa de crecimiento real al valor acumulado."
          position="bottom"
        />
      </div>

      {/* Desktop: horizontal layout with arrows */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-4 mb-6">
        <PresidentSlot slotNumber={0} currentPresident={slotsActuales.slot0} disabled={true} />

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

      {/* Mobile: horizontal two-column layout */}
      <div className="md:hidden grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 mb-6 items-center">
        <PresidentSlot
          slotNumber={0}
          currentPresident={slotsActuales.slot0}
          disabled={true}
          layout="horizontal"
        />

        <PresidentSlot
          slotNumber={1}
          currentPresident={slotsActuales.slot1}
          onChange={handleSlotChange(1)}
          layout="horizontal"
        />

        <PresidentSlot
          slotNumber={2}
          currentPresident={slotsActuales.slot2}
          onChange={handleSlotChange(2)}
          layout="horizontal"
        />

        <PresidentSlot
          slotNumber={3}
          currentPresident={slotsActuales.slot3}
          onChange={handleSlotChange(3)}
          layout="horizontal"
        />

        <PresidentSlot
          slotNumber={4}
          currentPresident={slotsActuales.slot4}
          onChange={handleSlotChange(4)}
          layout="horizontal"
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={resetToHistorico}
          className="
            bg-accent text-white px-6 py-2 rounded-lg
            hover:bg-blue-600 transition-colors
            focus:outline-none focus:ring-2 focus:ring-accent
            flex items-center gap-2
          "
          data-testid="reset-button"
          aria-label="Resetear simulación al escenario histórico real"
        >
          <ResetIcon className="w-4 h-4" /> Resetear a Histórico
        </button>
        <InfoTooltip
          content="Restaura la configuración original: Fox → Calderón → Peña Nieto → AMLO → Sheinbaum"
          position="bottom"
        />
      </div>
    </div>
  );
};
