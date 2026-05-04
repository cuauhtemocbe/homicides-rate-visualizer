/**
 * Calcula la tasa de homicidios por cada 100,000 habitantes
 */
export function calcularTasa(homicidios: number, poblacion: number): number {
  if (poblacion === 0) return 0;
  return (homicidios / poblacion) * 100000;
}

/**
 * Calcula la variación porcentual entre dos tasas
 */
export function calcularVariacion(tasaActual: number, tasaAnterior: number): number {
  if (tasaAnterior === 0) return 0;
  return ((tasaActual - tasaAnterior) / tasaAnterior) * 100;
}
