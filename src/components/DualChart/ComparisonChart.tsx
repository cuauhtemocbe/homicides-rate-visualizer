/**
 * Gráfica de Comparación (Real vs What-If)
 * Muestra ambas tendencias en un solo gráfico de líneas
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartColors } from '../../hooks/useChartColors';
import { useResponsiveChartHeight } from '../../hooks/useResponsiveChartHeight';
import { useSimulationStore } from '../../store/useSimulationStore';
import { HISTORICO_REAL } from '../../data/historico.data';
import { PRESIDENTES } from '../../data/presidentes.data';
import { formatNumberCompact } from '../../utils/formatNumber';

export const ComparisonChart = () => {
  const colors = useChartColors();
  const chartHeight = useResponsiveChartHeight();
  const { resultadoSimulacion } = useSimulationStore();

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
    <div className="bg-dark-card rounded-lg p-6">
      <h2 className="text-xl font-bold text-dark-text mb-4 text-center">
        Comparación: Real vs What-If
      </h2>
      <div role="img" aria-label="Gráfico de líneas comparando la realidad histórica con el escenario What-If a través de los 5 sexenios">
        <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.gridColor} />
          <XAxis
            dataKey="sexenio"
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
            formatter={(value, name) => {
              const label = name === 'real' ? 'Realidad' : 'What-If';
              return [typeof value === 'number' ? formatNumberCompact(value) : '', label];
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px'
            }}
            formatter={(value) => value === 'real' ? 'Realidad Histórica' : 'Simulación What-If'}
          />
          <Line
            type="monotone"
            dataKey="real"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 5 }}
            activeDot={{ r: 7 }}
            name="real"
          />
          <Line
            type="monotone"
            dataKey="whatIf"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            name="whatIf"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-dark-text-secondary text-sm">
            Realidad Final: <span className="text-red-500 font-bold text-lg">
              {formatNumberCompact(HISTORICO_REAL[4].homicidios)}
            </span>
          </p>
        </div>
        <div>
          <p className="text-dark-text-secondary text-sm">
            What-If Final: <span className="text-blue-500 font-bold text-lg">
              {formatNumberCompact(resultadoSimulacion.valorFinal)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
