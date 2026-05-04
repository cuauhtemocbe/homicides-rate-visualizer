import { create } from 'zustand';
import { RegistroMensual, RegistroSimulado, SimulacionParametros } from '../data/types';
import { HOMICIDIOS_DATA } from '../data/homicides.data';
import { SEXENIOS } from '../data/sexenios.data';
import { calcularPendienteDeRegistros } from '../lib/growth-calculator';
import { generarProyeccion } from '../lib/simulation-engine';

interface HomicideStore {
  // Datos históricos
  registrosHistoricos: RegistroMensual[];

  // Simulación
  simulacionActiva: SimulacionParametros | null;
  registrosSimulados: RegistroSimulado[];

  // Acciones
  activarSimulacion: (params: SimulacionParametros) => void;
  desactivarSimulacion: () => void;
}

export const useHomicideStore = create<HomicideStore>((set, get) => ({
  registrosHistoricos: HOMICIDIOS_DATA,
  simulacionActiva: null,
  registrosSimulados: [],

  activarSimulacion: (params) => {
    const { presidenteComportamiento, periodoObjetivo } = params;

    // Encontrar registros del presidente cuyo comportamiento queremos aplicar
    const sexenioFuente = SEXENIOS.find((s) => s.presidente === presidenteComportamiento);
    if (!sexenioFuente) return;

    const registrosFuente = get().registrosHistoricos.filter(
      (r) => r.fecha >= sexenioFuente.inicio && r.fecha <= sexenioFuente.fin
    );

    // Calcular tasa de crecimiento mensual del presidente fuente
    const tasaCrecimientoMensual = calcularPendienteDeRegistros(registrosFuente);

    // Obtener registros del periodo objetivo
    const registrosObjetivo = get().registrosHistoricos.filter(
      (r) => r.fecha >= periodoObjetivo.inicio && r.fecha <= periodoObjetivo.fin
    );

    // Generar proyección
    const proyeccion = generarProyeccion(
      registrosObjetivo,
      tasaCrecimientoMensual,
      presidenteComportamiento
    );

    set({
      simulacionActiva: params,
      registrosSimulados: proyeccion,
    });
  },

  desactivarSimulacion: () => {
    set({
      simulacionActiva: null,
      registrosSimulados: [],
    });
  },
}));
