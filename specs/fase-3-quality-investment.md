---
title: Fase 3 — Inversión en calidad
status: completed
created: 2026-07-18
updated: 2026-07-18
issue: milestone-3
issues: [26, 27]
---

# Fase 3 — Inversión en calidad

## Objective

Cerrar los 2 issues del milestone "Fase 3" para que el repo tenga un linter real (distinto del type checker) y un gate de cobertura de tests que falle el build cuando la cobertura cae por debajo de un umbral acordado, en vez de solo reportarla.

## Context

Hoy `"lint": "tsc --noEmit"` es idéntico a `"typecheck"` — no existe linting real, solo type checking bajo un nombre engañoso. No hay `.eslintrc`/`eslint.config.*`/`biome.json` en el repo. `vite.config.ts` ya configura `coverage` (provider `v8`, reporters `text`/`lcov`/`html`) pero sin `thresholds` — la cobertura se mide pero nunca bloquea nada. El job `lint` de `.github/workflows/ci.yml` (agregado en Fase 2, issue #35) ya invoca `pnpm run lint` — hoy duplica `typecheck` a propósito, según nota explícita del propio issue #35; esta fase reemplaza esa duplicación por linting real sin tocar la estructura del workflow.

Baseline de cobertura medido el 2026-07-18 con `pnpm test:coverage` (16 test files, 78 tests, todos pasando):

| Métrica | Global | `src/engine/SimulationEngine.ts` |
|---|---|---|
| Statements | 90.36% | 100% (16/16 líneas) |
| Branches | 80.71% | sin branches (archivo puramente secuencial) |
| Functions | 89.62% | 100% (5/5) |
| Lines | 92.59% | 100% |

`src/App.tsx` es el outlier más bajo (68% stmts, 50% branches) — arrastra el promedio global hacia abajo por ramas de error/loading no cubiertas.

## Requirements

### Functional Requirements

- [x] `biome.json` con ruleset explícito (no solo defaults) cubriendo lint + format (issue #26)
- [x] `pnpm lint` corre Biome, no `tsc` — distinto de `pnpm typecheck` (issue #26)
- [x] `pnpm format:check` verifica formato sin escribir cambios, falla en archivos inconsistentes (issue #26)
- [x] `scripts/validate.sh` invoca `pnpm lint` como paso propio (issue #26)
- [x] `vite.config.ts` declara `coverage.thresholds.statements/branches/functions/lines` a nivel global (issue #27)
- [x] `vite.config.ts` declara un threshold más estricto para `src/engine/**` que el default global, vía overrides por-path de Vitest (issue #27)
- [x] `pnpm test:coverage` sale con código no-cero si la cobertura cae debajo del umbral (issue #27)
- [x] Umbrales y su justificación documentados en README o CLAUDE.md (issue #27)

### Non-Functional Requirements

- [x] Los umbrales de cobertura son realistas (basados en la medición actual), no aspiracionales — evita que este cambio rompa el pipeline el mismo día que se introduce
- [x] Biome reemplaza ESLint+Prettier en una sola herramienta (dependencia única, consistente con decisiones KISS existentes del proyecto: Zustand sobre Redux, `index.css` global único)

## Architecture

### Componentes

- **`biome.json`**: config declarativa de lint + format.
- **`vite.config.ts`**: se le agrega el bloque `coverage.thresholds` (global + override `src/engine/**`).
- **`package.json`**: scripts `lint` (reemplaza el actual) y `format:check` (nuevo).
- **`scripts/validate.sh`**: nuevo paso que invoca `pnpm lint`.

### Dependencias externas

- `@biomejs/biome` (devDependency nueva)

### Orden de build

1. #27 (coverage thresholds) es independiente y más pequeño — se implementa primero para no bloquear el trabajo de #26.
2. #26 (Biome) requiere pasar Biome sobre todo `src/` existente y corregir cualquier violación real que aparezca antes de poder poner el gate en verde.

## User Stories

Ver issues #26 y #27 en GitHub (`gh issue view 26`, `gh issue view 27`) — cada uno ya tiene User Story, Technical Context, Acceptance Criteria en Gherkin y Definition of Done. No se reescriben aquí para evitar divergencia entre spec e issue.

## Testing Strategy

- **#26**: los 5 escenarios Gherkin del issue verificados manualmente + vía CI: `pnpm lint` sale 0 sobre el código actual; un archivo con variable no usada hace fallar `pnpm lint`; `pnpm format:check` falla sobre un archivo con comillas/indentación inconsistentes; `pnpm lint` y `pnpm typecheck` invocan binarios distintos.
- **#27**: los 4 escenarios Gherkin del issue verificados: `pnpm test:coverage` pasa con la suite actual; se simula una caída de cobertura (comentando temporalmente un test) para confirmar que el comando sale no-cero; se confirma que un archivo de `src/engine` por debajo de su umbral específico falla aunque el promedio global esté arriba del umbral global.
- **Integration**: correr `scripts/validate.sh` completo al final y confirmar que nada de lo tocado en Fase 2 (Docker, husky, CI) se rompe.

## Boundaries & Constraints

### In Scope

- `biome.json`, cambios a `package.json` (`lint`, `format:check`), `vite.config.ts` (`coverage.thresholds`), `scripts/validate.sh`
- Corregir violaciones de Biome que aparezcan sobre el código existente (necesario para que `pnpm lint` salga en 0, parte del DoD de #26)

### Out of Scope

- Reemplazar Prettier/ESLint si existieran (no existen en este repo, confirmado)
- Subir los umbrales de cobertura escribiendo tests nuevos más allá de lo que ya existe — el umbral se fija en base a la cobertura medida hoy, no se persigue 100%
- Cambiar el job `lint` de `ci.yml` — ya invoca `pnpm run lint`; al cambiar qué hace ese script, el job hereda el comportamiento nuevo sin tocar el workflow

### Technical Constraints

- Biome como único linter/formatter (decisión ya tomada en el issue, consistente con `development-standards.md` §5 citado ahí)
- Vitest/`vite.config.ts` es la única fuente de configuración de cobertura (no se introduce un tool de coverage separado)

## Success Criteria

- [x] Los 2 issues (#26, #27) tienen todos sus escenarios Gherkin verificados
- [x] `pnpm lint` y `pnpm typecheck` son comandos distintos que invocan herramientas distintas
- [x] `pnpm test:coverage` falla si la cobertura cae debajo de los umbrales declarados
- [x] `scripts/validate.sh` sigue pasando de punta a punta con los pasos nuevos incluidos
- [x] Umbrales de cobertura documentados con su justificación

## Implementation Plan

Ver `specs/fase-3-quality-investment-plan.md`.
