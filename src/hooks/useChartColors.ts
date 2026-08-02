/**
 * MX Security What-If Simulator - Chart Colors Hook
 *
 * Centraliza los colores para gráficas con soporte dark/light mode
 */

import { useEffect, useState } from 'react';

export const useChartColors = () => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (isDark) {
    return {
      // Colores de barras
      positiveBar: '#B3261E', // Rojo para crecimiento
      negativeBar: '#4C7A51', // Verde para reducción

      // Colores de UI
      gridColor: '#38321F', // Grid lines
      textColor: '#A69C87', // Texto en gráficas
      axisColor: '#EDE6D8', // Ejes principales

      // Tooltips
      tooltipBg: '#221E16', // Fondo de tooltip
      tooltipBorder: '#C9A227', // Borde de tooltip
      tooltipText: '#EDE6D8', // Texto en tooltip

      // Estados
      accent: '#C9A227', // Color de acento (ocre institucional)
      neutralLine: '#A69C87', // Línea "Real": neutral, sin significado bueno/malo
      background: '#17150F', // Fondo general
      cardBg: '#221E16', // Fondo de cards
    };
  } else {
    // Light theme colors
    return {
      // Colores de barras
      positiveBar: '#A32419', // Rojo para crecimiento
      negativeBar: '#3D6642', // Verde para reducción

      // Colores de UI
      gridColor: '#DDD5C0', // Grid lines
      textColor: '#6B6152', // Texto en gráficas
      axisColor: '#241F16', // Ejes principales

      // Tooltips
      tooltipBg: '#FBF9F2', // Fondo de tooltip
      tooltipBorder: '#96751C', // Borde de tooltip
      tooltipText: '#241F16', // Texto en tooltip

      // Estados
      accent: '#96751C', // Color de acento (ocre institucional)
      neutralLine: '#6B6152', // Línea "Real": neutral, sin significado bueno/malo
      background: '#F2EEE3', // Fondo general
      cardBg: '#FBF9F2', // Fondo de cards
    };
  }
};
