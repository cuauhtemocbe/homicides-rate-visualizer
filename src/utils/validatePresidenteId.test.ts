import { describe, it, expect } from 'vitest';
import { validatePresidenteId } from './validatePresidenteId';

describe('validatePresidenteId', () => {
  it('returns the id when it is a known PresidenteId', () => {
    expect(validatePresidenteId('amlo')).toBe('amlo');
    expect(validatePresidenteId('calderon')).toBe('calderon');
  });

  it('returns null for an unknown president id', () => {
    expect(validatePresidenteId('not-a-real-president')).toBeNull();
  });

  it('returns null for malformed or malicious input', () => {
    expect(validatePresidenteId('<script>')).toBeNull();
    expect(validatePresidenteId('%00%00')).toBeNull();
  });

  it('returns null for null or empty input', () => {
    expect(validatePresidenteId(null)).toBeNull();
    expect(validatePresidenteId('')).toBeNull();
  });
});
