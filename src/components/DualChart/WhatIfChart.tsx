/**
 * Gráfica de Simulación What-If
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useChartColors } from '../../hooks/useChartColors';
import { useSimulationStore } from '../../store/useSimulationStore';
import { PRESIDENTES } from '../../data/presidentes.data';

export const WhatIfChart = () => {
  const colors = useChartColors();
  const { resultadoSimulacion, slotsActuales } = useSimulationStore();

  if (!resultadoSimulacion) {
    return (
      <div className="bg-dark-card rounded-lg p-6 flex items-center justify-center h-[500px]">
        <p className="text-dark-text-secondary">Calculando simulación...</p>
      </div>
    );
  }

  const slotIds = [
    slotsActuales.slot0,
    slotsActuales.slot1,
    slotsActuales.slot2,
    slotsActuales.slot3,
    slotsActuales.slot4
  ];

  const data = resultadoSimulacion.valores.map((valor, index) => {
    const presidenteId = slotIds[index];
    const presidente = PRESIDENTES[presidenteId];
    const color = presidente.tasaCrecimiento >= 0 ? colors.positiveBar : colors.negativeBar;

    return {
      presidente: presidente.nombreCorto,
      homicidios: valor,
      color
    };
  });

  return (
    <div className="bg-dark-card rounded-lg p-6">
      <h2 className="text-xl font-bold text-dark-text mb-4 text-center">
        Simulación What-If
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
          <Bar dataKey="homicidios">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <p className="text-dark-text-secondary text-sm">
          Valor Final: <span className="text-dark-text font-bold text-lg">
            {resultadoSimulacion.valorFinal.toLocaleString('es-MX')}
          </span>
        </p>
      </div>
    </div>
  );
};
