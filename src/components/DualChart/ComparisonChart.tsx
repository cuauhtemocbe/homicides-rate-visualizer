/**
 * Gráfica de Comparación (Real vs What-If)
 * Muestra ambas tendencias en un solo gráfico de líneas
 */

import { useEffect, useState } from 'react';
import type { ActiveDotProps, DotItemDotProps } from 'recharts';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { HISTORICO_REAL } from '../../data/historico.data';
import { PRESIDENTES } from '../../data/presidentes.data';
import { useChartColors } from '../../hooks/useChartColors';
import { useOrientation } from '../../hooks/useOrientation';
import { useResponsiveChartHeight } from '../../hooks/useResponsiveChartHeight';
import { useSimulationStore } from '../../store/useSimulationStore';
import { formatNumberCompact } from '../../utils/formatNumber';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';

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

  // "¿Y si?" line uses a square marker so it stays distinguishable from
  // "Real" (circle) by shape alone, without relying on color (#22)
  const renderWhatIfDot = ({ cx, cy }: DotItemDotProps) => {
    if (cx == null || cy == null) return null;
    const size = isMobile ? 4 : 5;
    return (
      <rect
        key={`whatif-dot-${cx}-${cy}`}
        data-testid="whatif-marker"
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        fill={colors.accent}
      />
    );
  };

  const renderWhatIfActiveDot = ({ cx, cy }: ActiveDotProps) => {
    if (cx == null || cy == null) return null;
    const size = isMobile ? 6 : 7;
    return (
      <rect
        key={`whatif-active-dot-${cx}-${cy}`}
        data-testid="whatif-marker"
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        fill={colors.accent}
      />
    );
  };

  if (!resultadoSimulacion) {
    return (
      <div className="bg-dark-card rounded-lg p-6 flex items-center justify-center h-[500px]">
        <LoadingIndicator label="Calculando simulación..." />
      </div>
    );
  }

  // Preparar datos combinados
  const data = HISTORICO_REAL.map((registro, index) => ({
    sexenio: `Sexenio ${index + 1}`,
    real: registro.homicidios,
    whatIf: resultadoSimulacion.valores[index],
    presidente: PRESIDENTES[registro.presidente].nombreCorto,
  }));

  return (
    <div className="bg-dark-card rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-bold text-dark-text mb-3 text-center">
        Comparación: Real vs ¿Y si?
      </h2>

      {/* Mensaje sugerencia landscape mode */}
      {showLandscapeTip && (
        <div className="mb-3 text-center text-xs text-dark-text-secondary bg-dark-card-hover rounded p-2 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span>Rota tu dispositivo para mejor visualización</span>
        </div>
      )}

      {/* Leyenda compacta inline con valores finales */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-1.5">
          <div
            data-testid="legend-swatch-real"
            data-dashed="false"
            data-shape="circle"
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: colors.neutralLine }}
          ></div>
          <span className="text-dark-text-secondary">Real:</span>
          <span className="font-bold" style={{ color: colors.neutralLine }}>
            {formatNumberCompact(HISTORICO_REAL[4].homicidios)}
          </span>
        </div>
        <div className="text-dark-text-secondary">•</div>
        <div className="flex items-center gap-1.5">
          <div
            data-testid="legend-swatch-whatif"
            data-dashed="false"
            data-shape="square"
            className="w-2.5 h-2.5"
            style={{ backgroundColor: colors.accent }}
          ></div>
          <span className="text-dark-text-secondary">¿Y si?:</span>
          <span className="font-bold" style={{ color: colors.accent }}>
            {formatNumberCompact(resultadoSimulacion.valorFinal)}
          </span>
        </div>
      </div>

      <div
        role="img"
        aria-label="Gráfico de líneas comparando la realidad histórica con el escenario ¿Y si? a través de los 5 sexenios"
      >
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
              label={{
                value: 'Homicidios',
                angle: -90,
                position: 'insideLeft',
                fill: colors.textColor,
                style: { fontSize: isMobile ? '10px' : '12px' },
              }}
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
                padding: isMobile ? '6px 8px' : '8px 12px',
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
              stroke={colors.neutralLine}
              strokeWidth={2}
              isAnimationActive={false}
              dot={{ fill: colors.neutralLine, r: isMobile ? 4 : 5 }}
              activeDot={{ r: isMobile ? 6 : 7 }}
              name="real"
            />
            <Line
              type="monotone"
              dataKey="whatIf"
              stroke={colors.accent}
              strokeWidth={2}
              isAnimationActive={false}
              dot={renderWhatIfDot}
              activeDot={renderWhatIfActiveDot}
              name="whatIf"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
