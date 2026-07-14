/**
 * Panel de Métricas Comparativas
 */

import { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '../../store/useSimulationStore';
import { VALOR_REAL_FINAL } from '../../data/historico.data';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const HIGHLIGHT_DURATION_MS = 600;

export const MetricsPanel = () => {
  const { resultadoSimulacion } = useSimulationStore();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHighlighting, setIsHighlighting] = useState(false);
  const hasShownResultBefore = useRef(false);

  useEffect(() => {
    if (!resultadoSimulacion) return;

    // The first time a result appears is the initial load, not a user-triggered recalculation
    if (!hasShownResultBefore.current) {
      hasShownResultBefore.current = true;
      return;
    }

    if (prefersReducedMotion) return;

    setIsHighlighting(true);
    const timeout = setTimeout(() => setIsHighlighting(false), HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [resultadoSimulacion, prefersReducedMotion]);

  if (!resultadoSimulacion) {
    return null;
  }

  const { valorFinal, diferencia, diferenciaPorcentual } = resultadoSimulacion;

  // diferencia >= 0 means MORE homicides in What-If (bad) = danger
  // diferencia < 0 means LESS homicides in What-If (good) = success
  const diferenciaColor = diferencia >= 0 ? 'text-danger' : 'text-success';
  const diferenciaIcon = diferencia >= 0 ? '↑' : '↓';

  return (
    <div
      data-testid="metrics-panel"
      className={`bg-dark-card rounded-lg p-6 ${isHighlighting ? 'animate-metrics-highlight' : ''}`}
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <h3 className="text-lg font-bold text-dark-text">
          Comparación de Resultados
        </h3>
        <InfoTooltip
          content="Compara el resultado final de tu simulación con la realidad histórica. Verde = menos homicidios (mejor), Rojo = más homicidios (peor)."
          position="bottom"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Realidad */}
        <div className="text-center">
          <p className="text-dark-text-secondary text-sm mb-2">Realidad Histórica</p>
          <p className="font-display font-bold text-dark-text text-4xl tracking-wide">
            {VALOR_REAL_FINAL.toLocaleString('es-MX')}
          </p>
          <p className="text-dark-text-secondary text-xs mt-1">homicidios</p>
        </div>

        {/* What-If */}
        <div className="text-center relative">
          <span
            data-testid="whatif-stamp"
            aria-hidden="true"
            className="
              absolute -top-3 right-2 md:right-6
              -rotate-12 select-none pointer-events-none
              text-[10px] font-bold uppercase tracking-widest text-accent
              border-2 border-accent rounded-sm px-1.5 py-0.5
            "
          >
            Hipotético
          </span>
          <p className="text-dark-text-secondary text-sm mb-2">Simulación ¿Y si?</p>
          <p className="font-display font-bold text-dark-text text-4xl tracking-wide">
            {valorFinal.toLocaleString('es-MX')}
          </p>
          <p className="text-dark-text-secondary text-xs mt-1">homicidios</p>
        </div>

        {/* Diferencia */}
        <div className="text-center">
          <p className="text-dark-text-secondary text-sm mb-2">Diferencia</p>
          <p data-testid="diferencia-value" className={`font-display font-bold text-4xl tracking-wide ${diferenciaColor}`}>
            {diferenciaIcon} {Math.abs(diferencia).toLocaleString('es-MX')}
          </p>
          <p className={`text-sm mt-1 ${diferenciaColor}`}>
            {diferencia >= 0 ? '+' : ''}{diferenciaPorcentual.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};
