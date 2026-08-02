# Implementation Plan: Fase 4 — Trabajo interno

**Spec**: [specs/fase-4-internal.md](./fase-4-internal.md)
**Created**: 2026-07-18
**Status**: approved

## Components

### 1. Self-documented Makefile (#28)
- **Purpose**: Interfaz de comandos única, sin memorizar flags de `docker compose`
- **Files**: `Makefile`, `scripts/test-makefile-help.sh`
- **Effort**: S

### 2. CLAUDE.md architecture rewrite (#32)
- **Purpose**: Que un agente o contribuidor nuevo siga las convenciones reales del repo, no una plantilla
- **Files**: `CLAUDE.md`, `scripts/check-claude-md-drift.sh`
- **Effort**: S

## Dependencies

### Build Order

1. **#28** y **#32** son independientes — se implementan en cualquier orden. Se hace primero #28 por ser puramente aditivo (no toca documentación existente que ya se está leyendo en esta misma sesión).

### External Dependencies

Ninguna.

## Risks & Assumptions

### Risks

- **La premisa del issue #32 sobre "no hay CI hosteada" está obsoleta** (ver Context del spec) — mitigado documentando el estado real en vez de seguir el texto del issue al pie de la letra.
- **El Makefile puede comportarse distinto si Docker no está corriendo** al momento de `make test` — mitigación: `test: up-d` como dependencia explícita, tal como pide el DoD.

### Assumptions

- `make` (GNU Make) está disponible en el entorno de desarrollo y en cualquier CI que eventualmente lo use (no se agrega a `ci.yml` en esta fase, fuera de scope)
- El servicio único `app` de `docker-compose.yml` (definido en Fase 2) es estable y no cambia durante esta fase

## Milestones

- [ ] M1: `make help` sin argumentos imprime los 9 targets documentados y nada más
- [ ] M2: `make test` levanta el container si no está corriendo y luego corre la suite
- [ ] M3: `CLAUDE.md` no menciona `api/`/`domain/`/`infrastructure/`/Pydantic; sección Architecture usa un snippet real
- [ ] M4: `scripts/check-claude-md-drift.sh` y `scripts/test-makefile-help.sh` corren en verde desde `scripts/validate.sh`

## Tasks

### Foundation (Build First)

- [ ] **Task 1 — Makefile base (#28)**
  - **Acceptance**: `.DEFAULT_GOAL := help`; target `help` autodescubre todos los targets comentados con `##` vía `grep`/`awk` sobre el propio `Makefile`; targets `up`, `down`, `dev`, `test`, `lint`, `typecheck`, `build`, `validate`, `coverage` presentes; `test` depende de `up-d` (target interno que levanta el container en background si no está corriendo)
  - **Files**: `Makefile`
  - **Tests**: `make help` (inspección manual); `make` sin argumentos (debe imprimir lo mismo que `make help`, nada más)
  - **Effort**: S

- [ ] **Task 2 — Script de verificación de targets (#28)**
  - **Acceptance**: `scripts/test-makefile-help.sh` corre `make help`, verifica que `dev`/`test`/`lint`/`build` (y el resto de los 9) aparecen en la salida; sale no-cero si falta alguno
  - **Files**: `scripts/test-makefile-help.sh`
  - **Tests**: correrlo contra el Makefile de Task 1 (debe pasar); borrar temporalmente un target del Makefile para confirmar que falla, revertir
  - **Effort**: XS

### Features (Build Second)

- [ ] **Task 3 — Reescribir sección Architecture de CLAUDE.md (#32)**
  - **Acceptance**: sección "Architecture and Design Rules" describe `components/` (presentación), `engine/` (lógica pura, ej. `SimulationEngine`), `store/` (Zustand — infraestructura de UI-state, no dominio), `hooks/` (capa de composición); incluye un snippet real citado de un archivo existente; documenta como decisiones deliberadas: CI hosteada existe (con lista breve de qué corre) y tests colocados junto al código fuente; elimina la sección "Adapting This Template" (ya no aplica)
  - **Files**: `CLAUDE.md`
  - **Tests**: los 4 escenarios Gherkin del issue #32, verificados manualmente uno por uno
  - **Effort**: S

- [ ] **Task 4 — Script de drift-guard (#32)**
  - **Acceptance**: `scripts/check-claude-md-drift.sh` extrae los nombres de `scripts` de `package.json` (vía `node -e` o `jq`) y confirma que cada uno aparece como substring en `CLAUDE.md`; sale no-cero listando los que faltan
  - **Files**: `scripts/check-claude-md-drift.sh`
  - **Tests**: correrlo tras Task 3 (debe pasar); agregar temporalmente un script ficticio a `package.json` para confirmar que falla, revertir
  - **Effort**: XS

### Integration (Build Third)

- [ ] **Task 5 — Wire ambos scripts en validate.sh**
  - **Acceptance**: `scripts/validate.sh` corre `scripts/test-makefile-help.sh` y `scripts/check-claude-md-drift.sh` como pasos propios, mismo estilo (echo + check de exit code) que los pasos existentes
  - **Files**: `scripts/validate.sh`
  - **Tests**: correr `scripts/validate.sh` completo de punta a punta
  - **Effort**: XS

## Effort Estimate

**Total**: 2 issues, effort combinado S/S — una sola sesión.
