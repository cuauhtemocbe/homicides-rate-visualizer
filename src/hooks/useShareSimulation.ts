/**
 * Hook para compartir configuraciones de simulación via URL
 */

import { useCallback, useEffect } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { validatePresidenteId } from '../utils/validatePresidenteId';

export const useShareSimulation = () => {
  const { slotsActuales, setSlot } = useSimulationStore();

  /**
   * Serializa los slots actuales a query params
   */
  const generateShareUrl = useCallback((): string => {
    const params = new URLSearchParams();
    params.set('s1', slotsActuales.slot1);
    params.set('s2', slotsActuales.slot2);
    params.set('s3', slotsActuales.slot3);
    params.set('s4', slotsActuales.slot4);
    // slot0 siempre es Fox, no necesita estar en URL

    const url = new URL(window.location.href);
    url.search = params.toString();
    return url.toString();
  }, [slotsActuales]);

  /**
   * Copia la URL de compartir al clipboard
   */
  const copyShareUrl = useCallback(async (): Promise<boolean> => {
    try {
      const url = generateShareUrl();
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Failed to copy URL:', error);
      return false;
    }
  }, [generateShareUrl]);

  /**
   * Lee los slots desde los query params en el mount
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const s1 = validatePresidenteId(params.get('s1'));
    const s2 = validatePresidenteId(params.get('s2'));
    const s3 = validatePresidenteId(params.get('s3'));
    const s4 = validatePresidenteId(params.get('s4'));

    // Solo aplica si hay al menos un slot en la URL
    if (s1 || s2 || s3 || s4) {
      if (s1) setSlot(1, s1);
      if (s2) setSlot(2, s2);
      if (s3) setSlot(3, s3);
      if (s4) setSlot(4, s4);
    }
  }, [setSlot]); // Solo ejecutar en mount (setSlot es una referencia estable de Zustand)

  return {
    generateShareUrl,
    copyShareUrl,
  };
};
