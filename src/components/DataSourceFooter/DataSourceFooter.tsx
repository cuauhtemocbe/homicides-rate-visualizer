/**
 * Footer con Disclaimer de Fuentes
 */

export const DataSourceFooter = () => {
  return (
    <footer className="bg-dark-card rounded-lg p-6 mt-6">
      <div className="text-center">
        <h4 className="text-dark-text font-semibold mb-3">Fuentes de Datos Oficiales</h4>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-dark-text-secondary mb-4">
          <a
            href="https://www.inegi.org.mx/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            INEGI
          </a>
          <a
            href="https://www.gob.mx/sesnsp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            SESNSP
          </a>
          <a
            href="https://data.worldbank.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            World Bank
          </a>
        </div>

        <div className="border-t border-dark-border pt-4">
          <p className="text-xs text-dark-text-secondary max-w-3xl mx-auto">
            <strong className="text-accent">Nota sobre Proyecciones:</strong> Los datos de la administración de
            Claudia Sheinbaum (2024-2030) están <strong>proyectados</strong> con base en la tendencia de reducción
            del -31% observada hasta mayo de 2026. Estos valores deben considerarse estimaciones sujetas a cambios
            conforme se publiquen datos oficiales adicionales.
          </p>
        </div>

        <div className="mt-4 text-xs text-dark-text-secondary">
          <p>MX Security What-If Simulator v2.0 | Dark Mode</p>
        </div>
      </div>
    </footer>
  );
};
