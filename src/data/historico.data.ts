/**
 * MX Security What-If Simulator - Datos Históricos Reales
 *
 * Valores de cierre de cada administración presidencial
 * Fuentes: INEGI, SESNSP, World Bank
 */

import { RegistroHistorico } from './types';

export const HISTORICO_REAL: RegistroHistorico[] = [
  {
    presidente: 'fox',
    homicidios: 10452,
    tasaCrecimiento: 1.6,
    multiplicador: 1.016,
    color: 'red'              // Crecimiento positivo
  },
  {
    presidente: 'calderon',
    homicidios: 25967,
    tasaCrecimiento: 192.8,
    multiplicador: 2.928,
    color: 'red'              // Fuerte crecimiento (guerra contra narco)
  },
  {
    presidente: 'pena',
    homicidios: 36685,
    tasaCrecimiento: 59.0,
    multiplicador: 1.59,
    color: 'red'              // Crecimiento continuo
  },
  {
    presidente: 'amlo',
    homicidios: 29741,
    tasaCrecimiento: -22.0,
    multiplicador: 0.78,
    color: 'green'            // Reducción
  },
  {
    presidente: 'sheinbaum',
    homicidios: 20536,        // Proyectado
    tasaCrecimiento: -31.0,
    multiplicador: 0.69,
    color: 'green'            // Reducción proyectada
  }
];

/**
 * Valor final de la realidad histórica (Sheinbaum proyectado)
 */
export const VALOR_REAL_FINAL = 20536;
