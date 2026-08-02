# Implementation Plan: Fase 3 — Inversión en calidad

**Spec**: [specs/fase-3-quality-investment.md](./fase-3-quality-investment.md)
**Created**: 2026-07-18
**Status**: completed

## Components

### 1. Coverage thresholds (#27)
- **Purpose**: Falla el build cuando la cobertura cae, en vez de solo reportarla
- **Files**: `vite.config.ts`, README.md (o CLAUDE.md) para documentar los números
- **Effort**: S

### 2. Biome linter + formatter (#26)
- **Purpose**: Linting real, separado del type checking
- **Files**: `biome.json`, `package.json`, `scripts/validate.sh`
- **Effort**: M

## Dependencies

### Build Order

1. **#27** Coverage thresholds — independiente, se hace primero por ser más chico
2. **#26** Biome — requiere instalar la dependencia, correrla sobre todo `src/`, y corregir cualquier violación real antes de que el gate quede en verde

### External Dependencies

- `@biomejs/biome` (última versión estable en npm al momento de implementar)

## Risks & Assumptions

### Risks

- **Biome puede reportar violaciones reales sobre código existente** (unused vars, imports, etc.) que hoy pasan desapercibidas porque `tsc --noEmit` no las detecta. Mitigación: correr `biome check` primero en modo de solo lectura, triage manual, corregir antes de wire-earlo a CI.
- **Umbrales de cobertura demasiado ajustados generan flakiness** si un test se salta por env (jsdom, timing). Mitigación: fijar el umbral global unos puntos por debajo del baseline medido (90.36/80.71/89.62/92.59), no exactamente en el número actual.

### Assumptions

- No hay `.eslintrc`/`prettier.config.*` ocultos en subdirectorios que entren en conflicto con Biome (se verificó: no existen)
- El override por-path de Vitest (`coverage.thresholds["src/engine/**"]`) es soportado por la versión de Vitest en `package.json` (`^4.1.10`) — verificar contra la documentación de Vitest 4 antes de escribir la config

## Milestones

- [x] M1: `vite.config.ts` con thresholds; `pnpm test:coverage` pasa en verde con la suite actual
- [x] M2: `pnpm test:coverage` falla deliberadamente al simular una caída de cobertura (prueba manual, revertida después)
- [x] M3: `biome.json` committeado; `pnpm lint` sale 0 sobre el código actual
- [x] M4: `scripts/validate.sh` corre `pnpm lint` como paso propio y falla el push si lint falla

## Tasks

### Foundation (Build First)

- [x] **Task 1 — Coverage thresholds (#27)**
  - **Acceptance**: `vite.config.ts` declara `coverage.thresholds` global (por debajo del baseline medido) y un override más estricto para `src/engine/**`; los 4 escenarios Gherkin del issue pasan
  - **Files**: `vite.config.ts`
  - **Tests**: `pnpm test:coverage` (debe pasar); prueba manual temporal bajando cobertura para confirmar que falla; revertir la prueba manual
  - **Effort**: S

- [x] **Task 2 — Documentar umbrales (#27)**
  - **Acceptance**: README o CLAUDE.md documenta los números elegidos y el porqué (baseline medido, diferenciación engine vs. resto)
  - **Files**: README.md o CLAUDE.md
  - **Tests**: revisión manual de que los números documentados coinciden con `vite.config.ts`
  - **Effort**: XS

### Features (Build Second)

- [x] **Task 3 — Instalar y configurar Biome (#26)**
  - **Acceptance**: `biome.json` con ruleset explícito; `pnpm lint` invoca `biome check`, no `tsc`
  - **Files**: `biome.json`, `package.json`
  - **Tests**: `pnpm lint` corre sin crashear (puede reportar violaciones en este punto, se corrigen en Task 4)
  - **Effort**: S

- [x] **Task 4 — Corregir violaciones existentes y verificar los 5 escenarios Gherkin (#26)**
  - **Acceptance**: `pnpm lint` sale 0 sobre todo `src/`; `pnpm format:check` existe y falla sobre formato inconsistente; una variable no usada de prueba hace fallar el lint; `pnpm lint` y `pnpm typecheck` invocan binarios distintos
  - **Files**: `package.json` (`format:check`), cualquier archivo de `src/` con violaciones reales
  - **Tests**: los 5 escenarios Gherkin del issue #26, verificados uno por uno
  - **Effort**: M

### Integration (Build Third)

- [x] **Task 5 — Wire lint en validate.sh (#26)**
  - **Acceptance**: `scripts/validate.sh` corre `pnpm lint` como paso propio (con su propio echo/check, igual estilo que typecheck/test/build existentes) y falla el script si lint falla
  - **Files**: `scripts/validate.sh`
  - **Tests**: correr `scripts/validate.sh` completo; romper temporalmente el lint para confirmar que el script sale no-cero, revertir
  - **Effort**: XS

## Effort Estimate

**Total**: 2 issues, effort combinado S/M — una sola sesión.
