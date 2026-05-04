import { RegistroMensual, RegistroSimulado } from '../data/types';

/**
 * Aplica una tasa de crecimiento mensual a un valor base durante N meses
 */
export function aplicarCrecimiento(
  valorBase: number,
  tasaCrecimientoMensual: number,
  meses: number
): number {
  // Crecimiento compuesto: V = V0 * (1 + r)^n
  return valorBase * Math.pow(1 + tasaCrecimientoMensual / 100, meses);
}

/**
 * Genera una proyección simulada aplicando la tasa de crecimiento
 * de un presidente al periodo de otro
 */
export function generarProyeccion(
  registrosReales: RegistroMensual[],
  tasaCrecimientoMensual: number,
  presidenteSimulado: string
): RegistroSimulado[] {
  if (registrosReales.length === 0) return [];

  const valorBase = registrosReales[0].tasa;

  return registrosReales.map((registro, index) => ({
    ...registro,
    tasaProyectada: aplicarCrecimiento(valorBase, tasaCrecimientoMensual, index),
    presidenteSimulado,
  }));
}
