/**
 * Selector de Presidente para un Slot
 */

import { ORDEN_HISTORICO, PRESIDENTES } from '../../data/presidentes.data';
import type { PresidenteId } from '../../data/types';

interface Props {
  slotNumber: 0 | 1 | 2 | 3 | 4;
  currentPresident: PresidenteId;
  disabled?: boolean;
  onChange?: (presidenteId: PresidenteId) => void;
  layout?: 'vertical' | 'horizontal';
}

export const PresidentSlot = ({
  slotNumber,
  currentPresident,
  disabled,
  onChange,
  layout = 'vertical',
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange && !disabled) {
      onChange(e.target.value as PresidenteId);
    }
  };

  if (layout === 'horizontal') {
    return (
      <>
        <label htmlFor={`slot-select-${slotNumber}`} className="text-dark-text text-sm font-medium">
          Sexenio {slotNumber + 1}
          {disabled && (
            <span className="block text-xs text-dark-text-secondary italic mt-0.5">
              (Fijo - Punto de partida histórico)
            </span>
          )}
        </label>
        <select
          id={`slot-select-${slotNumber}`}
          value={currentPresident}
          onChange={handleChange}
          disabled={disabled}
          className={`
            bg-dark-card text-dark-text px-4 py-2 rounded-lg border border-dark-border
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent cursor-pointer'}
            focus:outline-none focus:ring-2 focus:ring-accent
            transition-all
          `}
          data-testid={`slot-${slotNumber}`}
          aria-label={`Seleccionar presidente para el sexenio ${slotNumber + 1} (${2000 + slotNumber * 6}-${2006 + slotNumber * 6})`}
          aria-describedby={disabled ? `slot-${slotNumber}-disabled` : undefined}
        >
          {ORDEN_HISTORICO.map((id) => (
            <option key={id} value={id}>
              {PRESIDENTES[id].nombreCorto}
            </option>
          ))}
        </select>
      </>
    );
  }

  // Vertical layout (desktop)
  return (
    <div className="flex flex-col items-center gap-2">
      <label
        htmlFor={`slot-select-${slotNumber}`}
        className="text-dark-text-secondary text-xs font-semibold"
      >
        Sexenio {slotNumber + 1}
      </label>
      <select
        id={`slot-select-${slotNumber}`}
        value={currentPresident}
        onChange={handleChange}
        disabled={disabled}
        className={`
          bg-dark-card text-dark-text px-4 py-2 rounded-lg border border-dark-border
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-accent
          transition-all
        `}
        data-testid={`slot-${slotNumber}`}
        aria-label={`Seleccionar presidente para el sexenio ${slotNumber + 1} (${2000 + slotNumber * 6}-${2006 + slotNumber * 6})`}
        aria-describedby={disabled ? `slot-${slotNumber}-disabled` : undefined}
      >
        {ORDEN_HISTORICO.map((id) => (
          <option key={id} value={id}>
            {PRESIDENTES[id].nombreCorto}
          </option>
        ))}
      </select>
      {disabled && (
        <span
          id={`slot-${slotNumber}-disabled`}
          className="text-xs text-dark-text-secondary italic"
        >
          (Fijo - Punto de partida histórico)
        </span>
      )}
    </div>
  );
};
