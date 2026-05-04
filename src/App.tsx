/**
 * MX Security What-If Simulator
 * Version 2.0 - Dark/Light Mode Edition
 */

import { useEffect, useState } from 'react';
import { useSimulationStore } from './store/useSimulationStore';
import { useShareSimulation } from './hooks/useShareSimulation';
import { DualChart } from './components/DualChart/DualChart';
import { SimulationControls } from './components/SimulationControls/SimulationControls';
import { MetricsPanel } from './components/MetricsPanel/MetricsPanel';
import { DataSourceFooter } from './components/DataSourceFooter/DataSourceFooter';
import { HelpModal } from './components/HelpModal/HelpModal';
import { ShareButton } from './components/ShareButton/ShareButton';
import './index.css';

function App() {
  const inicializar = useSimulationStore((state) => state.inicializar);
  const [isDark, setIsDark] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Initialize share functionality (reads URL params on mount)
  useShareSimulation();

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
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
          bg-accent text-white px-4 py-2 rounded-lg z-50
          focus:outline-none focus:ring-2 focus:ring-accent
        "
      >
        Saltar al contenido principal
      </a>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-6 md:mb-8">
          {/* Mobile: stacked buttons */}
          <div className="md:hidden flex flex-col gap-2 mb-4">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="
                  flex-1 bg-dark-card text-dark-text px-3 py-2 rounded-lg
                  border border-dark-border hover:border-accent transition-all
                  focus:outline-none focus:ring-2 focus:ring-accent
                  flex items-center justify-center gap-2 text-sm
                "
                aria-label="Abrir ayuda"
              >
                ❓ Ayuda
              </button>

              <ShareButton />

              <button
                onClick={toggleTheme}
                className="
                  flex-1 bg-dark-card text-dark-text px-3 py-2 rounded-lg
                  border border-dark-border hover:border-accent transition-all
                  focus:outline-none focus:ring-2 focus:ring-accent
                  flex items-center justify-center gap-2 text-sm
                "
                aria-label="Cambiar tema"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex justify-between items-start mb-4 flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="
                  bg-dark-card text-dark-text px-4 py-2 rounded-lg
                  border border-dark-border hover:border-accent transition-all
                  focus:outline-none focus:ring-2 focus:ring-accent
                  flex items-center gap-2
                "
                aria-label="Abrir ayuda"
              >
                ❓ Ayuda
              </button>

              <ShareButton />
            </div>

            <div className="flex-1" />

            <button
              onClick={toggleTheme}
              className="
                bg-dark-card text-dark-text px-4 py-2 rounded-lg
                border border-dark-border hover:border-accent transition-all
                focus:outline-none focus:ring-2 focus:ring-accent
                flex items-center gap-2
              "
              aria-label="Cambiar tema"
            >
              {isDark ? '☀️ Tema Claro' : '🌙 Tema Oscuro'}
            </button>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-dark-text mb-2">
            MX Security What-If Simulator
          </h1>
          <p className="text-dark-text-secondary text-sm md:text-base px-4">
            Analiza escenarios hipotéticos de homicidios en México (2000-2026)
          </p>
        </header>

        {/* Main Content */}
        <main id="main-content" className="space-y-6" role="main">
          {/* Dualidad Visual: Real vs What-If */}
          <DualChart />

          {/* Controles de Simulación */}
          <SimulationControls />

          {/* Panel de Métricas */}
          <MetricsPanel />

          {/* Footer con Fuentes */}
          <DataSourceFooter />
        </main>

        {/* Help Modal */}
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </div>
  );
}

export default App;
