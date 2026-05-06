/**
 * Gráfica de Realidad Histórica
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartColors } from '../../hooks/useChartColors';
import { useResponsiveChartHeight } from '../../hooks/useResponsiveChartHeight';
import { HISTORICO_REAL } from '../../data/historico.data';
import { PRESIDENTES } from '../../data/presidentes.data';
import { formatNumberCompact } from '../../utils/formatNumber';

export const RealChart = () => {
  const colors = useChartColors();
  const chartHeight = useResponsiveChartHeight();

  const data = HISTORICO_REAL.map((registro) => ({
    presidente: PRESIDENTES[registro.presidente].nombreCorto,
    homicidios: registro.homicidios,
    color: registro.color === 'red' ? colors.positiveBar : colors.negativeBar
  }));

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <h2 className="text-xl font-bold text-dark-text mb-4 text-center">
        Realidad Histórica
      </h2>
      <div role="img" aria-label="Gráfico de barras mostrando homicidios reales por sexenio presidencial en México desde 2000">
        <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.gridColor} />
          <XAxis
            dataKey="presidente"
            stroke={colors.textColor}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={colors.textColor}
            style={{ fontSize: '12px' }}
            label={{ value: 'Homicidios', angle: -90, position: 'insideLeft', fill: colors.textColor }}
            tickFormatter={formatNumberCompact}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: '4px',
              color: colors.tooltipText
            }}
            formatter={(value) =>
              typeof value === 'number' ? [formatNumberCompact(value), 'Homicidios'] : ['', '']
            }
          />
          <Bar dataKey="homicidios" fill={colors.positiveBar}>
            {data.map((entry) => (
              <rect key={`bar-${entry.presidente}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-dark-text-secondary text-sm">
          Valor Final: <span className="text-dark-text font-bold text-lg">
            {formatNumberCompact(HISTORICO_REAL[4].homicidios)}
          </span>
        </p>
      </div>
    </div>
  );
};
