/**
 * Selector de Presidente para un Slot
 */

import { PRESIDENTES, ORDEN_HISTORICO } from '../../data/presidentes.data';
import type { PresidenteId } from '../../data/types';

interface Props {
  slotNumber: 0 | 1 | 2 | 3 | 4;
  currentPresident: PresidenteId;
  disabled?: boolean;
  onChange?: (presidenteId: PresidenteId) => void;
}

export const PresidentSlot = ({ slotNumber, currentPresident, disabled, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange && !disabled) {
      onChange(e.target.value as PresidenteId);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-dark-text-secondary text-xs font-semibold">
        Slot {slotNumber}
      </label>
      <select
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
      >
        {ORDEN_HISTORICO.map((id) => (
          <option key={id} value={id}>
            {PRESIDENTES[id].nombreCorto}
          </option>
        ))}
      </select>
      {disabled && (
        <span className="text-xs text-dark-text-secondary italic">(Fijo)</span>
      )}
    </div>
  );
};
