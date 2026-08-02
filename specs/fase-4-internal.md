---
title: Fase 4 — Trabajo interno
status: approved
created: 2026-07-18
updated: 2026-07-18
issue: milestone-4
issues: [28, 32]
---

# Fase 4 — Trabajo interno

## Objective

Cerrar los 2 issues del milestone "Fase 4" para que el repo tenga un `Makefile` autodocumentado como interfaz de comandos única, y un `CLAUDE.md` cuya sección de arquitectura describa la estructura real de este proyecto en vez de un template genérico de Pydantic/hexagonal que no aplica.

## Context

No existe `Makefile` hoy; los puntos de entrada están dispersos entre la tabla de scripts del README y comandos crudos de `docker compose`. `CLAUDE.md` §"Architecture and Design Rules" es boilerplate verbatim de la plantilla (`api/`/`domain/`/`infrastructure/`, ejemplo con Pydantic) y no refleja el árbol real de `src/` (`components/`, `engine/`, `hooks/`, `store/`, `data/`, `utils/`).

**Corrección de premisa respecto al issue #32**: el cuerpo del issue pide documentar como decisión deliberada que el repo "no tiene CI hosteada (hasta que la US #5 shippee)". Esa premisa ya no es cierta: el commit `b466429` ("ci: add Dependabot, hosted CI pipeline, and Socket Firewall gate", parte de Fase 2 / issue #35) agregó `.github/workflows/ci.yml` con jobs `lint`/`test`/`typecheck`/`lock-check`/`license-check`/`trivy-fs`/`build`. Documentar "no hay CI" sería escribir una falsedad verificable con `ls .github/workflows/`. Este spec ajusta el alcance de #32: en vez de esa nota, CLAUDE.md documenta que CI hosteada **sí existe** y describe brevemente qué corre, y mantiene la nota real que sigue siendo cierta hoy — tests colocados junto al código fuente (`*.test.ts(x)` junto a cada componente) en vez de un árbol `tests/` separado.

## Requirements

### Functional Requirements

- [ ] `Makefile` en la raíz con `.DEFAULT_GOAL := help` (issue #28)
- [ ] Cada target comentado con `##` para autodescubrimiento vía `make help` (issue #28)
- [ ] Targets que necesitan el servicio corriendo declaran la dependencia (ej. `test: up-d`) (issue #28)
- [ ] Targets mínimos: `up`, `down`, `dev`, `test`, `lint`, `typecheck`, `build`, `validate`, `coverage` (issue #28)
- [ ] Script de prueba que corre `make help` y afirma que cada target documentado aparece en la salida, invocado desde `scripts/validate.sh` (issue #28)
- [ ] Sección "Architecture and Design Rules" de `CLAUDE.md` reescrita con la estructura real (`components/`, `engine/`, `store/`, `hooks/`, `data/`, `utils/`) (issue #32)
- [ ] Al menos un snippet de código en esa sección viene de un archivo real del repo, no del ejemplo genérico (issue #32)
- [ ] Decisiones deliberadas documentadas explícitamente con su razón: CI hosteada existe (corrección de premisa, ver Context) y tests colocados junto al código fuente (issue #32)
- [ ] Sección de stack/comandos de `CLAUDE.md` solo lista comandos que existen en `package.json` (issue #32)
- [ ] Script que hace grep de los nombres de script de `package.json` y afirma que cada uno se menciona en `CLAUDE.md`, para prevenir drift futuro (issue #32)

### Non-Functional Requirements

- [ ] `make` sin argumentos no ejecuta ninguna otra acción además de mostrar el help (issue #28)
- [ ] El Makefile no duplica lógica — cada target es un wrapper delgado sobre `docker compose` o `pnpm`, consistente con KISS

## Architecture

### Componentes

- **`Makefile`**: interfaz de comandos, wrappers sobre `docker compose exec/run` y `pnpm`.
- **`scripts/test-makefile-help.sh`** (nuevo): script de verificación de que `make help` lista todos los targets documentados.
- **`scripts/check-claude-md-drift.sh`** (nuevo): script de verificación de que cada script de `package.json` se menciona en `CLAUDE.md`.
- **`CLAUDE.md`**: sección "Architecture and Design Rules" reescrita.

### Dependencias externas

Ninguna nueva — `Makefile` usa `make` (ya disponible en el entorno de desarrollo) y los scripts de verificación son `bash` puro.

### Orden de build

1. #28 (Makefile) y #32 (CLAUDE.md) son independientes entre sí — sin dependencias cruzadas.
2. Dentro de #32, la corrección de premisa sobre CI (ver Context) debe resolverse antes de escribir el texto final, no después.

## User Stories

Ver issues #28 y #32 en GitHub (`gh issue view 28`, `gh issue view 32`). No se reescriben aquí para evitar divergencia; este spec documenta la corrección de premisa sobre CI que no está en el issue original.

## Testing Strategy

- **#28**: los 4 escenarios Gherkin (incluyendo el Scenario Outline con `dev`/`test`/`lint`/`build`) verificados vía `scripts/test-makefile-help.sh` corriendo `make help` y buscando cada target; `make test` verificado manualmente contra un container detenido para confirmar que lo levanta primero.
- **#32**: los 4 escenarios Gherkin verificados: inspección de que la sección Architecture menciona `components/`/`engine/`/`store/`/`hooks/` y no `api/`/`domain/`/`infrastructure/`/Pydantic; el snippet de código se contrasta contra el archivo real citado; `scripts/check-claude-md-drift.sh` corre en verde.
- **Integration**: ambos scripts de verificación nuevos se agregan como pasos de `scripts/validate.sh`; correr el script completo al final.

## Boundaries & Constraints

### In Scope

- `Makefile`, `scripts/test-makefile-help.sh`, `scripts/check-claude-md-drift.sh`, reescritura de la sección Architecture de `CLAUDE.md`, wiring de ambos scripts nuevos en `scripts/validate.sh`

### Out of Scope

- Reescribir el resto de `CLAUDE.md` (skills, memory protocol, workflow) — solo la sección "Architecture and Design Rules" y "Adapting This Template" (que deja de aplicar una vez que el archivo ya no es un template)
- Agregar targets de Makefile más allá de los 9 listados en el issue
- Actualizar el README para referenciar el Makefile — no está en el DoD de #28, aunque queda como oportunidad futura

### Technical Constraints

- El Makefile debe funcionar con el `docker-compose.yml` existente (servicio único `app`, `command: sleep infinity`) — los targets usan `docker compose exec app <cmd>` para lo que corre dentro del container y `docker compose up -d`/`down` para el ciclo de vida

## Success Criteria

- [ ] Los 2 issues (#28, #32) tienen todos sus escenarios Gherkin verificados
- [ ] `make help` sin argumentos lista los 9 targets documentados con su descripción y no ejecuta nada más
- [ ] `CLAUDE.md` no menciona `api/`/`domain/`/`infrastructure/` ni el ejemplo de Pydantic
- [ ] `scripts/check-claude-md-drift.sh` pasa en verde
- [ ] `scripts/validate.sh` sigue pasando de punta a punta con los pasos nuevos incluidos

## Implementation Plan

Ver `specs/fase-4-internal-plan.md`.
