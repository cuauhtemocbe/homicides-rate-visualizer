import { useState } from 'react';
import { useHomicideStore } from '../store/use-homicide-store';
import { SEXENIOS } from '../data/sexenios.data';

export function SimulationPanel() {
  const { simulacionActiva, activarSimulacion, desactivarSimulacion } = useHomicideStore();

  const [periodoInicio, setPeriodoInicio] = useState('2018-12-01');
  const [periodoFin, setPeriodoFin] = useState('2024-09-30');
  const [presidenteSeleccionado, setPresidenteSeleccionado] = useState('Felipe Calderón');

  const handleActivarSimulacion = () => {
    activarSimulacion({
      periodoObjetivo: {
        inicio: periodoInicio,
        fin: periodoFin,
      },
      presidenteComportamiento: presidenteSeleccionado,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Motor de Simulación</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Periodo Objetivo</label>
          <div className="flex gap-2">
            <select
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            >
              {SEXENIOS.map((s) => (
                <option key={s.inicio} value={s.inicio}>
                  {s.presidente} - Inicio ({s.inicio})
                </option>
              ))}
            </select>
            <select
              value={periodoFin}
              onChange={(e) => setPeriodoFin(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            >
              {SEXENIOS.map((s) => (
                <option key={s.fin} value={s.fin}>
                  {s.presidente} - Fin ({s.fin})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Aplicar Comportamiento de:
          </label>
          <select
            value={presidenteSeleccionado}
            onChange={(e) => setPresidenteSeleccionado(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {SEXENIOS.map((s) => (
              <option key={s.presidente} value={s.presidente}>
                {s.presidente}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleActivarSimulacion}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simular
          </button>
          {simulacionActiva && (
            <button
              onClick={desactivarSimulacion}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>

        {simulacionActiva && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm">
              <strong>Simulación activa:</strong> Aplicando tasa de crecimiento de{' '}
              <strong>{simulacionActiva.presidenteComportamiento}</strong> al periodo{' '}
              {periodoInicio} - {periodoFin}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
