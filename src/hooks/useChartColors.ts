/**
 * MX Security What-If Simulator - Chart Colors Hook
 *
 * Centraliza los colores para gráficas con soporte dark/light mode
 */

import { useEffect, useState } from 'react';

export const useChartColors = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (isDark) {
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
  } else {
    // Light theme colors
    return {
      // Colores de barras
      positiveBar: '#EF4444',    // Rojo para crecimiento
      negativeBar: '#10B981',    // Verde para reducción

      // Colores de UI
      gridColor: '#E5E7EB',      // Grid lines
      textColor: '#6B7280',      // Texto en gráficas
      axisColor: '#1F2937',      // Ejes principales

      // Tooltips
      tooltipBg: '#FFFFFF',      // Fondo de tooltip
      tooltipBorder: '#3B82F6',  // Borde de tooltip
      tooltipText: '#1F2937',    // Texto en tooltip

      // Estados
      accent: '#3B82F6',         // Color de acento
      background: '#F5F5F5',     // Fondo general
      cardBg: '#FFFFFF'          // Fondo de cards
    };
  }
};
