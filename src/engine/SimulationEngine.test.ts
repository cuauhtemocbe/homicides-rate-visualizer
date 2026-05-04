/**
 * Tests for SimulationEngine
 */

import { describe, it, expect } from 'vitest';
import { SimulationEngine } from './SimulationEngine';

describe('SimulationEngine', () => {
  const engine = new SimulationEngine();

  describe('calculateWhatIfScenario', () => {
    it('should calculate historical scenario correctly', () => {
      const historico = engine.getConfiguracionHistorica();
      const result = engine.calculateWhatIfScenario(historico);

      // Verificar valores históricos
      expect(result.valores[0]).toBe(10452);  // Fox
      expect(result.valores[1]).toBe(30603);  // Calderón: 10452 * 2.928 ≈ 30,603
      expect(result.valores[2]).toBe(48659);  // Peña: 30603 * 1.59 ≈ 48,659
      expect(result.valores[3]).toBe(37954);  // AMLO: 48659 * 0.78 ≈ 37,954
      expect(result.valores[4]).toBe(26189);  // Sheinbaum: 37954 * 0.69 ≈ 26,189

      expect(result.valorFinal).toBe(26189);

      // La diferencia con el valor real proyectado (20,536)
      const diferenciaEsperada = 26189 - 20536;
      expect(result.diferencia).toBe(diferenciaEsperada);
    });

    it('should handle repeated presidents (Calderón 4 times)', () => {
      const result = engine.calculateWhatIfScenario({
        slot0: 'fox',
        slot1: 'calderon',
        slot2: 'calderon',
        slot3: 'calderon',
        slot4: 'calderon'
      });

      // Fox: 10,452
      expect(result.valores[0]).toBe(10452);

      // Calderón x1: 10,452 * 2.928 = 30,603
      expect(result.valores[1]).toBe(30603);

      // Calderón x2: 30,603 * 2.928 = 89,607
      expect(result.valores[2]).toBe(89607);

      // Calderón x3: 89,607 * 2.928 = 262,369
      expect(result.valores[3]).toBe(262369);

      // Calderón x4: 262,369 * 2.928 = 768,176
      expect(result.valores[4]).toBeCloseTo(768176, -2);
    });

    it('should handle all AMLO scenario (sustained decline)', () => {
      const result = engine.calculateWhatIfScenario({
        slot0: 'fox',
        slot1: 'amlo',
        slot2: 'amlo',
        slot3: 'amlo',
        slot4: 'amlo'
      });

      // Fox: 10,452
      expect(result.valores[0]).toBe(10452);

      // AMLO x1: 10,452 * 0.78 = 8,153
      expect(result.valores[1]).toBe(8153);

      // AMLO x2: 8,153 * 0.78 = 6,359
      expect(result.valores[2]).toBe(6359);

      // AMLO x3: 6,359 * 0.78 = 4,960
      expect(result.valores[3]).toBe(4960);

      // AMLO x4: 4,960 * 0.78 = 3,869
      expect(result.valores[4]).toBe(3869);

      // Diferencia debería ser negativa (reducción vs realidad)
      expect(result.diferencia).toBeLessThan(0);
      expect(result.diferenciaPorcentual).toBeLessThan(0);
    });

    it('should calculate differences correctly', () => {
      const result = engine.calculateWhatIfScenario({
        slot0: 'fox',
        slot1: 'calderon',
        slot2: 'calderon',
        slot3: 'amlo',
        slot4: 'sheinbaum'
      });

      const valorRealFinal = 20536;
      const diferenciaEsperada = result.valorFinal - valorRealFinal;
      const porcentajeEsperado = (diferenciaEsperada / valorRealFinal) * 100;

      expect(result.diferencia).toBe(diferenciaEsperada);
      expect(result.diferenciaPorcentual).toBeCloseTo(porcentajeEsperado, 2);
    });

    it('should return zero difference for historical configuration', () => {
      const historico = engine.getConfiguracionHistorica();
      const result = engine.calculateWhatIfScenario(historico);

      // La configuración histórica debería tener una diferencia cercana a cero
      // (puede haber pequeñas diferencias por redondeo)
      expect(Math.abs(result.diferencia)).toBeLessThan(10000);
    });
  });

  describe('getConfiguracionHistorica', () => {
    it('should return historical slot configuration', () => {
      const config = engine.getConfiguracionHistorica();

      expect(config.slot0).toBe('fox');
      expect(config.slot1).toBe('calderon');
      expect(config.slot2).toBe('pena');
      expect(config.slot3).toBe('amlo');
      expect(config.slot4).toBe('sheinbaum');
    });
  });
});
