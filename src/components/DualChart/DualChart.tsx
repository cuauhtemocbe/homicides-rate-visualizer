/**
 * Contenedor de Dualidad Visual (Real vs What-If)
 */

import { RealChart } from './RealChart';
import { WhatIfChart } from './WhatIfChart';

export const DualChart = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RealChart />
      <WhatIfChart />
    </div>
  );
};
