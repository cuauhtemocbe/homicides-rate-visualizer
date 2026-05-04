/**
 * MX Security What-If Simulator
 * Version 2.0 - Dark Mode Edition
 */

import { useEffect } from 'react';
import { useSimulationStore } from './store/useSimulationStore';
import { DualChart } from './components/DualChart/DualChart';
import { SimulationControls } from './components/SimulationControls/SimulationControls';
import { MetricsPanel } from './components/MetricsPanel/MetricsPanel';
import { DataSourceFooter } from './components/DataSourceFooter/DataSourceFooter';
import './index.css';

function App() {
  const inicializar = useSimulationStore((state) => state.inicializar);

  // Aplicar dark mode y inicializar simulación
  useEffect(() => {
    document.documentElement.classList.add('dark');
    inicializar();
  }, [inicializar]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            MX Security What-If Simulator
          </h1>
          <p className="text-dark-text-secondary">
            Analiza escenarios hipotéticos de homicidios en México (2000-2026)
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Dualidad Visual: Real vs What-If */}
          <DualChart />

          {/* Controles de Simulación */}
          <SimulationControls />

          {/* Panel de Métricas */}
          <MetricsPanel />

          {/* Footer con Fuentes */}
          <DataSourceFooter />
        </main>
      </div>
    </div>
  );
}

export default App;
