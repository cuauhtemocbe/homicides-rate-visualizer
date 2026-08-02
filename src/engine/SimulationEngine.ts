/**
 * MX Security What-If Simulator - Simulation Engine
 *
 * Motor de cascada acumulativa para calcular escenarios "What-If"
 * Fórmula: V_final = V_anterior × (1 + TC_actual)
 */

import { VALOR_REAL_FINAL } from '../data/historico.data';
import { PRESIDENTES } from '../data/presidentes.data';
import type { Presidente, PresidenteId, ResultadoSimulacion, SimulacionSlots } from '../data/types';

export class SimulationEngine {
  private readonly presidentes: Record<PresidenteId, Presidente>;

  constructor() {
    this.presidentes = PRESIDENTES;
  }

  /**
   * Calcula un escenario What-If basado en los slots seleccionados
   *
   * @param slots - Configuración de presidentes para cada slot
   * @returns Resultado de la simulación con valores calculados
   */
  calculateWhatIfScenario(slots: SimulacionSlots): ResultadoSimulacion {
    const valores: number[] = [];
    let valorActual = this.presidentes.fox.cierreOficial; // 10,452 (fijo)

    // Slot 0: Fox (siempre fijo)
    valores.push(valorActual);

    // Slots 1-4: Calculados en cascada
    const slotIds: PresidenteId[] = [slots.slot1, slots.slot2, slots.slot3, slots.slot4];

    for (const presidenteId of slotIds) {
      const presidente = this.presidentes[presidenteId];
      valorActual = valorActual * presidente.multiplicador;
      valores.push(Math.round(valorActual));
    }

    const valorFinal = valores[valores.length - 1];
    const diferencia = this.calcularDiferencia(valorFinal);
    const diferenciaPorcentual = this.calcularDiferenciaPorcentual(valorFinal);

    return {
      slots,
      valores,
      valorFinal,
      diferencia,
      diferenciaPorcentual,
    };
  }

  /**
   * Obtiene la configuración histórica real (orden cronológico)
   */
  getConfiguracionHistorica(): SimulacionSlots {
    return {
      slot0: 'fox',
      slot1: 'calderon',
      slot2: 'pena',
      slot3: 'amlo',
      slot4: 'sheinbaum',
    };
  }

  /**
   * Calcula diferencia absoluta vs realidad histórica
   */
  private calcularDiferencia(valorSimulado: number): number {
    return valorSimulado - VALOR_REAL_FINAL;
  }

  /**
   * Calcula diferencia porcentual vs realidad histórica
   */
  private calcularDiferenciaPorcentual(valorSimulado: number): number {
    return ((valorSimulado - VALOR_REAL_FINAL) / VALOR_REAL_FINAL) * 100;
  }
}
