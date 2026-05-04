import { Sexenio } from './types';

/**
 * Metadata de los sexenios presidenciales en México (2000-2026)
 * Fuente: Datos oficiales de cambios de administración
 *
 * Tasas de crecimiento calculadas basadas en datos reales de INEGI/SESNSP
 */
export const SEXENIOS: Sexenio[] = [
  {
    presidente: 'Vicente Fox',
    inicio: '2000-12-01',
    fin: '2006-11-30',
    homicidiosInicio: 14.93,
    homicidiosFin: 9.5,
    tasaInicio: 14.93,
    tasaFin: 9.5,
    pendienteCrecimiento: -36.4, // Reducción del 36.4% durante sexenio
  },
  {
    presidente: 'Felipe Calderón',
    inicio: '2006-12-01',
    fin: '2012-11-30',
    homicidiosInicio: 9.5,
    homicidiosFin: 21.5,
    tasaInicio: 9.5,
    tasaFin: 21.5,
    pendienteCrecimiento: 126.3, // Incremento del 126% (guerra contra narco)
  },
  {
    presidente: 'Enrique Peña Nieto',
    inicio: '2012-12-01',
    fin: '2018-11-30',
    homicidiosInicio: 21.5,
    homicidiosFin: 29.58,
    tasaInicio: 21.5,
    tasaFin: 29.58,
    pendienteCrecimiento: 37.6, // Incremento del 37.6%
  },
  {
    presidente: 'AMLO',
    inicio: '2018-12-01',
    fin: '2024-09-30',
    homicidiosInicio: 29.58,
    homicidiosFin: 24.0,
    tasaInicio: 29.58,
    tasaFin: 24.0,
    pendienteCrecimiento: -18.9, // Reducción del 18.9%
  },
  {
    presidente: 'Claudia Sheinbaum',
    inicio: '2024-10-01',
    fin: '2024-12-31',
    homicidiosInicio: 24.0,
    homicidiosFin: 19.3,
    tasaInicio: 24.0,
    tasaFin: 19.3,
    pendienteCrecimiento: -19.6, // Reducción del 19.6% en primeros meses
  },
];

/**
 * Obtener el presidente correspondiente a una fecha dada
 */
export function getPresidenteByFecha(fecha: string): string {
  const sexenio = SEXENIOS.find(
    (s) => fecha >= s.inicio && fecha <= s.fin
  );
  return sexenio?.presidente || 'Desconocido';
}

/**
 * Verificar si un mes está en el periodo de inercia (primeros 6 meses)
 */
export function esInercia(fecha: string): boolean {
  const sexenio = SEXENIOS.find(
    (s) => fecha >= s.inicio && fecha <= s.fin
  );

  if (!sexenio) return false;

  const inicioDate = new Date(sexenio.inicio);
  const fechaDate = new Date(fecha);

  // Calcular diferencia en meses
  const diffMonths =
    (fechaDate.getFullYear() - inicioDate.getFullYear()) * 12 +
    (fechaDate.getMonth() - inicioDate.getMonth());

  return diffMonths < 6;
}
