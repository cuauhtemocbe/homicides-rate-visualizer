/**
 * Panel de Métricas Comparativas
 */

import { useSimulationStore } from '../../store/useSimulationStore';
import { VALOR_REAL_FINAL } from '../../data/historico.data';
import { InfoTooltip } from '../InfoTooltip/InfoTooltip';

export const MetricsPanel = () => {
  const { resultadoSimulacion } = useSimulationStore();

  if (!resultadoSimulacion) {
    return null;
  }

  const { valorFinal, diferencia, diferenciaPorcentual } = resultadoSimulacion;

  // diferencia >= 0 means MORE homicides in What-If (bad) = danger
  // diferencia < 0 means LESS homicides in What-If (good) = success
  const diferenciaColor = diferencia >= 0 ? 'text-danger' : 'text-success';
  const diferenciaIcon = diferencia >= 0 ? '↑' : '↓';

  return (
    <div className="bg-dark-card rounded-lg p-6">
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
          <p className="text-dark-text font-bold text-3xl">
            {VALOR_REAL_FINAL.toLocaleString('es-MX')}
          </p>
          <p className="text-dark-text-secondary text-xs mt-1">homicidios</p>
        </div>

        {/* What-If */}
        <div className="text-center">
          <p className="text-dark-text-secondary text-sm mb-2">Simulación What-If</p>
          <p className="text-dark-text font-bold text-3xl">
            {valorFinal.toLocaleString('es-MX')}
          </p>
          <p className="text-dark-text-secondary text-xs mt-1">homicidios</p>
        </div>

        {/* Diferencia */}
        <div className="text-center">
          <p className="text-dark-text-secondary text-sm mb-2">Diferencia</p>
          <p className={`font-bold text-3xl ${diferenciaColor}`}>
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
