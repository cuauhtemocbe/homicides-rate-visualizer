import { Sexenio } from './types';

/**
 * Metadata de los sexenios presidenciales en México (2000-2026)
 * Fuente: Datos oficiales de cambios de administración
 */
export const SEXENIOS: Sexenio[] = [
  {
    presidente: 'Vicente Fox',
    inicio: '2000-12-01',
    fin: '2006-11-30',
    homicidiosInicio: 0, // TODO: Llenar con datos reales
    homicidiosFin: 0,
    tasaInicio: 0,
    tasaFin: 0,
    pendienteCrecimiento: 0,
  },
  {
    presidente: 'Felipe Calderón',
    inicio: '2006-12-01',
    fin: '2012-11-30',
    homicidiosInicio: 0,
    homicidiosFin: 0,
    tasaInicio: 0,
    tasaFin: 0,
    pendienteCrecimiento: 0,
  },
  {
    presidente: 'Enrique Peña Nieto',
    inicio: '2012-12-01',
    fin: '2018-11-30',
    homicidiosInicio: 0,
    homicidiosFin: 0,
    tasaInicio: 0,
    tasaFin: 0,
    pendienteCrecimiento: 0,
  },
  {
    presidente: 'AMLO',
    inicio: '2018-12-01',
    fin: '2024-09-30', // Término efectivo
    homicidiosInicio: 0,
    homicidiosFin: 0,
    tasaInicio: 0,
    tasaFin: 0,
    pendienteCrecimiento: 0,
  },
  {
    presidente: 'Claudia Sheinbaum',
    inicio: '2024-10-01',
    fin: '2026-12-31', // Proyección hasta fin de datos
    homicidiosInicio: 0,
    homicidiosFin: 0,
    tasaInicio: 0,
    tasaFin: 0,
    pendienteCrecimiento: 0,
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
