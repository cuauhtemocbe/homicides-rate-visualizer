import { RegistroMensual } from './types';
import { getPresidenteByFecha, esInercia } from './sexenios.data';

/**
 * NOTA: Estos son datos de ejemplo para desarrollo
 * TODO: Reemplazar con datos reales de SESNSP/INEGI/CONAPO
 *
 * Para obtener datos reales:
 * 1. SESNSP: https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva
 * 2. CONAPO: https://www.gob.mx/conapo (proyecciones de población)
 * 3. Calcular tasa = (homicidios / población) * 100000
 */

// Población aproximada de México por año (millones)
const POBLACION_POR_ANIO: Record<number, number> = {
  2000: 97483412,
  2005: 103263388,
  2010: 112336538,
  2015: 119530753,
  2020: 126014024,
  2024: 129875529,
  2026: 131892620,
};

/**
 * Genera datos de ejemplo mensual desde 2000 hasta 2026
 * En producción, estos datos deben venir de archivos JSON con datos reales
 */
function generarDatosEjemplo(): RegistroMensual[] {
  const registros: RegistroMensual[] = [];
  const añoInicio = 2000;
  const añoFin = 2026;

  for (let año = añoInicio; año <= añoFin; año++) {
    const mesesEnAño = año === 2026 ? 12 : 12; // Ajustar según datos disponibles

    for (let mes = 1; mes <= mesesEnAño; mes++) {
      const fecha = `${año}-${mes.toString().padStart(2, '0')}-01`;
      const poblacion = interpolatePoblacion(año, mes);

      // Datos simulados - en producción usar datos reales
      const homicidios = Math.floor(2000 + Math.random() * 1000 + (año - 2000) * 50);
      const tasa = (homicidios / poblacion) * 100000;

      registros.push({
        fecha,
        homicidios,
        tasa: parseFloat(tasa.toFixed(2)),
        presidente: getPresidenteByFecha(fecha),
        esProyeccion: año === 2026 && mes > 5, // Ejemplo: proyección después de mayo 2026
        esInercia: esInercia(fecha),
        poblacion,
      });
    }
  }

  return registros;
}

/**
 * Interpola la población para un mes específico
 */
function interpolatePoblacion(año: number, mes: number): number {
  const años = Object.keys(POBLACION_POR_ANIO).map(Number).sort();

  // Encontrar el año más cercano
  let añoBase = años[0];
  for (const a of años) {
    if (a <= año) añoBase = a;
  }

  const poblacionBase = POBLACION_POR_ANIO[añoBase];
  const añoSiguiente = años.find(a => a > añoBase) || añoBase;
  const poblacionSiguiente = POBLACION_POR_ANIO[añoSiguiente];

  if (añoBase === añoSiguiente) return poblacionBase;

  // Interpolación lineal
  const progreso = (año - añoBase + (mes - 1) / 12) / (añoSiguiente - añoBase);
  return Math.floor(poblacionBase + (poblacionSiguiente - poblacionBase) * progreso);
}

/**
 * Datos históricos de homicidios (2000-2026)
 * TODO: Reemplazar generarDatosEjemplo() con datos reales hardcodeados
 */
export const HOMICIDIOS_DATA: RegistroMensual[] = generarDatosEjemplo();
