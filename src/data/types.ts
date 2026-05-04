export interface RegistroMensual {
  fecha: string; // ISO Format (YYYY-MM-DD)
  homicidios: number; // Homicidios absolutos
  tasa: number; // Por cada 100k habitantes
  presidente: string; // Nombre del mandatario
  esProyeccion: boolean; // True para meses futuros no publicados
  esInercia?: boolean; // True para primeros 6 meses de sexenio
  poblacion: number; // Población de México en ese mes (CONAPO)
}

export interface Sexenio {
  presidente: string;
  inicio: string; // YYYY-MM-DD
  fin: string; // YYYY-MM-DD
  homicidiosInicio: number;
  homicidiosFin: number;
  tasaInicio: number;
  tasaFin: number;
  pendienteCrecimiento: number; // % mensual promedio
}

export interface SimulacionParametros {
  periodoObjetivo: {
    inicio: string;
    fin: string;
  };
  presidenteComportamiento: string; // Cuya tasa se aplica
}

export interface RegistroSimulado extends RegistroMensual {
  tasaProyectada: number;
  presidenteSimulado: string;
}
