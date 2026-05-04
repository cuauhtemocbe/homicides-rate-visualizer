/**
 * Contenedor de Dualidad Visual (Real vs What-If + Comparación)
 */

import { RealChart } from './RealChart';
import { WhatIfChart } from './WhatIfChart';
import { ComparisonChart } from './ComparisonChart';

export const DualChart = () => {
  return (
    <div className="space-y-6">
      {/* Gráficos de barras lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RealChart />
        <WhatIfChart />
      </div>

      {/* Gráfico de comparación (líneas) */}
      <ComparisonChart />
    </div>
  );
};
