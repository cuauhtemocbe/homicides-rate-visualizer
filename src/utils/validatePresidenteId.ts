import { PRESIDENTES } from '../data/presidentes.data';
import type { PresidenteId } from '../data/types';

/**
 * Valida que un valor de query param corresponda a un PresidenteId conocido.
 * Devuelve null para valores ausentes, vacíos o no reconocidos.
 */
export function validatePresidenteId(value: string | null): PresidenteId | null {
  if (!value) return null;
  return value in PRESIDENTES ? (value as PresidenteId) : null;
}
