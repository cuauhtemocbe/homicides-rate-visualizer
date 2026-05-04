/**
 * Hook para altura responsive de gráficos
 */

import { useState, useEffect } from 'react';

export const useResponsiveChartHeight = () => {
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // mobile
        setHeight(300);
      } else if (width < 1024) {
        // tablet
        setHeight(350);
      } else {
        // desktop
        setHeight(400);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return height;
};
