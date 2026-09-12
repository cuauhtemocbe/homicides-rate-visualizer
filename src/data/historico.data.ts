/**
 * MX Security What-If Simulator - Datos Históricos Reales
 *
 * Valores de cierre de cada administración presidencial
 * Fuentes: INEGI, SESNSP, World Bank
 */

import type { RegistroHistorico } from './types';

export const HISTORICO_REAL: RegistroHistorico[] = [
  {
    presidente: 'fox',
    homicidios: 10452,
    tasaCrecimiento: 1.6,
    multiplicador: 1.016,
    color: 'red', // Crecimiento positivo
  },
  {
    presidente: 'calderon',
    homicidios: 25967,
    tasaCrecimiento: 148.4, // Corregido: 25967/10452 - 1
    multiplicador: 2.484, // Corregido: 25967 / 10452
    color: 'red', // Fuerte crecimiento (guerra contra narco)
  },
  {
    presidente: 'pena',
    homicidios: 36685,
    tasaCrecimiento: 41.3, // Corregido: 36685/25967 - 1
    multiplicador: 1.413, // Corregido: 36685 / 25967
    color: 'red', // Crecimiento continuo
  },
  {
    presidente: 'amlo',
    homicidios: 29741,
    tasaCrecimiento: -18.9, // Corregido: 29741/36685 - 1
    multiplicador: 0.811, // Corregido: 29741 / 36685
    color: 'green', // Reducción
  },
  {
    presidente: 'sheinbaum',
    homicidios: 13978, // Proyectado: 29741 (AMLO) * 0.47
    tasaCrecimiento: -53.0, // SESNSP, sep 2026: -53% homicidios diarios promedio (sep-2024 vs ago-2026)
    multiplicador: 0.47, // 13978 / 29741
    color: 'green', // Reducción proyectada
  },
];

/**
 * Valor final de la realidad histórica (Sheinbaum proyectado)
 */
export const VALOR_REAL_FINAL = 13978;
