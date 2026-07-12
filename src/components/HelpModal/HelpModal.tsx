/**
 * HelpModal - Onboarding and help documentation
 */

import { useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** True when the modal opens automatically on the visitor's first visit */
  isWelcome?: boolean;
}

export const HelpModal = ({ isOpen, onClose, isWelcome = false }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Handle dialog open/close with native dialog element
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClose={onClose}
      aria-labelledby="help-modal-title"
      style={{
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        width: '100%',
        height: '100%',
        border: 'none',
        background: 'transparent',
      }}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute inset-0 cursor-default"
          aria-label="Cerrar modal"
          tabIndex={-1}
        />
        <div
          className="
            relative z-10 animate-modal-in
            bg-dark-card rounded-lg shadow-2xl
            max-w-2xl w-full
            max-h-[90vh] overflow-y-auto
            border border-dark-border
          "
        >
        {/* Header */}
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4 flex justify-between items-center gap-4">
          <div>
            <h2 id="help-modal-title" className="text-2xl font-bold text-dark-text">
              {isWelcome ? '👋 Bienvenido al simulador ¿Y si?' : '❓ Guía del Simulador'}
            </h2>
            {isWelcome && (
              <p className="text-dark-text-secondary text-sm mt-1">
                Cada sexenio que elijas se acumula sobre el anterior, como una cascada. Así funciona:
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="
              flex-shrink-0
              text-dark-text-secondary hover:text-dark-text
              text-2xl leading-none
              focus:outline-none focus:ring-2 focus:ring-accent rounded
              px-2
            "
            aria-label="Cerrar ayuda"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 text-dark-text">
          <section>
            <h3 className="text-lg font-bold mb-2 text-accent">🎯 ¿Qué hace este simulador?</h3>
            <p className="text-dark-text-secondary">
              Te permite responder preguntas "¿Y si?" sobre homicidios en México (2000-2026).
              Por ejemplo: <em>¿Qué habría pasado si AMLO hubiera gobernado en lugar de Calderón?</em>
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2 text-accent">🎰 Sistema de Slots</h3>
            <p className="text-dark-text-secondary mb-2">
              Los <strong>5 slots</strong> representan los 5 sexenios presidenciales desde 2000:
            </p>
            <ul className="list-disc list-inside text-dark-text-secondary space-y-1 ml-4">
              <li><strong>Slot 1 (Fijo):</strong> V. Fox (2000-2006) - Punto de partida histórico</li>
              <li><strong>Slots 2-5:</strong> Selecciona qué presidente gobernaría en ese período</li>
            </ul>
            <p className="text-dark-text-secondary mt-2">
              El simulador aplica la <strong>tasa de crecimiento real</strong> de cada presidente al valor acumulado.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2 text-accent">🧮 Algoritmo de Cascada</h3>
            <p className="text-dark-text-secondary mb-2">
              Cada slot multiplica el valor anterior por la tasa de crecimiento del presidente seleccionado:
            </p>
            <div className="bg-dark-bg rounded p-4 text-sm font-mono">
              <p>Valor<sub>slot</sub> = Valor<sub>anterior</sub> × (1 + Tasa de Crecimiento)</p>
            </div>
            <p className="text-dark-text-secondary mt-2 text-sm">
              <strong>Ejemplo:</strong> Si Fox termina con 10,452 homicidios y seleccionas AMLO (TC: -22%),
              el resultado sería: 10,452 × 0.78 = 8,152 homicidios.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2 text-accent">📊 Cómo interpretar los gráficos</h3>
            <ul className="list-disc list-inside text-dark-text-secondary space-y-2 ml-4">
              <li>
                <strong className="text-danger">Rojo:</strong> Períodos con aumento de homicidios (crecimiento)
              </li>
              <li>
                <strong className="text-success">Verde:</strong> Períodos con reducción de homicidios (mejora)
              </li>
              <li>
                <strong>Realidad Histórica:</strong> Muestra lo que realmente sucedió
              </li>
              <li>
                <strong>Simulación ¿Y si?:</strong> Muestra tu escenario alternativo
              </li>
              <li>
                <strong>Comparación:</strong> Líneas que contrastan ambos escenarios
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2 text-accent">💡 Tips de uso</h3>
            <ul className="list-disc list-inside text-dark-text-secondary space-y-1 ml-4">
              <li>Usa el botón <strong>⟲ Resetear</strong> para volver al escenario histórico</li>
              <li>Pasa el mouse sobre las barras/líneas para ver valores exactos</li>
              <li>Prueba escenarios extremos: ¿5 sexenios del mismo presidente?</li>
              <li>Compara diferencias porcentuales en el panel de métricas</li>
            </ul>
          </section>

          <section className="border-t border-dark-border pt-4">
            <p className="text-xs text-dark-text-secondary">
              <strong>Fuentes:</strong> INEGI, SESNSP, World Bank | <strong>Proyección 2024-2026:</strong> Basada en tendencia observada (-31%)
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-card border-t border-dark-border px-6 py-4">
          <button
            onClick={onClose}
            className="
              w-full bg-accent text-white px-6 py-3 rounded-lg
              hover:bg-blue-600 transition-colors
              focus:outline-none focus:ring-2 focus:ring-accent
              font-semibold
            "
          >
            Entendido, empezar a simular
          </button>
        </div>
      </div>
      </div>
    </dialog>
  );
};
