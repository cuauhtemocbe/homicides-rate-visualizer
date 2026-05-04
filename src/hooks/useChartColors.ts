/**
 * MX Security What-If Simulator - Chart Colors Hook
 *
 * Centraliza los colores para gráficas en dark mode
 */

export const useChartColors = () => {
  return {
    // Colores de barras
    positiveBar: '#EF4444',    // Rojo para crecimiento
    negativeBar: '#10B981',    // Verde para reducción

    // Colores de UI
    gridColor: '#2A2A2A',      // Grid lines
    textColor: '#B0B0B0',      // Texto en gráficas
    axisColor: '#E0E0E0',      // Ejes principales

    // Tooltips
    tooltipBg: '#1E1E1E',      // Fondo de tooltip
    tooltipBorder: '#3B82F6',  // Borde de tooltip
    tooltipText: '#E0E0E0',    // Texto en tooltip

    // Estados
    accent: '#3B82F6',         // Color de acento
    background: '#121212',     // Fondo general
    cardBg: '#1E1E1E'          // Fondo de cards
  };
};
