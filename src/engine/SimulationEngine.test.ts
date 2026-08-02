/**
 * Tests for SimulationEngine
 */

import { describe, expect, it } from 'vitest';
import { SimulationEngine } from './SimulationEngine';

describe('SimulationEngine', () => {
  const engine = new SimulationEngine();

  describe('calculateWhatIfScenario', () => {
    it('should calculate historical scenario correctly', () => {
      const historico = engine.getConfiguracionHistorica();
      const result = engine.calculateWhatIfScenario(historico);

      // Verificar valores históricos (multiplicadores corregidos)
      expect(result.valores[0]).toBe(10452); // Fox
      expect(result.valores[1]).toBe(25963); // Calderón: 10452 * 2.484 ≈ 25,963
      expect(result.valores[2]).toBe(36685); // Peña: 25963 * 1.413 ≈ 36,685 (redondeo acumulado)
      expect(result.valores[3]).toBe(29752); // AMLO: 36685 * 0.811 ≈ 29,752
      expect(result.valores[4]).toBe(20529); // Sheinbaum: 29752 * 0.690 ≈ 20,529

      expect(result.valorFinal).toBe(20529);

      // La diferencia con el valor real proyectado (20,536) es mínima
      const diferenciaEsperada = 20529 - 20536;
      expect(result.diferencia).toBe(diferenciaEsperada);
    });

    it('should handle repeated presidents (Calderón 4 times)', () => {
      const result = engine.calculateWhatIfScenario({
        slot0: 'fox',
        slot1: 'calderon',
        slot2: 'calderon',
        slot3: 'calderon',
        slot4: 'calderon',
      });

      // Fox: 10,452
      expect(result.valores[0]).toBe(10452);

      // Calderón x1: 10,452 * 2.484 = 25,963
      expect(result.valores[1]).toBe(25963);

      // Calderón x2: 25,963 * 2.484 = 64,492
      expect(result.valores[2]).toBe(64492);

      // Calderón x3: 64,492 * 2.484 = 160,197 (redondeo acumulado)
      expect(result.valores[3]).toBe(160197);

      // Calderón x4: 160,197 * 2.484 = 397,929
      expect(result.valores[4]).toBeCloseTo(397929, -2);
    });

    it('should handle all AMLO scenario (sustained decline)', () => {
      const result = engine.calculateWhatIfScenario({
        slot0: 'fox',
        slot1: 'amlo',
        slot2: 'amlo',
        slot3: 'amlo',
        slot4: 'amlo',
      });

      // Fox: 10,452
      expect(result.valores[0]).toBe(10452);

      // AMLO x1: 10,452 * 0.811 = 8,477
      expect(result.valores[1]).toBe(8477);

      // AMLO x2: 8,477 * 0.811 = 6,874 (redondeo acumulado)
      expect(result.valores[2]).toBe(6874);

      // AMLO x3: 6,874 * 0.811 = 5,575
      expect(result.valores[3]).toBe(5575);

      // AMLO x4: 5,575 * 0.811 = 4,522
      expect(result.valores[4]).toBe(4522);

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
        slot4: 'sheinbaum',
      });

      const valorRealFinal = 20536;
      const diferenciaEsperada = result.valorFinal - valorRealFinal;
      const porcentajeEsperado = (diferenciaEsperada / valorRealFinal) * 100;

      expect(result.diferencia).toBe(diferenciaEsperada);
      expect(result.diferenciaPorcentual).toBeCloseTo(porcentajeEsperado, 2);
    });

    it('should return near-zero difference for historical configuration', () => {
      const historico = engine.getConfiguracionHistorica();
      const result = engine.calculateWhatIfScenario(historico);

      // La configuración histórica debería tener una diferencia mínima
      // (±7 por redondeo de decimales en multiplicadores)
      expect(Math.abs(result.diferencia)).toBeLessThan(20);
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
