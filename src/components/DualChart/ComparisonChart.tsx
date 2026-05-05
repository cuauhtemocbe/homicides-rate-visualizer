/**
 * Gráfica de Comparación (Real vs What-If)
 * Muestra ambas tendencias en un solo gráfico de líneas
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartColors } from '../../hooks/useChartColors';
import { useResponsiveChartHeight } from '../../hooks/useResponsiveChartHeight';
import { useOrientation } from '../../hooks/useOrientation';
import { useSimulationStore } from '../../store/useSimulationStore';
import { HISTORICO_REAL } from '../../data/historico.data';
import { PRESIDENTES } from '../../data/presidentes.data';
import { formatNumberCompact } from '../../utils/formatNumber';
import { useState, useEffect } from 'react';

export const ComparisonChart = () => {
  const colors = useChartColors();
  const chartHeight = useResponsiveChartHeight();
  const orientation = useOrientation();
  const { resultadoSimulacion } = useSimulationStore();

  const [isMobile, setIsMobile] = useState(false);
  const [showLandscapeTip, setShowLandscapeTip] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowLandscapeTip(mobile && orientation === 'portrait');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [orientation]);

  if (!resultadoSimulacion) {
    return (
      <div className="bg-dark-card rounded-lg p-6 flex items-center justify-center h-[500px]">
        <p className="text-dark-text-secondary">Calculando simulación...</p>
      </div>
    );
  }

  // Preparar datos combinados
  const data = HISTORICO_REAL.map((registro, index) => ({
    sexenio: `Sexenio ${index + 1}`,
    real: registro.homicidios,
    whatIf: resultadoSimulacion.valores[index],
    presidente: PRESIDENTES[registro.presidente].nombreCorto
  }));

  return (
    <div className="bg-dark-card rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-bold text-dark-text mb-3 text-center">
        Comparación: Real vs ¿Y si?
      </h2>

      {/* Mensaje sugerencia landscape mode */}
      {showLandscapeTip && (
        <div className="mb-3 text-center text-xs text-dark-text-secondary bg-dark-card-hover rounded p-2 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Rota tu dispositivo para mejor visualización</span>
        </div>
      )}

      {/* Leyenda compacta inline con valores finales */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-dark-text-secondary">Real:</span>
          <span className="font-bold text-red-500">
            {formatNumberCompact(HISTORICO_REAL[4].homicidios)}
          </span>
        </div>
        <div className="text-dark-text-secondary">•</div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-dark-text-secondary">¿Y si?:</span>
          <span className="font-bold text-blue-500">
            {formatNumberCompact(resultadoSimulacion.valorFinal)}
          </span>
        </div>
      </div>

      <div role="img" aria-label="Gráfico de líneas comparando la realidad histórica con el escenario ¿Y si? a través de los 5 sexenios">
        <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.gridColor} />
          <XAxis
            dataKey="sexenio"
            stroke={colors.textColor}
            style={{ fontSize: isMobile ? '10px' : '12px' }}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 60 : 30}
          />
          <YAxis
            stroke={colors.textColor}
            style={{ fontSize: isMobile ? '10px' : '12px' }}
            label={{ value: 'Homicidios', angle: -90, position: 'insideLeft', fill: colors.textColor, style: { fontSize: isMobile ? '10px' : '12px' } }}
            tickFormatter={formatNumberCompact}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: '4px',
              color: colors.tooltipText,
              maxWidth: isMobile ? '140px' : '200px',
              fontSize: isMobile ? '11px' : '14px',
              padding: isMobile ? '6px 8px' : '8px 12px'
            }}
            formatter={(value, name) => {
              const label = name === 'real' ? 'Real' : '¿Y si?';
              return [typeof value === 'number' ? formatNumberCompact(value) : '', label];
            }}
            offset={10}
            allowEscapeViewBox={{ x: false, y: false }}
            position={{ y: 0 }}
          />
          <Line
            type="monotone"
            dataKey="real"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: isMobile ? 4 : 5 }}
            activeDot={{ r: isMobile ? 6 : 7 }}
            name="real"
          />
          <Line
            type="monotone"
            dataKey="whatIf"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: isMobile ? 4 : 5 }}
            activeDot={{ r: isMobile ? 6 : 7 }}
            name="whatIf"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};
