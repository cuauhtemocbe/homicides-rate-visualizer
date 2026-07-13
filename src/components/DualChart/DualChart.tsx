/**
 * Contenedor de Visualización (Comparación Real vs What-If)
 */

import { lazy, Suspense } from 'react';

// Recharts is the largest dependency in the bundle; load it on demand
// so it's not part of the initial JS chunk.
const ComparisonChart = lazy(() =>
  import('./ComparisonChart').then((module) => ({ default: module.ComparisonChart }))
);

const ChartFallback = () => (
  <div className="bg-dark-card rounded-lg p-6 flex items-center justify-center h-[500px]">
    <p className="text-dark-text-secondary">Cargando gráfica...</p>
  </div>
);

export const DualChart = () => {
  return (
    <Suspense fallback={<ChartFallback />}>
      <ComparisonChart />
    </Suspense>
  );
};
