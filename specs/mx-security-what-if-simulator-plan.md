---
title: MX Security What-If Simulator - Implementation Plan
status: draft
created: 2026-05-04
updated: 2026-05-04
spec: mx-security-what-if-simulator.md
---

# MX Security What-If Simulator - Implementation Plan

## Overview

Este plan detalla la implementación del **MX Security What-If Simulator v2.0**, una refactorización significativa del proyecto original que introduce:
- **Dualidad Visual**: Dos gráficas lado a lado (Real vs What-If)
- **Dark Mode**: Identidad visual oscura (#121212, #1E1E1E)
- **Sistema de Slots**: 4 slots configurables después de Fox
- **Cascada Acumulativa**: Nuevo motor de simulación

## Implementation Phases

### Phase 1: Data Layer Refactoring (2-3 horas)

**Objetivo**: Migrar de tasas mensuales a valores de cierre por administración

#### Tasks

1. **Crear `presidentes.data.ts`** ⏳
   ```typescript
   export const PRESIDENTES: Record<string, Presidente> = {
     fox: {
       id: 'fox',
       nombre: 'Vicente Fox Quesada',
       nombreCorto: 'Fox',
       tasaCrecimiento: 0.016,      // 1.6%
       multiplicador: 1.016,
       cierreOficial: 10452,
       periodo: '2000-2006',
       esProyeccion: false
     },
     calderon: {
       id: 'calderon',
       nombre: 'Felipe Calderón Hinojosa',
       nombreCorto: 'Calderón',
       tasaCrecimiento: 1.928,      // 192.8%
       multiplicador: 2.928,
       cierreOficial: 25967,
       periodo: '2006-2012',
       esProyeccion: false
     },
     pena: {
       id: 'pena',
       nombre: 'Enrique Peña Nieto',
       nombreCorto: 'Peña Nieto',
       tasaCrecimiento: 0.590,      // 59.0%
       multiplicador: 1.59,
       cierreOficial: 36685,
       periodo: '2012-2018',
       esProyeccion: false
     },
     amlo: {
       id: 'amlo',
       nombre: 'Andrés Manuel López Obrador',
       nombreCorto: 'AMLO',
       tasaCrecimiento: -0.220,     // -22.0%
       multiplicador: 0.78,
       cierreOficial: 29741,        // Dato 2023
       periodo: '2018-2024',
       esProyeccion: false
     },
     sheinbaum: {
       id: 'sheinbaum',
       nombre: 'Claudia Sheinbaum Pardo',
       nombreCorto: 'Sheinbaum',
       tasaCrecimiento: -0.310,     // -31.0%
       multiplicador: 0.69,
       cierreOficial: 20536,        // Proyectado
       periodo: '2024-2030',
       esProyeccion: true
     }
   };
   ```

2. **Crear `historico.data.ts`** ⏳
   ```typescript
   export const HISTORICO_REAL: RegistroHistorico[] = [
     {
       presidente: 'fox',
       homicidios: 10452,
       tasaCrecimiento: 1.6,
       multiplicador: 1.016,
       color: 'red'
     },
     {
       presidente: 'calderon',
       homicidios: 25967,
       tasaCrecimiento: 192.8,
       multiplicador: 2.928,
       color: 'red'
     },
     {
       presidente: 'pena',
       homicidios: 36685,
       tasaCrecimiento: 59.0,
       multiplicador: 1.59,
       color: 'red'
     },
     {
       presidente: 'amlo',
       homicidios: 29741,
       tasaCrecimiento: -22.0,
       multiplicador: 0.78,
       color: 'green'
     },
     {
       presidente: 'sheinbaum',
       homicidios: 20536,
       tasaCrecimiento: -31.0,
       multiplicador: 0.69,
       color: 'green'
     }
   ];
   ```

3. **Actualizar `types.ts`** ⏳
   - Remover: `RegistroMensual`, tipos relacionados a tasas por 100k
   - Agregar: `Presidente`, `RegistroHistorico`, `SimulacionSlots`, `ResultadoSimulacion`

4. **Tests de Data Layer** ⏳
   ```typescript
   describe('presidentes.data', () => {
     it('should have correct multiplicadores', () => {
       Object.values(PRESIDENTES).forEach(p => {
         const expected = 1 + p.tasaCrecimiento;
         expect(p.multiplicador).toBeCloseTo(expected, 3);
       });
     });
   });
   ```

**Acceptance Criteria**:
- ✅ Todos los presidentes tienen datos completos
- ✅ Multiplicadores = 1 + (TC/100) verificados
- ✅ Tests de data layer pasan al 100%
- ✅ Sheinbaum marcado como `esProyeccion: true`

---

### Phase 2: Simulation Engine (3-4 horas)

**Objetivo**: Implementar motor de cascada acumulativa

#### Tasks

1. **Crear `SimulationEngine.ts`** ⏳
   ```typescript
   export class SimulationEngine {
     private readonly presidentes: Record<string, Presidente>;
     
     constructor() {
       this.presidentes = PRESIDENTES;
     }
     
     calculateWhatIfScenario(slots: SimulacionSlots): ResultadoSimulacion {
       const valores: number[] = [];
       let valorActual = this.presidentes.fox.cierreOficial;
       
       valores.push(valorActual);
       
       const slotIds = [slots.slot1, slots.slot2, slots.slot3, slots.slot4];
       
       for (const presidenteId of slotIds) {
         const presidente = this.presidentes[presidenteId];
         valorActual = valorActual * presidente.multiplicador;
         valores.push(Math.round(valorActual));
       }
       
       return {
         slots,
         valores,
         valorFinal: valores[valores.length - 1],
         diferencia: this.calcularDiferencia(valores[valores.length - 1]),
         diferenciaPorcentual: this.calcularDiferenciaPorcentual(valores[valores.length - 1])
       };
     }
     
     private calcularDiferencia(valorSimulado: number): number {
       const valorReal = 20536; // Sheinbaum proyectado
       return valorSimulado - valorReal;
     }
     
     private calcularDiferenciaPorcentual(valorSimulado: number): number {
       const valorReal = 20536;
       return ((valorSimulado - valorReal) / valorReal) * 100;
     }
     
     getConfiguracionHistorica(): SimulacionSlots {
       return {
         slot0: 'fox',
         slot1: 'calderon',
         slot2: 'pena',
         slot3: 'amlo',
         slot4: 'sheinbaum'
       };
     }
   }
   ```

2. **Crear `SimulationEngine.test.ts`** ⏳
   - Test: Cascada histórica reproduce valores reales
   - Test: Repetir presidentes (ej: 4x Calderón)
   - Test: Todos slots con AMLO (decrecimiento sostenido)
   - Test: Diferencias calculadas correctamente
   - **Coverage Target**: 95%+

3. **Validación matemática** ⏳
   - Verificar que cascada histórica reproduce valores oficiales
   - Documentar discrepancias y redondeos

**Acceptance Criteria**:
- ✅ Motor calcula cascada correctamente
- ✅ Tests cubren casos edge (repetición, decrecimiento sostenido)
- ✅ Coverage >95% en SimulationEngine
- ✅ Configuración histórica reproduce datos oficiales

---

### Phase 3: State Management (1-2 horas)

**Objetivo**: Refactorizar Zustand store para nuevo modelo de datos

#### Tasks

1. **Refactorizar `useSimulationStore.ts`** ⏳
   ```typescript
   interface SimulationState {
     // Data
     presidentes: Record<string, Presidente>;
     historicoReal: RegistroHistorico[];
     
     // Simulation
     slotsActuales: SimulacionSlots;
     resultadoSimulacion: ResultadoSimulacion | null;
     
     // Actions
     setSlot: (slotNumber: 1 | 2 | 3 | 4, presidenteId: string) => void;
     resetToHistorico: () => void;
     recalcularSimulacion: () => void;
   }
   
   export const useSimulationStore = create<SimulationState>((set, get) => {
     const engine = new SimulationEngine();
     
     return {
       presidentes: PRESIDENTES,
       historicoReal: HISTORICO_REAL,
       slotsActuales: engine.getConfiguracionHistorica(),
       resultadoSimulacion: null,
       
       setSlot: (slotNumber, presidenteId) => {
         set(state => {
           const newSlots = { ...state.slotsActuales };
           newSlots[`slot${slotNumber}`] = presidenteId;
           return { slotsActuales: newSlots };
         });
         get().recalcularSimulacion();
       },
       
       resetToHistorico: () => {
         set({ slotsActuales: engine.getConfiguracionHistorica() });
         get().recalcularSimulacion();
       },
       
       recalcularSimulacion: () => {
         const resultado = engine.calculateWhatIfScenario(get().slotsActuales);
         set({ resultadoSimulacion: resultado });
       }
     };
   });
   ```

2. **Inicialización en App mount** ⏳
   - Llamar `recalcularSimulacion()` al montar
   - Verificar que estado inicial es configuración histórica

**Acceptance Criteria**:
- ✅ Store expone API simple (`setSlot`, `reset`)
- ✅ Cambios de slot recalculan automáticamente
- ✅ Estado inicial = configuración histórica

---

### Phase 4: Dark Mode Theme (1 hora)

**Objetivo**: Implementar diseño dark mode con colores especificados

#### Tasks

1. **Configurar Tailwind Dark Theme** ⏳
   ```javascript
   // tailwind.config.js
   export default {
     darkMode: 'class',
     theme: {
       extend: {
         colors: {
           'dark': {
             bg: '#121212',
             card: '#1E1E1E',
             text: '#E0E0E0',
             'text-secondary': '#B0B0B0'
           },
           'growth': {
             positive: '#EF4444',
             negative: '#10B981'
           },
           'accent': '#3B82F6'
         }
       }
     }
   }
   ```

2. **Aplicar dark class a root** ⏳
   ```tsx
   // App.tsx
   useEffect(() => {
     document.documentElement.classList.add('dark');
   }, []);
   ```

3. **Crear `useChartColors.ts` hook** ⏳
   ```typescript
   export const useChartColors = () => {
     return {
       positiveBar: '#EF4444',
       negativeBar: '#10B981',
       gridColor: '#2A2A2A',
       textColor: '#B0B0B0',
       tooltipBg: '#1E1E1E',
       tooltipBorder: '#3B82F6'
     };
   };
   ```

**Acceptance Criteria**:
- ✅ Fondo principal #121212
- ✅ Tarjetas #1E1E1E
- ✅ Contraste texto cumple WCAG 2.1 AA

---

### Phase 5: UI Components (6-8 horas)

**Objetivo**: Crear componentes de UI con dualidad visual

#### Tasks

1. **`DualChart.tsx`** ⏳
   - Layout: Grid 2 columnas (desktop) / Stack vertical (mobile)
   - Sincronización de escalas Y entre ambas gráficas
   - Responsive breakpoint: `md:grid-cols-2`

2. **`RealChart.tsx`** ⏳
   - Recharts BarChart vertical
   - 5 barras (Fox → Sheinbaum)
   - Color basado en `historico.color`
   - Eje Y: homicidios absolutos (0 → max dinámico)
   - Título: "Realidad Histórica"

3. **`WhatIfChart.tsx`** ⏳
   - Recharts BarChart vertical
   - 5 barras (valores de `resultadoSimulacion.valores`)
   - Color basado en presidente seleccionado en cada slot
   - Eje Y sincronizado con RealChart
   - Título: "Simulación What-If"

4. **`SimulationControls.tsx`** ⏳
   - Fox (slot 0): disabled, siempre fijo
   - Slots 1-4: dropdowns con todos los presidentes
   - Botón "Reset a Histórico"
   - Layout horizontal con flechas visuales entre slots

5. **`PresidentSlot.tsx`** ⏳
   ```tsx
   interface Props {
     slotNumber: 0 | 1 | 2 | 3 | 4;
     currentPresident: string;
     disabled?: boolean;
     onChange?: (presidenteId: string) => void;
   }
   ```

6. **`MetricsPanel.tsx`** ⏳
   - Card con 3 secciones:
     - **Real**: Valor final histórico (20,536)
     - **What-If**: Valor final simulado (calculado)
     - **Diferencia**: Absoluta y porcentual
   - Color de diferencia: rojo si +, verde si -

7. **`DataSourceFooter.tsx`** ⏳
   - Disclaimer de fuentes oficiales
   - Nota sobre datos proyectados de Sheinbaum
   - Links a INEGI, SESNSP, World Bank

**Acceptance Criteria**:
- ✅ Dualidad visual clara (Real vs What-If)
- ✅ Cambio de slot actualiza gráfica en <100ms
- ✅ Tooltips muestran: Presidente, Homicidios, TC%, Multiplicador
- ✅ Responsive: gráficas apiladas verticalmente en móvil
- ✅ Dark mode aplicado a todos los componentes

---

### Phase 6: Testing (3-4 horas)

#### Tasks

1. **Unit Tests** ⏳
   - `SimulationEngine.test.ts` (ya creado en Phase 2)
   - `useSimulationStore.test.ts`
   - `useChartColors.test.ts`

2. **Component Tests** ⏳
   - `RealChart.test.tsx`: Renderiza 5 barras correctamente
   - `WhatIfChart.test.tsx`: Actualiza al cambiar store
   - `SimulationControls.test.tsx`: Cambio de slot llama `setSlot`
   - `MetricsPanel.test.tsx`: Muestra diferencias correctamente

3. **Integration Tests** ⏳
   - Cambio de slot → recálculo → actualización de gráfica
   - Reset button → vuelta a configuración histórica
   - Sincronización de escalas Y entre gráficas

4. **E2E Tests** ⏳
   ```typescript
   test('user can simulate alternative scenario', async ({ page }) => {
     await page.goto('/');
     
     // Estado inicial
     await expect(page.locator('[data-testid="real-final"]'))
       .toHaveText('20,536');
     await expect(page.locator('[data-testid="whatif-final"]'))
       .toHaveText('20,536'); // Histórico por defecto
     
     // Cambiar slot 1 a AMLO
     await page.locator('[data-testid="slot-1"]').selectOption('amlo');
     
     // Verificar recálculo
     const nuevoValor = await page.locator('[data-testid="whatif-final"]').textContent();
     expect(nuevoValor).not.toBe('20,536');
     
     // Reset
     await page.locator('[data-testid="reset-button"]').click();
     await expect(page.locator('[data-testid="whatif-final"]'))
       .toHaveText('20,536');
   });
   ```

**Acceptance Criteria**:
- ✅ Unit test coverage >95% en engine
- ✅ Component test coverage >80%
- ✅ E2E test cubre flujo completo de simulación
- ✅ Todos los tests pasan

---

### Phase 7: Documentation & Polish (2 horas)

#### Tasks

1. **Actualizar README.md** ⏳
   - Nombre: MX Security What-If Simulator
   - Screenshot de dualidad visual
   - Explicación del algoritmo de cascada
   - Instrucciones de desarrollo
   - Disclaimer de fuentes y proyecciones

2. **Actualizar package.json** ⏳
   ```json
   {
     "name": "mx-security-dark-sim",
     "description": "Interactive dark-mode simulator for analyzing homicide trends in Mexico with what-if scenarios",
     "keywords": ["mexico", "data-science", "simulation", "dark-mode", "typescript"],
     "repository": "github:username/mx-security-dark-sim"
   }
   ```

3. **Crear CHANGELOG.md** ⏳
   - Documentar cambios v1.0 → v2.0
   - Breaking changes: Modelo de datos, UI completa

4. **Crear DATA_SOURCES.md** ⏳
   - Detallar fuentes oficiales
   - Cálculo de tasas de crecimiento
   - Nota sobre proyecciones de Sheinbaum

5. **Accessibility audit** ⏳
   - Verificar contraste de colores (dark mode)
   - Agregar `aria-label` a controles
   - Verificar navegación por teclado

**Acceptance Criteria**:
- ✅ README actualizado con nueva identidad
- ✅ Documentación de fuentes completa
- ✅ WCAG 2.1 AA compliance verificado

---

### Phase 8: Deployment (1 hora)

#### Tasks

1. **Verificar build de producción** ⏳
   ```bash
   pnpm build
   pnpm preview
   ```

2. **Railway deployment** ⏳
   - Verificar que build funciona en Railway
   - Variables de entorno (si aplica)
   - Dominio custom (opcional)

3. **Performance audit** ⏳
   - Lighthouse score >90 en performance
   - Tiempo de carga inicial <1s
   - Cambio de slot <100ms

**Acceptance Criteria**:
- ✅ App deployada en Railway
- ✅ Lighthouse score >90
- ✅ Mobile y desktop funcionan correctamente

---

## Timeline Estimation

| Phase | Duration | Dependencies |
|-------|----------|-------------|
| 1. Data Layer | 2-3h | None |
| 2. Simulation Engine | 3-4h | Phase 1 |
| 3. State Management | 1-2h | Phase 2 |
| 4. Dark Mode Theme | 1h | None (parallel) |
| 5. UI Components | 6-8h | Phase 3, 4 |
| 6. Testing | 3-4h | Phase 5 |
| 7. Documentation | 2h | Phase 6 |
| 8. Deployment | 1h | Phase 7 |

**Total**: 19-25 horas (~3-4 días de trabajo concentrado)

## Risk Assessment

### High Risk
- **Cambio de modelo de datos**: Migración de tasas mensuales a cierres anuales requiere borrar código existente
- **Mitigation**: Tests exhaustivos, validación contra datos oficiales

### Medium Risk
- **Sincronización de escalas Y**: Ambas gráficas deben tener misma escala para comparación justa
- **Mitigation**: Hook compartido `useChartScale` que calcula max(Real, WhatIf)

### Low Risk
- **Dark mode en Recharts**: Requiere configuración específica de colores
- **Mitigation**: Hook `useChartColors` centraliza configuración

## Success Metrics

- [ ] Motor de simulación reproduce valores históricos al 100%
- [ ] Cascada acumulativa calculada correctamente (tests >95% coverage)
- [ ] Dualidad visual clara en <5s para nuevos usuarios
- [ ] Cambio de slot actualiza UI en <100ms
- [ ] WCAG 2.1 AA compliance en dark mode
- [ ] Lighthouse score >90
- [ ] Zero bugs críticos en producción

## Next Steps

1. **User approval** de este plan
2. **Comenzar Phase 1**: Data Layer Refactoring
3. **Iterar**: Completar phases secuencialmente
4. **Deploy**: Railway deployment al finalizar Phase 8

---

**Status**: Draft - Pending approval  
**Estimated Total Time**: 19-25 horas  
**Target Completion**: 3-4 días
