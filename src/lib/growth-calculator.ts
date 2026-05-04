import { RegistroMensual } from '../data/types';

/**
 * Calcula la pendiente de crecimiento (%) entre dos puntos
 */
export function calcularPendiente(
  tasaInicio: number,
  tasaFin: number,
  meses: number
): number {
  if (meses === 0 || tasaInicio === 0) return 0;

  // Tasa de crecimiento mensual promedio
  const crecimientoTotal = ((tasaFin - tasaInicio) / tasaInicio) * 100;
  return crecimientoTotal / meses;
}

/**
 * Calcula la pendiente de crecimiento de un conjunto de registros
 */
export function calcularPendienteDeRegistros(registros: RegistroMensual[]): number {
  if (registros.length < 2) return 0;

  const primero = registros[0];
  const ultimo = registros[registros.length - 1];

  return calcularPendiente(primero.tasa, ultimo.tasa, registros.length);
}
