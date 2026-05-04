/**
 * Gráfica de Realidad Histórica
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartColors } from '../../hooks/useChartColors';
import { HISTORICO_REAL } from '../../data/historico.data';
import { PRESIDENTES } from '../../data/presidentes.data';

export const RealChart = () => {
  const colors = useChartColors();

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
      <ResponsiveContainer width="100%" height={400}>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: '4px',
              color: colors.tooltipText
            }}
            formatter={(value) =>
              typeof value === 'number' ? [value.toLocaleString('es-MX'), 'Homicidios'] : ['', '']
            }
          />
          <Bar dataKey="homicidios" fill={colors.positiveBar}>
            {data.map((entry, index) => (
              <rect key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-dark-text-secondary text-sm">
          Valor Final: <span className="text-dark-text font-bold text-lg">
            {HISTORICO_REAL[4].homicidios.toLocaleString('es-MX')}
          </span>
        </p>
      </div>
    </div>
  );
};
