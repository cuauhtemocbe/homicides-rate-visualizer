/**
 * MX Security What-If Simulator - Type Definitions
 * Version 2.0
 */

export type PresidenteId = 'fox' | 'calderon' | 'pena' | 'amlo' | 'sheinbaum';

export interface Presidente {
  id: PresidenteId;
  nombre: string;           // 'Vicente Fox Quesada'
  nombreCorto: string;      // 'Fox'
  tasaCrecimiento: number;  // Decimal: 0.016 = 1.6%
  multiplicador: number;    // 1 + tasaCrecimiento
  cierreOficial: number;    // Homicidios al final del sexenio
  periodo: string;          // '2000-2006'
  esProyeccion: boolean;    // true para Sheinbaum
}

export interface RegistroHistorico {
  presidente: PresidenteId;
  homicidios: number;       // Valor absoluto de cierre
  tasaCrecimiento: number;  // Porcentaje: 1.6, 192.8, etc.
  multiplicador: number;    // Factor multiplicador
  color: 'red' | 'green';   // Basado en signo de TC
}

export interface SimulacionSlots {
  slot0: 'fox';             // Fijo, no cambia
  slot1: PresidenteId;      // Seleccionable
  slot2: PresidenteId;      // Seleccionable
  slot3: PresidenteId;      // Seleccionable
  slot4: PresidenteId;      // Seleccionable
}

export interface ResultadoSimulacion {
  slots: SimulacionSlots;
  valores: number[];        // Valor final de cada slot
  valorFinal: number;       // Último valor calculado
  diferencia: number;       // Diferencia vs realidad histórica
  diferenciaPorcentual: number; // % diferencia
}
