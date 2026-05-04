/**
 * ShareButton - Botón para compartir la configuración actual
 */

import { useState } from 'react';
import { useShareSimulation } from '../../hooks/useShareSimulation';

export const ShareButton = () => {
  const { copyShareUrl } = useShareSimulation();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const success = await copyShareUrl();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="
        flex-1 md:flex-initial
        bg-dark-card text-dark-text px-3 md:px-4 py-2 rounded-lg
        border border-dark-border
        hover:border-accent transition-all
        focus:outline-none focus:ring-2 focus:ring-accent
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        text-sm md:text-base
      "
      aria-label="Compartir configuración actual"
      title="Copiar enlace para compartir esta configuración"
    >
      {copied ? (
        <>
          <span className="hidden md:inline">✓ Copiado</span>
          <span className="md:hidden">✓</span>
        </>
      ) : (
        <>
          <span className="hidden md:inline">🔗 Compartir</span>
          <span className="md:hidden">🔗</span>
        </>
      )}
    </button>
  );
};
