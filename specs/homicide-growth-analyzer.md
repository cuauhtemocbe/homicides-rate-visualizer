---
title: WebApp de Análisis de Crecimiento de Homicidios (México 2000-2026)
status: deprecated
created: 2026-05-03
updated: 2026-05-04
deprecated_date: 2026-05-04
replaced_by: mx-security-what-if-simulator.md
issue: null
---

> **⚠️ DEPRECATED**: Esta especificación ha sido reemplazada por `mx-security-what-if-simulator.md` (v2.0).  
> La nueva versión incluye diseño dark mode, dualidad visual (Real vs What-If), y sistema de slots de simulación.

# WebApp de Análisis de Crecimiento de Homicidios (México 2000-2026)

## Objective

Desarrollar una aplicación web interactiva en TypeScript que permita visualizar, comparar y proyectar la evolución de homicidios en México (2000-2026), enfocándose en tasas de crecimiento normalizadas por cada 100,000 habitantes. La aplicación permite simulaciones de escenarios intercambiando el "comportamiento" (tasa de crecimiento) de diferentes administraciones presidenciales para análisis comparativo riguroso.

## Context

### Problem Statement

Las visualizaciones tradicionales de datos de homicidios en México presentan números absolutos que no permiten comparaciones justas entre periodos con diferente población, ni facilitan el análisis del impacto relativo de políticas de seguridad de diferentes administraciones. 

### User Needs

- **Ciudadanos**: Entender la evolución real de la violencia normalizada por población
- **Analistas/Periodistas**: Comparar el desempeño de administraciones bajo condiciones equivalentes
- **Investigadores**: Realizar análisis contrafactuales (¿qué hubiera pasado si...?)

### Differentiation

A diferencia de gráficas tradicionales, esta app:
1. Usa tasas por 100k habitantes (no números absolutos)
2. Permite "inyectar" tasas de crecimiento de un periodo en otro (simulador)
3. Visualiza efectos de inercia (primeros 6 meses de cada sexenio)
4. Diferencia datos históricos vs. proyecciones

## Requirements

### Functional Requirements

#### Data Management
- [ ] Datos históricos mensuales hardcodeados (2000-2026) en JSON/TypeScript
- [ ] Calcular tasas por cada 100,000 habitantes usando proyecciones de CONAPO (hardcoded)
- [ ] Registrar métricas de inicio/fin para cada sexenio (homicidios totales, tasa base, pendiente)
- [ ] Validar integridad de datos hardcodeados al build time

#### Visualization
- [ ] Renderizar gráfica de línea temporal (2000-2026) con tasa de homicidios
- [ ] Eje Y debe partir de 0 (evitar exageraciones visuales)
- [ ] Diferenciar visualmente datos históricos, inercia y proyecciones
- [ ] Resaltar primeros 6 meses de cada sexenio como "zona de transición" (inercia)
- [ ] Depreciar visualmente el primer mes (diciembre) de cada cambio de administración
- [ ] Mostrar tooltips con: Fecha, Presidente, Tasa Real, Tasa Proyectada, Variación % vs Mes Anterior

#### Simulation Engine (Motor de Intercambio)
- [ ] Permitir seleccionar un periodo objetivo (ej. 2024-2026)
- [ ] Permitir seleccionar una administración cuyo comportamiento se quiere aplicar
- [ ] Calcular línea de comparación aplicando tasa de crecimiento del presidente seleccionado al valor inicial del periodo
- [ ] Renderizar línea "fantasma" o proyectada junto a la línea real
- [ ] Permitir comparar múltiples escenarios simultáneamente

#### User Interface
- [ ] Interfaz limpia enfocada en la curva temporal (sin desglose por estados)
- [ ] Controles para seleccionar periodo y administración para simulación
- [ ] Leyenda clara diferenciando líneas reales, proyectadas, inercia
- [ ] Panel de información mostrando métricas clave del periodo seleccionado

### Non-Functional Requirements

- [ ] **Performance**: Renderizado inicial < 2 segundos, interacciones < 200ms
- [ ] **Data Accuracy**: 100% de datos oficiales verificados, cálculos de tasas auditables
- [ ] **Scalability**: Soportar 26 años × 12 meses = 312 puntos de datos sin degradación
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Browser Support**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge latest)
- [ ] **Responsive Design**: Mobile-first responsive design (obligatorio)
- [ ] **Localization**: Spanish-only (UI en español)
- [ ] **Deployment**: Railway-compatible (no special configs needed)

## Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer                         │
│  - TimeSeriesChart (Recharts/D3)                   │
│  - SimulationControls (Selector de periodo/admin)  │
│  - MetricsPanel (Estadísticas del periodo)         │
│  - Tooltip (Datos al hover)                        │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                  State Layer                        │
│  - Zustand/Redux Store                             │
│    * historical data (RegistroMensual[])           │
│    * selected simulation parameters                │
│    * computed projections                          │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                 Business Logic                      │
│  - DataLoader (fetch/parse oficial data)           │
│  - RateCalculator (tasas por 100k habitantes)      │
│  - GrowthEngine (calcular pendientes)              │
│  - SimulationEngine (motor de intercambio)         │
│  - InertiaDetector (primeros 6 meses)              │
│  - DataValidator (validar integridad)              │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                  Data Layer                         │
│  - JSON/CSV de datos históricos                    │
│  - API/Script de actualización SESNSP/INEGI        │
│  - Proyecciones de población CONAPO                │
└─────────────────────────────────────────────────────┘
```

### Data Model

#### Core Data Structure

```typescript
interface RegistroMensual {
  fecha: string;           // ISO Format (YYYY-MM-DD)
  homicidios: number;      // Homicidios absolutos
  tasa: number;            // Por cada 100k habitantes
  presidente: string;      // Nombre del mandatario
  esProyeccion: boolean;   // True para meses futuros no publicados
  esInercia?: boolean;     // True para primeros 6 meses de sexenio
  poblacion: number;       // Población de México en ese mes (CONAPO)
}

interface Sexenio {
  presidente: string;
  inicio: string;          // YYYY-MM-DD
  fin: string;             // YYYY-MM-DD
  homicidiosInicio: number;
  homicidiosFin: number;
  tasaInicio: number;
  tasaFin: number;
  pendienteCrecimiento: number; // % mensual/anual promedio
}

interface SimulacionParametros {
  periodoObjetivo: {
    inicio: string;
    fin: string;
  };
  presidenteComportamiento: string; // Cuya tasa se aplica
}

interface RegistroSimulado extends RegistroMensual {
  tasaProyectada: number;
  presidenteSimulado: string;
}
```

### External Dependencies

- **Recharts** (v2.x): Visualización de gráficas (más simple y rápido)
- **Zustand** (v4.x): State management (menos boilerplate que Redux)
- **date-fns** (v3.x): Manipulación de fechas
- **TypeScript** (v5.x): Tipado estricto
- **Vite** (already in project): Build tool
- **Vitest** (for testing): Test runner
- **Tailwind CSS** (optional): Styling responsive mobile-first

### Data Sources (Official - Hardcoded)

**Nota**: Datos hardcodeados en el código (no API en tiempo real)

1. **SESNSP** (Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública)
   - Datos de homicidios dolosos mensuales (2000-2026)
   - URL: https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva
   - Se descarga CSV/JSON una vez y se embebe en código

2. **INEGI** (Instituto Nacional de Estadística y Geografía)
   - Datos complementarios de homicidios
   - URL: https://www.inegi.org.mx/

3. **CONAPO** (Consejo Nacional de Población)
   - Proyecciones de población de México (hardcoded)
   - URL: https://www.gob.mx/conapo

## User Stories

### Epic: Visualización de Datos Históricos

**Como** ciudadano interesado en seguridad pública  
**Quiero** ver la tasa de homicidios por cada 100k habitantes desde el año 2000  
**Para** comparar años con distinta población de forma justa

**Acceptance Criteria (Gherkin)**:
```gherkin
Feature: Visualización de Tasa Histórica de Homicidios

  Scenario: Ver gráfica de tasa histórica
    Given que estoy en la página principal
    When la aplicación carga
    Then debo ver una gráfica de línea con datos desde 2000 hasta 2026
    And el eje Y debe mostrar "Tasa por cada 100,000 habitantes"
    And el eje Y debe partir desde 0
    And debo ver etiquetas de cada administración presidencial

  Scenario: Hover sobre punto de datos
    Given que estoy viendo la gráfica
    When paso el mouse sobre un punto
    Then debo ver un tooltip con:
      | Campo                | Ejemplo              |
      | Fecha                | Enero 2020           |
      | Presidente           | AMLO                 |
      | Tasa Real            | 28.5 por 100k        |
      | Variación vs Mes Ant | -2.3%                |
      | Homicidios Absolutos | 3,500                |
```

### Epic: Simulador de Escenarios

**Como** analista político  
**Quiero** aplicar la tasa de crecimiento de Calderón al periodo de AMLO  
**Para** ver si el comportamiento fue más o menos agresivo bajo condiciones equivalentes

**Acceptance Criteria (Gherkin)**:
```gherkin
Feature: Motor de Intercambio (Simulador)

  Scenario: Aplicar tasa de crecimiento de otra administración
    Given que estoy en la página principal
    When selecciono el periodo "2018-2024" (AMLO)
    And selecciono aplicar comportamiento de "Calderón (2006-2012)"
    Then debo ver una línea proyectada adicional en la gráfica
    And la línea proyectada debe partir del valor real de diciembre 2018
    And la línea proyectada debe aplicar la pendiente de crecimiento de Calderón
    And debo ver una leyenda diferenciando "Real" vs "Proyección (Calderón)"

  Scenario: Tooltip en línea proyectada
    Given que tengo una simulación activa
    When paso el mouse sobre la línea proyectada
    Then el tooltip debe mostrar:
      | Campo            | Ejemplo                    |
      | Fecha            | Junio 2020                 |
      | Tasa Real        | 28.5 por 100k              |
      | Tasa Proyectada  | 32.1 por 100k (Calderón)   |
      | Diferencia       | -3.6 por 100k (-11.2%)     |
```

### Epic: Visualización de Inercia

**Como** usuario de la aplicación  
**Quiero** que la gráfica resalte los primeros 6 meses de cada sexenio  
**Para** entender qué parte de la violencia es heredada de la administración anterior

**Acceptance Criteria (Gherkin)**:
```gherkin
Feature: Efecto de Inercia

  Scenario: Ver zona de transición
    Given que estoy viendo la gráfica
    When observo el inicio de un sexenio
    Then debo ver los primeros 6 meses resaltados con color diferente o sombra
    And debe haber una leyenda explicando "Periodo de Inercia (6 meses)"
    
  Scenario: Primer mes depreciado
    Given que estoy viendo un cambio de administración
    When observo diciembre del año de cambio
    Then ese punto debe tener opacidad reducida o marcador diferente
    And el tooltip debe indicar "Mes de transición (peso depreciado)"
```

### Epic: Validación de Datos

**Como** desarrollador del sistema  
**Quiero** que el sistema valide la integridad de los datos importados del SESNSP  
**Para** asegurar precisión total en los cálculos

**Acceptance Criteria (Gherkin)**:
```gherkin
Feature: Validación de Integridad de Datos

  Scenario: Importar datos válidos
    Given que tengo un archivo JSON con datos de SESNSP
    When ejecuto el script de importación
    Then el sistema debe validar:
      | Validación                        |
      | Todos los meses 2000-2026 presentes |
      | No hay valores negativos           |
      | No hay valores nulos               |
      | Fechas en formato ISO correcto     |
      | Tasa calculada = (homicidios/población) * 100000 |
    And si todas las validaciones pasan, importar los datos
    And si alguna falla, rechazar la importación y mostrar errores

  Scenario: Detectar datos faltantes
    Given que intento importar datos incompletos
    When falta el mes de "2015-06"
    Then el sistema debe mostrar error: "Datos faltantes: Junio 2015"
    And no debe permitir la importación
```

## Testing Strategy

### Unit Tests
- **RateCalculator**: Verificar cálculo correcto de tasas por 100k habitantes
- **GrowthEngine**: Verificar cálculo de pendientes de crecimiento
- **SimulationEngine**: Verificar aplicación correcta de tasas de una admin a otra
- **InertiaDetector**: Verificar identificación correcta de primeros 6 meses
- **DataValidator**: Verificar todas las reglas de validación

**Coverage Target**: 90%+ para business logic

### Integration Tests
- **DataLoader + RateCalculator**: Importar datos y calcular tasas end-to-end
- **SimulationEngine + State**: Cambiar parámetros y verificar actualización de proyecciones
- **Chart + Tooltip**: Verificar renderizado correcto de datos en UI

**Coverage Target**: 80%+

### E2E Tests (Playwright/Cypress)
- **User Flow 1**: Cargar app → ver gráfica histórica → hacer hover → ver tooltip
- **User Flow 2**: Seleccionar periodo → seleccionar admin → ver simulación
- **User Flow 3**: Ver inercia en transiciones de sexenios

### Visual Regression Tests
- Capturar screenshots de gráfica para detectar cambios visuales inesperados

### Data Validation Tests
- Test con datos reales de SESNSP para verificar integridad
- Test con datos corruptos para verificar rechazo correcto

## Boundaries & Constraints

### In Scope
- Visualización a nivel **nacional** (todo México)
- Datos mensuales desde **2000 hasta 2026**
- **Sexenios presidenciales** como unidad de análisis
- **Tasas por 100k habitantes** (normalizado)
- **Motor de simulación** para intercambiar comportamientos
- **Efecto de inercia** (primeros 6 meses)
- Datos de **homicidios dolosos** (no accidentales)

### Out of Scope
- **Desglose por estados** (solo nivel nacional)
- **Otros delitos** (solo homicidios dolosos)
- **Análisis de causas** (solo presentación de datos)
- **Predicciones futuras más allá de 2026**
- **Autenticación de usuarios** (app pública)
- **Exportación de datos** (solo visualización)
- **Comparaciones internacionales** (solo México)

### Technical Constraints
- **Lenguaje**: TypeScript obligatorio (tipado estricto)
- **Framework**: React + Vite (ya configurado en proyecto)
- **Visualización**: Recharts (más simple, mejor para proyecto)
- **State**: Zustand (menos boilerplate, más simple que Redux)
- **Data Sources**: Datos hardcodeados de fuentes oficiales (SESNSP, INEGI, CONAPO)
- **Browser Support**: Modern evergreen only (no IE11, no Safari < 14)
- **Deployment**: Railway (no special configs needed)
- **Responsive**: Mobile-first obligatorio

### Data Constraints
- **Precisión**: Datos oficiales sin interpolación ni estimaciones
- **Actualización**: Datos hardcodeados (no actualización automática)
- **Granularidad**: Mensual (no semanal ni diaria)
- **Período**: 2000-2026 (fijo, hardcoded)

## Success Criteria

- [ ] **Data Accuracy**: 100% de datos verificados contra fuentes oficiales
- [ ] **Visual Clarity**: Usuarios identifican periodo de inercia sin ayuda en < 10 segundos
- [ ] **Simulation Usability**: Usuarios completan simulación de escenario en < 30 segundos
- [ ] **Performance**: Renderizado inicial < 2 segundos en conexión 4G
- [ ] **Test Coverage**: >90% en business logic, >80% en integration
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Cross-browser**: Funciona en Chrome, Firefox, Safari, Edge (versiones recientes) sin bugs
- [ ] **Mobile**: Responsive y usable en móviles (diseño mobile-first)

## Decisions Made

1. **Deployment**: Railway (no special configs needed)
2. **Data Updates**: Datos hardcodeados (no actualización automática)
3. **Authentication**: App pública (no login required)
4. **Browser Support**: Modern evergreen only (Chrome, Firefox, Safari, Edge latest)
5. **Accessibility**: WCAG 2.1 AA
6. **Performance**: Sitio estático, soporta 1000+ usuarios concurrentes
7. **Mobile**: Responsive obligatorio (mobile-first)
8. **Language**: Spanish-only
9. **Chart Library**: Recharts (más simple, rápido de implementar)
10. **State Management**: Zustand (menos boilerplate que Redux)

## Implementation Plan

Will be created in Phase 2 after spec approval.

Link: `specs/homicide-growth-analyzer-plan.md` (to be created)

## References

- [SESNSP Datos Abiertos](https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva)
- [INEGI](https://www.inegi.org.mx/)
- [CONAPO Proyecciones de Población](https://www.gob.mx/conapo)

---

**Status**: Spec complete with all decisions made  
**Next Step**: User approval to advance to Phase 2 (Planning)
