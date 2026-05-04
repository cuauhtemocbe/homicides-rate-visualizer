/**
 * Formateador de números para gráficos
 * Convierte números grandes en formato compacto (ej: 38000 → "38 mil")
 */

export const formatNumberCompact = (value: number): string => {
  if (value >= 1000) {
    const thousands = value / 1000;
    // Si es número entero en miles, no mostrar decimales
    if (thousands % 1 === 0) {
      return `${thousands.toLocaleString('es-MX')} mil`;
    }
    // Si tiene decimales, mostrar 1 decimal
    return `${thousands.toFixed(1)} mil`;
  }
  return value.toLocaleString('es-MX');
};
