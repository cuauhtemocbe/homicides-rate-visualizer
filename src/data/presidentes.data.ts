/**
 * MX Security What-If Simulator - Datos de Presidentes
 *
 * Fuentes: INEGI, SESNSP, World Bank, Wikipedia
 * Datos oficiales de homicidios por administración presidencial
 */

import type { Presidente, PresidenteId } from './types';

export const PRESIDENTES: Record<PresidenteId, Presidente> = {
  fox: {
    id: 'fox',
    nombre: 'Vicente Fox Quesada',
    nombreCorto: 'Fox',
    tasaCrecimiento: 0.016, // 1.6%
    multiplicador: 1.016,
    cierreOficial: 10452,
    periodo: '2000-2006',
    esProyeccion: false,
  },
  calderon: {
    id: 'calderon',
    nombre: 'Felipe Calderón Hinojosa',
    nombreCorto: 'Calderón',
    tasaCrecimiento: 1.484, // 148.4% (25967/10452 - 1)
    multiplicador: 2.484, // 25967 / 10452
    cierreOficial: 25967,
    periodo: '2006-2012',
    esProyeccion: false,
  },
  pena: {
    id: 'pena',
    nombre: 'Enrique Peña Nieto',
    nombreCorto: 'Peña Nieto',
    tasaCrecimiento: 0.413, // 41.3% (36685/25967 - 1)
    multiplicador: 1.413, // 36685 / 25967
    cierreOficial: 36685,
    periodo: '2012-2018',
    esProyeccion: false,
  },
  amlo: {
    id: 'amlo',
    nombre: 'Andrés Manuel López Obrador',
    nombreCorto: 'AMLO',
    tasaCrecimiento: -0.189, // -18.9% (29741/36685 - 1)
    multiplicador: 0.811, // 29741 / 36685
    cierreOficial: 29741, // Dato 2023
    periodo: '2018-2024',
    esProyeccion: false,
  },
  sheinbaum: {
    id: 'sheinbaum',
    nombre: 'Claudia Sheinbaum Pardo',
    nombreCorto: 'Sheinbaum',
    tasaCrecimiento: -0.31, // -31.0% (20536/29741 - 1)
    multiplicador: 0.69, // 20536 / 29741
    cierreOficial: 20536, // Proyectado (calculado)
    periodo: '2024-2030',
    esProyeccion: true,
  },
};

/**
 * Array ordenado de IDs de presidentes (orden histórico)
 */
export const ORDEN_HISTORICO: PresidenteId[] = ['fox', 'calderon', 'pena', 'amlo', 'sheinbaum'];
