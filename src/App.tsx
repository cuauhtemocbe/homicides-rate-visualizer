import { TimeSeriesChart } from './components/TimeSeriesChart';
import { SimulationPanel } from './components/SimulationPanel';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Análisis de Crecimiento de Homicidios en México
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Visualización interactiva de tasas de homicidios (2000-2026)
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TimeSeriesChart />
          </div>
          <div>
            <SimulationPanel />
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 mt-8">
          <p>
            Fuentes: SESNSP, INEGI, CONAPO | Datos por cada 100,000 habitantes
          </p>
          <p className="mt-1 text-xs italic">
            Nota: Actualmente usando datos de ejemplo. Reemplazar con datos oficiales.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
