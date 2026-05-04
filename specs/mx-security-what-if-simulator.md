---
title: MX Security What-If Simulator
status: draft
created: 2026-05-04
updated: 2026-05-04
issue: null
version: 2.0
replaces: homicide-growth-analyzer.md
---

# MX Security What-If Simulator

## 1. Visión General

**MX Security What-If Simulator** es una herramienta interactiva de análisis de datos con tema oscuro (Dark Mode) que permite visualizar y contrastar la realidad histórica de los homicidios en México (2000-2026) frente a escenarios hipotéticos. El núcleo del proyecto es un motor de simulación que permite al usuario reordenar o repetir administraciones presidenciales para observar el impacto de sus tasas de crecimiento acumuladas en el tiempo.

### Diferenciadores Clave
- **Dualidad Visual**: Gráfica Real vs Gráfica What-If lado a lado
- **Motor de Cascada**: Sistema de slots para reordenar presidencias
- **Dark Mode**: Diseño moderno con identidad visual oscura
- **Transparencia de Datos**: Datos oficiales con fuentes verificadas

## 2. Identidad Visual y UX

### Dark Mode Design System

**Paleta de Colores**:
- **Fondo Principal**: `#121212`
- **Tarjetas de Datos**: `#1E1E1E`
- **Texto Principal**: `#E0E0E0` (alta legibilidad)
- **Texto Secundario**: `#B0B0B0`
- **Barras Rojas** (crecimiento positivo): `#EF4444` o `#DC2626`
- **Barras Verdes** (tendencia a la baja): `#10B981` o `#059669`
- **Acento**: `#3B82F6` (azul para elementos interactivos)

### Dualidad Visual

La pantalla se divide en dos secciones principales:

```
┌──────────────────────────────────────────────────────────┐
│                    MX Security What-If                    │
├──────────────────────────┬───────────────────────────────┤
│   GRÁFICA REAL           │   GRÁFICA WHAT-IF             │
│   (Datos históricos)     │   (Simulación dinámica)       │
│                          │                               │
│   [Gráfica de barras]    │   [Gráfica de barras]         │
│   Fox → Calderón →       │   Fox → [Slot1] → [Slot2] →   │
│   Peña → AMLO →          │   [Slot3] → [Slot4]           │
│   Sheinbaum              │                               │
│                          │                               │
│   Valor Final: 20,536    │   Valor Final: [Calculado]    │
└──────────────────────────┴───────────────────────────────┘
│          CONTROLES DE SIMULACIÓN                         │
│  [Fox (Fijo)] → [Slot 1 ▼] → [Slot 2 ▼] →              │
│  [Slot 3 ▼] → [Slot 4 ▼]                                │
└──────────────────────────────────────────────────────────┘
```

### Componentes UI Principales

1. **DualChart**: Contenedor de ambas gráficas (Real + What-If)
2. **BarChart**: Gráfica de barras vertical (Recharts)
3. **PresidentSlotSelector**: Selectores dropdown para los 4 slots
4. **MetricsComparisonPanel**: Panel mostrando valores finales y diferencias
5. **DataSourceFooter**: Disclaimer con fuentes oficiales

## 3. Motor de Datos

### Tabla de Constantes para Simulación

| Presidente      | Tasa de Crecimiento (TC) | Multiplicador Lógico | Cierre Oficial | Nota                          |
|-----------------|--------------------------|----------------------|----------------|-------------------------------|
| V. Fox          | +1.6%                    | 1.016                | 10,452         | Punto de anclaje estático     |
| F. Calderón     | +192.8%                  | 2.928                | 25,967         | Guerra contra narco           |
| E. Peña Nieto   | +59.0%                   | 1.59                 | 36,685         | Cierre oficial 2018           |
| AMLO            | -22.0%                   | 0.78                 | 29,741         | Dato 2023 (cierre estimado)   |
| C. Sheinbaum    | -31.0%                   | 0.69                 | [Proyectado]   | Proyección oficial 2026       |

### Data Model

```typescript
interface Presidente {
  id: string;                    // 'fox' | 'calderon' | 'pena' | 'amlo' | 'sheinbaum'
  nombre: string;                // 'Vicente Fox'
  nombreCorto: string;           // 'Fox'
  tasaCrecimiento: number;       // 0.016 (1.6%)
  multiplicador: number;         // 1.016
  cierreOficial: number;         // 10452
  periodo: string;               // '2000-2006'
  esProyeccion: boolean;         // true para Sheinbaum
}

interface RegistroHistorico {
  presidente: string;
  homicidios: number;            // Valor absoluto de cierre
  tasaCrecimiento: number;       // Porcentaje de crecimiento
  multiplicador: number;         // Factor multiplicador
  color: 'red' | 'green';        // Basado en signo de TC
}

interface SimulacionSlots {
  slot0: 'fox';                  // Fijo, no cambia
  slot1: PresidenteId;           // Seleccionable
  slot2: PresidenteId;           // Seleccionable
  slot3: PresidenteId;           // Seleccionable
  slot4: PresidenteId;           // Seleccionable
}

interface ResultadoSimulacion {
  slots: SimulacionSlots;
  valores: number[];             // Valor final de cada slot [10452, 30603, ...]
  valorFinal: number;            // Último valor calculado
  diferencia: number;            // Diferencia vs realidad histórica
  diferenciaPorcentual: number;  // % diferencia
}
```

## 4. Lógica de Simulación

### Algoritmo de Cascada Acumulativa

El simulador opera bajo una lógica de cascada acumulativa. El usuario dispone de **4 slots** para llenar después del periodo fijo de Fox.

#### Fórmula de Cálculo

Para cada bloque seleccionado, el sistema toma el valor final del bloque anterior ($V_{anterior}$) y le aplica la tasa del presidente actual ($TC_{actual}$):

$$
V_{final} = V_{anterior} \times (1 + TC_{actual})
$$

Donde:
- $V_{anterior}$ = Valor final del slot anterior
- $TC_{actual}$ = Tasa de crecimiento del presidente seleccionado (en forma decimal)
- $V_{final}$ = Valor resultante al final del periodo

#### Ejemplo de Flujo

**Escenario**: Usuario selecciona `Fox → Calderón → AMLO → Peña Nieto → Sheinbaum`

1. **Slot 0 (Fijo)**: Fox termina con **10,452** homicidios
2. **Slot 1 (Calderón)**: $10,452 \times 2.928 = 30,603$
3. **Slot 2 (AMLO)**: $30,603 \times 0.78 = 23,870$
4. **Slot 3 (Peña Nieto)**: $23,870 \times 1.59 = 37,953$
5. **Slot 4 (Sheinbaum)**: $37,953 \times 0.69 = 26,187$

**Resultado Final**: La gráfica What-If mostrará **26,187 homicidios** en lugar de los **20,536** de la realidad histórica.

**Diferencia**: +5,651 homicidios (+27.5%)

### Implementación en TypeScript

```typescript
class SimulationEngine {
  private readonly presidentes: Record<string, Presidente>;
  
  calculateWhatIfScenario(slots: SimulacionSlots): ResultadoSimulacion {
    const valores: number[] = [];
    let valorActual = this.presidentes.fox.cierreOficial; // 10,452 (fijo)
    
    valores.push(valorActual);
    
    // Calcular slots 1-4
    const slotIds = [slots.slot1, slots.slot2, slots.slot3, slots.slot4];
    
    for (const presidenteId of slotIds) {
      const presidente = this.presidentes[presidenteId];
      valorActual = valorActual * presidente.multiplicador;
      valores.push(Math.round(valorActual));
    }
    
    const valorFinal = valores[valores.length - 1];
    const valorRealFinal = this.getValorRealFinal();
    const diferencia = valorFinal - valorRealFinal;
    const diferenciaPorcentual = ((diferencia / valorRealFinal) * 100);
    
    return {
      slots,
      valores,
      valorFinal,
      diferencia,
      diferenciaPorcentual
    };
  }
  
  private getValorRealFinal(): number {
    // Sheinbaum proyección 2026
    // Calculado como: AMLO (29,741) * Sheinbaum (0.69) = ~20,536
    return 20536;
  }
}
```

## 5. Arquitectura Técnica

### Stack Tecnológico

- **Framework**: React 18+ con TypeScript 5+
- **Build Tool**: Vite 5+
- **State Management**: Zustand 4+ (simple y performante)
- **Visualización**: Recharts 2+ (configurado para dark mode)
- **Styling**: Tailwind CSS 3+ (custom dark theme)
- **Testing**: Vitest + React Testing Library
- **Deployment**: Railway (estático)

### Estructura de Componentes

```
src/
├── components/
│   ├── DualChart/
│   │   ├── DualChart.tsx          # Contenedor principal
│   │   ├── RealChart.tsx          # Gráfica de datos reales
│   │   ├── WhatIfChart.tsx        # Gráfica de simulación
│   │   └── ChartLegend.tsx        # Leyenda compartida
│   ├── SimulationControls/
│   │   ├── SimulationControls.tsx # Contenedor de controles
│   │   ├── PresidentSlot.tsx      # Selector individual
│   │   └── ResetButton.tsx        # Botón de reset
│   ├── MetricsPanel/
│   │   ├── MetricsPanel.tsx       # Panel de métricas
│   │   ├── RealMetrics.tsx        # Métricas de datos reales
│   │   ├── WhatIfMetrics.tsx      # Métricas de simulación
│   │   └── DifferenceCard.tsx     # Card de diferencias
│   └── DataSourceFooter/
│       └── DataSourceFooter.tsx   # Disclaimer de fuentes
├── data/
│   ├── presidentes.data.ts        # Constantes de presidentes
│   ├── historico.data.ts          # Datos históricos reales
│   └── types.ts                   # TypeScript interfaces
├── engine/
│   ├── SimulationEngine.ts        # Motor de simulación
│   └── SimulationEngine.test.ts   # Tests del motor
├── store/
│   └── useSimulationStore.ts      # Zustand store
├── hooks/
│   ├── useSimulation.ts           # Hook de simulación
│   └── useChartColors.ts          # Hook de colores
└── App.tsx                         # Componente principal
```

### Configuración de Dark Mode (Tailwind)

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
        'dark-text': '#E0E0E0',
        'dark-text-secondary': '#B0B0B0',
        'growth-positive': '#EF4444',  // Rojo
        'growth-negative': '#10B981',  // Verde
      }
    }
  }
}
```

## 6. Requirements

### Functional Requirements

#### Data Management
- [x] Datos de presidentes hardcodeados con TC y multiplicadores
- [x] Valores de cierre oficial para cada administración
- [ ] Validar que multiplicadores = 1 + (TC/100)
- [ ] Marcar datos de Sheinbaum como "Proyectados"

#### Visualization
- [ ] Renderizar dos gráficas de barras verticales lado a lado
- [ ] Gráfica Real: 5 barras (Fox → Calderón → Peña → AMLO → Sheinbaum)
- [ ] Gráfica What-If: 5 barras (Fox fijo + 4 slots seleccionables)
- [ ] Aplicar color rojo para TC positivo, verde para TC negativo
- [ ] Eje Y sincronizado entre ambas gráficas (escala dinámica)
- [ ] Tooltips mostrando: Presidente, Homicidios, TC%, Multiplicador

#### Simulation Engine
- [ ] Slot 0 (Fox) siempre fijo en 10,452
- [ ] Slots 1-4 seleccionables vía dropdown
- [ ] Permitir repetir presidentes (ej: Calderón en todos los slots)
- [ ] Calcular cascada acumulativa con fórmula $V_{final} = V_{anterior} \times (1 + TC)$
- [ ] Actualizar gráfica What-If en tiempo real al cambiar slots
- [ ] Botón "Reset" para volver a configuración histórica real

#### User Interface
- [ ] Dark mode obligatorio (no toggle de light mode)
- [ ] Diseño responsive mobile-first
- [ ] Controles de simulación debajo de las gráficas
- [ ] Panel de métricas mostrando:
  - Valor final Real vs What-If
  - Diferencia absoluta
  - Diferencia porcentual
- [ ] Footer con disclaimer de fuentes y transparencia

### Non-Functional Requirements

- [ ] **Performance**: Renderizado inicial < 1 segundo
- [ ] **Interactividad**: Cambio de slot actualiza gráfica en < 100ms
- [ ] **Data Accuracy**: Multiplicadores verificados con datos oficiales
- [ ] **Accessibility**: WCAG 2.1 AA (contraste suficiente en dark mode)
- [ ] **Browser Support**: Chrome, Firefox, Safari, Edge (versiones modernas)
- [ ] **Responsive**: Funcional en móviles (stacking vertical de gráficas)
- [ ] **Localization**: Español-only

## 7. Testing Strategy

### Unit Tests

**SimulationEngine**:
```typescript
describe('SimulationEngine', () => {
  it('should calculate cascading multiplication correctly', () => {
    const engine = new SimulationEngine();
    const result = engine.calculateWhatIfScenario({
      slot0: 'fox',
      slot1: 'calderon',
      slot2: 'amlo',
      slot3: 'pena',
      slot4: 'sheinbaum'
    });
    
    expect(result.valores[0]).toBe(10452);  // Fox
    expect(result.valores[1]).toBe(30603);  // Calderón
    expect(result.valores[2]).toBe(23870);  // AMLO
    expect(result.valores[3]).toBe(37953);  // Peña
    expect(result.valores[4]).toBe(26187);  // Sheinbaum
  });
  
  it('should handle repeated presidents', () => {
    const engine = new SimulationEngine();
    const result = engine.calculateWhatIfScenario({
      slot0: 'fox',
      slot1: 'calderon',
      slot2: 'calderon',
      slot3: 'calderon',
      slot4: 'calderon'
    });
    
    // Fox: 10,452
    // Calderón x1: 10,452 * 2.928 = 30,603
    // Calderón x2: 30,603 * 2.928 = 89,606
    // Calderón x3: 89,606 * 2.928 = 262,366
    // Calderón x4: 262,366 * 2.928 = 768,167
    expect(result.valorFinal).toBeCloseTo(768167, -2);
  });
});
```

**Coverage Target**: 95%+ en motor de simulación

### Integration Tests

- [ ] Cambiar slot → verificar recálculo de cascada
- [ ] Reset button → verificar vuelta a configuración histórica
- [ ] Hover en barra → verificar tooltip con datos correctos

### E2E Tests (Playwright)

```typescript
test('user can simulate alternative scenario', async ({ page }) => {
  await page.goto('/');
  
  // Verificar estado inicial
  await expect(page.locator('[data-testid="real-final-value"]'))
    .toHaveText('20,536');
  
  // Cambiar slot 1 a AMLO
  await page.locator('[data-testid="slot-1-select"]').selectOption('amlo');
  
  // Verificar recálculo
  await expect(page.locator('[data-testid="whatif-slot-1-value"]'))
    .not.toBe('25,967'); // Ya no es Calderón
  
  // Verificar diferencia actualizada
  await expect(page.locator('[data-testid="difference-value"]'))
    .toBeVisible();
});
```

## 8. Success Criteria

- [ ] **Visual Accuracy**: Usuarios identifican dualidad Real vs What-If en < 5 segundos
- [ ] **Simulation Usability**: Usuarios completan simulación en < 20 segundos
- [ ] **Performance**: Cambios de slot se reflejan en < 100ms
- [ ] **Data Transparency**: Footer muestra fuentes oficiales claramente
- [ ] **Mobile UX**: Gráficas apiladas verticalmente son legibles en móvil
- [ ] **Test Coverage**: >95% en SimulationEngine, >80% en componentes

## 9. Boundaries & Constraints

### In Scope
- Visualización a nivel **nacional** (todo México)
- Datos de **cierre de administración** (no mensuales)
- **5 presidentes** (Fox, Calderón, Peña, AMLO, Sheinbaum)
- **Motor de cascada** con 4 slots configurables
- **Dark mode** obligatorio
- **Homicidios absolutos** (no tasas por 100k habitantes)

### Out of Scope
- **Desglose por estados** (solo nivel nacional)
- **Otros delitos** (solo homicidios)
- **Análisis de causas** (solo presentación de datos)
- **Datos mensuales** (solo cierres de administración)
- **Light mode** (dark mode es parte de la identidad)
- **Exportación de datos** (solo visualización)
- **API en tiempo real** (datos hardcodeados)

### Data Constraints
- **Precisión**: Datos oficiales de INEGI, SESNSP, World Bank
- **Actualización**: Datos hardcodeados (no actualización automática)
- **Granularidad**: Por administración (no mensual)
- **Proyección**: Datos de Sheinbaum marcados como proyectados

## 10. GitHub Repository

### Configuración Recomendada

**Repository Name**: `mx-security-dark-sim`

**Topics**:
- `data-science`
- `mexico`
- `typescript`
- `simulation`
- `dark-mode`
- `recharts`
- `zustand`
- `vite`

**README.md** debe incluir:
- Screenshot de la dualidad visual (Real vs What-If)
- Explicación del algoritmo de cascada
- Disclaimer de fuentes oficiales
- Nota sobre datos proyectados de Sheinbaum

**LICENSE**: MIT

## 11. Implementation Plan

Será desarrollado en fase de planificación detallada.

Link: `specs/mx-security-what-if-simulator-plan.md` (próximo paso)

## 12. References

### Fuentes de Datos Oficiales

1. **INEGI** (Instituto Nacional de Estadística y Geografía)
   - Datos de homicidios por administración
   - URL: https://www.inegi.org.mx/

2. **SESNSP** (Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública)
   - Datos de homicidios dolosos
   - URL: https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva

3. **World Bank**
   - Datos complementarios y validación
   - URL: https://data.worldbank.org/

4. **Wikipedia** (referencias académicas citadas)
   - Datos de cierre de administraciones
   - Tasas de crecimiento calculadas

### Nota sobre Precisión de Datos

Los datos de la administración de **Claudia Sheinbaum** (2024-2030) están **proyectados** con base en la tendencia de reducción del **-31%** observada hasta mayo de 2026. Estos datos deben marcarse claramente en la UI como "Proyectados" para mantener la transparencia estadística.

---

**Status**: Draft - Pending approval  
**Version**: 2.0  
**Replaces**: `homicide-growth-analyzer.md` (v1.0)  
**Next Step**: User approval to create implementation plan
