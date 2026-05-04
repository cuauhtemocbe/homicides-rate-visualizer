import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { useHomicideStore } from '../store/use-homicide-store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function TimeSeriesChart() {
  const { registrosHistoricos, registrosSimulados, simulacionActiva } = useHomicideStore();

  // Combinar datos reales y simulados para el chart
  const chartData = registrosHistoricos.map((real) => {
    const simulado = registrosSimulados.find((s) => s.fecha === real.fecha);

    return {
      fecha: real.fecha,
      fechaFormateada: format(new Date(real.fecha), 'MMM yyyy', { locale: es }),
      tasaReal: real.tasa,
      tasaProyectada: simulado?.tasaProyectada,
      presidente: real.presidente,
      homicidios: real.homicidios,
      esInercia: real.esInercia,
      esProyeccion: real.esProyeccion,
    };
  });

  // Identificar áreas de inercia para ReferenceArea
  const areasInercia: Array<{ inicio: string; fin: string }> = [];
  let inicioInercia: string | null = null;

  chartData.forEach((punto, index) => {
    if (punto.esInercia && !inicioInercia) {
      inicioInercia = punto.fecha;
    } else if (!punto.esInercia && inicioInercia) {
      areasInercia.push({ inicio: inicioInercia, fin: chartData[index - 1].fecha });
      inicioInercia = null;
    }
  });

  return (
    <div className="w-full h-[500px] bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">
        Tasa de Homicidios en México (2000-2026)
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="fechaFormateada"
            interval="preserveStartEnd"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ value: 'Tasa por 100k habitantes', angle: -90, position: 'insideLeft' }}
            domain={[0, 'auto']}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;

              const data = payload[0].payload;

              return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg text-sm">
                  <p className="font-bold">{data.fechaFormateada}</p>
                  <p className="text-gray-700">Presidente: {data.presidente}</p>
                  <p className="text-blue-600">Tasa Real: {data.tasaReal.toFixed(2)} por 100k</p>
                  {data.tasaProyectada && (
                    <p className="text-orange-600">
                      Proyección: {data.tasaProyectada.toFixed(2)} por 100k
                    </p>
                  )}
                  <p className="text-gray-500 text-xs">Homicidios: {data.homicidios}</p>
                  {data.esInercia && <p className="text-red-500 text-xs italic">Periodo de inercia</p>}
                </div>
              );
            }}
          />
          <Legend />

          {/* Áreas de inercia */}
          {areasInercia.map((area, index) => (
            <ReferenceArea
              key={index}
              x1={area.inicio}
              x2={area.fin}
              fill="#ffcccc"
              fillOpacity={0.3}
            />
          ))}

          {/* Línea principal (datos reales) */}
          <Line
            type="monotone"
            dataKey="tasaReal"
            stroke="#2563eb"
            strokeWidth={2}
            name="Tasa Real"
            dot={false}
          />

          {/* Línea de proyección (simulación) */}
          {simulacionActiva && (
            <Line
              type="monotone"
              dataKey="tasaProyectada"
              stroke="#ea580c"
              strokeWidth={2}
              strokeDasharray="5 5"
              name={`Proyección (${simulacionActiva.presidenteComportamiento})`}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
