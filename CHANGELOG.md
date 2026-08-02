# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-08-01

### Added

- **Onboarding y compartir**: auto-onboarding en la primera visita, soporte táctil en tooltips, y compartir simulaciones vía URL (`useShareSimulation`) con validación del president id recibido
- **Identidad visual institucional**: paleta de colores rediseñada, tipografía display en título y números de headline, set de iconos propio (reemplaza emojis), estados de carga on-brand, animación de dígitos en resultados
- **CI hosteada**: `.github/workflows/ci.yml` con jobs `lint`, `test`, `typecheck`, `lock-check`, `license-check`, `trivy-fs` y `build` gateado a `main`
- **Dependabot** (`.github/dependabot.yml`) y **Socket Firewall** (`.github/workflows/socket-firewall.yml`) para actualizaciones de dependencias automatizadas y protegidas contra paquetes maliciosos
- **Scan de secretos en pre-commit** vía `gitleaks protect --staged`
- **Cobertura de tests** para `SimulationEngine`, `ComparisonChart`, `MetricsPanel`, `SimulationControls`, `PresidentSlot` y el store

### Changed

- **UI simplificada**: un solo `ComparisonChart` de líneas en lugar de las dos gráficas de barras (`RealChart`/`WhatIfChart`); métricas de headline promovidas arriba del chart; controles de simulación en layout de dos columnas para móvil
- **Migración a pnpm** como único gestor de paquetes, con scripts reorganizados y documentación actualizada
- **Node.js 22 → 24 → 26** en Docker, con la imagen de producción pineada por digest (`node:26-alpine`)
- **Tailwind CSS v3 → v4**, Vite/Vitest/`@vitejs/plugin-react`/jsdom a sus últimas majors
- **`ComparisonChart`** con lazy-load (code-splitting de Recharts) y líneas sólidas con marcadores de forma en vez de patrones de guiones
- Título traducido a "México: Simulador de Escenarios de Seguridad" y "What-If" → "¿Y si?"

### Fixed

- Multiplicadores de cascada corregidos para coincidir con datos históricos
- Posicionamiento y ancho del tooltip de comparación en viewports pequeños
- Visibilidad e interacción del `HelpModal`
- `npm`/`npx` eliminados de las imágenes Docker para quitar CVEs de sus dependencias transitivas
- Descubrimiento de `pnpm` en el hook `pre-push` no interactivo (source de `nvm`)

### Removed

- Código muerto: `main.ts`, `RealChart`, `WhatIfChart`

---

## [2.0.0] - 2026-05-04

### 🎉 Rediseño Completo - MX Security What-If Simulator

Esta versión representa una refactorización completa del proyecto con nuevos objetivos de diseño y funcionalidad.

### Added

- **Dark Mode Nativo**: Identidad visual oscura (#121212, #1E1E1E)
- **Dualidad Visual**: Dos gráficas lado a lado (Realidad Histórica vs Simulación What-If)
- **Sistema de Slots**: 4 slots configurables después de Fox (que permanece fijo)
- **Motor de Cascada**: Nuevo algoritmo $V_{final} = V_{anterior} \times (1 + TC)$
- **Datos Simplificados**: Valores de cierre de administración en lugar de datos mensuales
- **Código de Colores**: Rojo para crecimientos positivos, verde para reducciones
- **Panel de Métricas**: Comparación visual de Real vs What-If con diferencias
- **Footer de Fuentes**: Disclaimer de datos oficiales y proyecciones
- **Tests Exhaustivos**: >95% coverage en SimulationEngine
- **Documentación Completa**: README, CHANGELOG, especificaciones actualizadas

### Changed

- **Modelo de Datos**: De tasas mensuales por 100k habitantes → Valores de cierre anuales (homicidios absolutos)
- **Visualización**: De gráfica de línea temporal única → Dos gráficas de barras lado a lado
- **Simulación**: De selección de periodo + presidente → Sistema de 4 slots configurables
- **Nombre del Proyecto**: "Homicide Growth Analyzer" → "MX Security What-If Simulator"
- **Multiplicadores**: Basados en tasas de crecimiento oficiales de cada administración
- **Estado Global**: Zustand store completamente refactorizado

### Removed

- **NO hay retrocompatibilidad con v1.0**
- Datos mensuales eliminados
- Concepto de "inercia" (primeros 6 meses) eliminado
- Tasas por 100k habitantes removidas
- Componentes TimeSeriesChart y SimulationPanel eliminados
- Archivos en src/lib/ eliminados

### Breaking Changes

⚠️ **Esta versión NO es compatible con v1.0**

- Modelo de datos completamente diferente
- API de componentes nueva
- Store refactorizado (diferentes actions y state)
- Spec v1.0 deprecada y reemplazada por v2.0

---

## [1.0.0] - 2026-05-03

### Added

- **MVP Inicial**: WebApp de análisis de crecimiento de homicidios
- Visualización de tasas por 100k habitantes (2000-2026)
- Datos mensuales de INEGI, SESNSP, CONAPO
- Gráfica de línea temporal con Recharts
- Detección de inercia (primeros 6 meses de sexenio)
- Proyecciones mensuales
- Simulación básica de escenarios
- Zustand para state management
- Tests unitarios con Vitest
- Datos oficiales hardcodeados

### Initial Release

Primera implementación basada en spec-driven development con enfoque en tasas normalizadas por población.

---

## Notas de Migración v1.0 → v2.0

Si tienes código basado en v1.0, estos son los cambios principales:

**Antes (v1.0)**:
```typescript
import { RegistroMensual } from './data/types';
const datos: RegistroMensual[] = [...];
// tasa por 100k habitantes
```

**Ahora (v2.0)**:
```typescript
import { RegistroHistorico } from './data/types';
const datos: RegistroHistorico[] = [...];
// homicidios absolutos (valores de cierre)
```

**Motor de Simulación**:
```typescript
// v1.0: Seleccionar periodo y aplicar tasa
applyGrowthRate(periodo, presidente);

// v2.0: Configurar slots y calcular cascada
engine.calculateWhatIfScenario({
  slot0: 'fox',
  slot1: 'calderon',
  slot2: 'amlo',
  slot3: 'pena',
  slot4: 'sheinbaum'
});
```

---

Para más detalles, consulta:
- [Especificación v2.0](./specs/mx-security-what-if-simulator.md)
- [Plan de Implementación](./specs/mx-security-what-if-simulator-plan.md)
- [Especificación v1.0 (Deprecated)](./specs/homicide-growth-analyzer.md)
