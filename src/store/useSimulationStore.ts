/**
 * MX Security What-If Simulator - Global State Management
 *
 * Zustand store para manejar el estado de la simulación
 */

import { create } from 'zustand';
import { HISTORICO_REAL } from '../data/historico.data';
import { PRESIDENTES } from '../data/presidentes.data';
import type {
  Presidente,
  PresidenteId,
  RegistroHistorico,
  ResultadoSimulacion,
  SimulacionSlots,
} from '../data/types';
import { SimulationEngine } from '../engine/SimulationEngine';

interface SimulationState {
  // Data
  presidentes: Record<PresidenteId, Presidente>;
  historicoReal: RegistroHistorico[];

  // Simulation
  slotsActuales: SimulacionSlots;
  resultadoSimulacion: ResultadoSimulacion | null;

  // Engine
  engine: SimulationEngine;

  // Actions
  setSlot: (slotNumber: 1 | 2 | 3 | 4, presidenteId: PresidenteId) => void;
  resetToHistorico: () => void;
  recalcularSimulacion: () => void;
  inicializar: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => {
  const engine = new SimulationEngine();

  return {
    // Data inicial
    presidentes: PRESIDENTES,
    historicoReal: HISTORICO_REAL,
    slotsActuales: engine.getConfiguracionHistorica(),
    resultadoSimulacion: null,
    engine,

    // Cambiar un slot específico
    setSlot: (slotNumber, presidenteId) => {
      set((state) => {
        const newSlots = { ...state.slotsActuales } as SimulacionSlots;
        const slotKey = `slot${slotNumber}` as 'slot1' | 'slot2' | 'slot3' | 'slot4';
        newSlots[slotKey] = presidenteId;
        return { slotsActuales: newSlots };
      });
      get().recalcularSimulacion();
    },

    // Resetear a configuración histórica
    resetToHistorico: () => {
      set({ slotsActuales: engine.getConfiguracionHistorica() });
      get().recalcularSimulacion();
    },

    // Recalcular simulación
    recalcularSimulacion: () => {
      const { slotsActuales, engine } = get();
      const resultado = engine.calculateWhatIfScenario(slotsActuales);
      set({ resultadoSimulacion: resultado });
    },

    // Inicializar (llamar al montar la app)
    inicializar: () => {
      get().recalcularSimulacion();
    },
  };
});
