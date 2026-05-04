/**
 * Hook para compartir configuraciones de simulación via URL
 */

import { useCallback, useEffect } from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import type { PresidenteId } from '../data/types';

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

    const s1 = params.get('s1') as PresidenteId | null;
    const s2 = params.get('s2') as PresidenteId | null;
    const s3 = params.get('s3') as PresidenteId | null;
    const s4 = params.get('s4') as PresidenteId | null;

    // Solo aplica si hay al menos un slot en la URL
    if (s1 || s2 || s3 || s4) {
      if (s1) setSlot(1, s1);
      if (s2) setSlot(2, s2);
      if (s3) setSlot(3, s3);
      if (s4) setSlot(4, s4);
    }
  }, []); // Solo ejecutar en mount

  return {
    generateShareUrl,
    copyShareUrl
  };
};
