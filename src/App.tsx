/**
 * MX Security What-If Simulator
 * Version 2.0 - Dark/Light Mode Edition
 */

import { useEffect, useState } from 'react';
import { useSimulationStore } from './store/useSimulationStore';
import { DualChart } from './components/DualChart/DualChart';
import { SimulationControls } from './components/SimulationControls/SimulationControls';
import { MetricsPanel } from './components/MetricsPanel/MetricsPanel';
import { DataSourceFooter } from './components/DataSourceFooter/DataSourceFooter';
import './index.css';

function App() {
  const inicializar = useSimulationStore((state) => state.inicializar);
  const [isDark, setIsDark] = useState(true);

  // Aplicar tema y inicializar simulación
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    inicializar();
  }, [inicializar]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            MX Security What-If Simulator
          </h1>
          <p className="text-dark-text-secondary">
            Analiza escenarios hipotéticos de homicidios en México (2000-2026)
          </p>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="
              absolute top-0 right-0
              bg-dark-card text-dark-text px-4 py-2 rounded-lg
              border border-dark-border
              hover:border-accent transition-all
              focus:outline-none focus:ring-2 focus:ring-accent
              flex items-center gap-2
            "
            aria-label="Toggle theme"
          >
            {isDark ? '☀️ Tema Claro' : '🌙 Tema Oscuro'}
          </button>
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
