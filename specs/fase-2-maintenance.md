---
title: Fase 2 — Mantenimiento que protege la experiencia
status: approved
created: 2026-07-18
updated: 2026-07-18
issue: milestone-2
issues: [29, 34, 31, 33, 35, 30]
---

# Fase 2 — Mantenimiento que protege la experiencia

## Objective

Cerrar los 6 issues del milestone "Fase 2" para que el repo tenga: actualizaciones de dependencias automatizadas (Dependabot), una imagen base de Docker vigente y reproducible (Node 26 + pin por digest), un gate de secretos en el commit local, un pipeline de CI hosteado independiente del hook local, y un gate de Socket Firewall que impida que un PR de Dependabot con una dependencia maliciosa llegue a ser mergeable.

## Context

El repo hoy valida cambios solo vía `.husky/pre-push` y `.husky/pre-merge-commit` corriendo `scripts/validate.sh` (typecheck + tests + build + `pnpm audit`), gateado a `main`/`develop`. No existe `.github/workflows/`, no existe `.github/dependabot.yml`, `.husky/pre-commit` no hace nada (`exit 0` intencional para velocidad), y la imagen base de Docker (`node:24-alpine`) no está pineada por digest. Las 6 user stories de este milestone ya fueron escritas con Gherkin y Definition of Done vía `/user-stories` (ver `gh issue view 29|30|31|33|34|35`) — este spec las consolida como una sola unidad de trabajo para ejecutar en Fase 2 sin reabrir ese detalle.

Nota: los issues referencian dos documentos (`development-standards.md`, `SOCKET_FIREWALL_SETUP.md`) que **no existen en este repo** — se investigó equivalente funcional vía la documentación pública de Socket Firewall y Gitleaks (ver Referencias).

## Requirements

### Functional Requirements

- [ ] `.github/dependabot.yml` con `npm`, `docker`, `github-actions`, intervalo semanal, directorio `/` (issue #29)
- [ ] `Dockerfile` (builder + production) y `Dockerfile.dev` en `node:26-alpine` (issue #34)
- [ ] `Dockerfile` (solo builder + production, no `Dockerfile.dev`) con el tag pineado por `@sha256:<digest>` (issue #31)
- [ ] `.husky/pre-commit` corre `gitleaks protect --staged` y bloquea el commit si hay un secreto (issue #33)
- [ ] `.github/workflows/ci.yml` con jobs independientes y paralelos `lint`, `test`, `typecheck`, `lock-check`, `license-check`, `trivy-fs` en cada push/PR, y `build` gateado a `main` tras `lint`+`test` (issue #35)
- [ ] `.github/workflows/socket-firewall.yml` gateado a `github.actor == 'dependabot[bot]'`, corre `sfw pnpm install`, cierra el PR con comentario si falla (issue #30)

### Non-Functional Requirements

- [ ] Seguridad: toda Action de terceros pineada por commit SHA completo, no por tag flotante (issues #30, #35)
- [ ] Seguridad: cada job/workflow declara el permiso mínimo explícito que necesita, no el default
- [ ] Performance: el scan de secretos en pre-commit corre en menos de 2s sobre un diff típico (issue #33)
- [ ] Reproducibilidad: la imagen de producción es pineada por digest; `Dockerfile.dev` se queda deliberadamente en tag flotante (issue #31)

## Architecture

### Componentes

- **`.github/dependabot.yml`**: config declarativa, sin lógica.
- **`.github/workflows/ci.yml`**: pipeline de CI con 7 jobs (6 en paralelo + 1 gateado).
- **`.github/workflows/socket-firewall.yml`**: workflow de un job, trigger condicional por actor.
- **`Dockerfile` / `Dockerfile.dev`**: cambios de una línea (`FROM`) cada uno.
- **`.husky/pre-commit`**: hook de shell que invoca `gitleaks protect --staged`.

### Dependencias externas

- `gitleaks` (binario, ya instalado localmente en `~/.local/bin/gitleaks`; en CI/otros entornos se instala vía el binario release de `gitleaks/gitleaks`)
- `SocketDev/action` (GitHub Action, modo `firewall-free`) — provee el CLI `sfw`
- `aquasecurity/trivy-action` (GitHub Action) — para el job `trivy-fs`
- `actions/checkout` — checkout en ambos workflows

### Orden de build (dependencias entre issues)

1. #29 (Dependabot) y #34 (Node 26) no tienen dependencias — se pueden hacer en cualquier orden, primero por ser fundacionales.
2. #31 (pin por digest) depende de #34 — pinear el digest de `node:26-alpine`, no `node:24-alpine`, para no pinear y re-pinear.
3. #33 (secret scanning) es independiente.
4. #35 (CI) es independiente.
5. #30 (Socket Firewall) depende conceptualmente de #29 (recién dispara con PRs reales de `dependabot[bot]`), pero se implementa y valida de forma independiente.

## User Stories

Ver los 6 issues de GitHub (milestone "Fase 2 — Mantenimiento que protege la experiencia", `gh issue list --milestone 2`) — cada uno ya tiene User Story, Technical Context, Acceptance Criteria en Gherkin y Definition of Done escritos vía `/user-stories`. No se reescriben aquí para evitar que el spec y los issues diverjan; este documento es el punto de entrada para ejecutar los 6 juntos.

## Testing Strategy

### Validación por issue (Definition of Done ya definido en cada issue)

- **#29**: `.github/dependabot.yml` valida contra el JSON schema público de Dependabot
- **#34**: `docker build` del target `production` corre `typecheck`, tests y `build` dentro del container sin warnings de deprecación nuevos; healthcheck pasa
- **#31**: mismo build que #34, pero con el `FROM` pineado; `Dockerfile.dev` queda sin tocar
- **#33**: commit con secreto de prueba (patrón AWS key) es bloqueado; commit limpio pasa; tiempo < 2s
- **#35**: `actionlint` sobre `ci.yml` con 0 errores; verificación manual de que `build` no corre en PRs a rama no-main y sí corre en push a `main`
- **#30**: `actionlint` sobre `socket-firewall.yml` con 0 errores; dry-run con `act` o rama de prueba para validar el cierre automático

### Integration

Al final de los 6, correr `scripts/validate.sh` completo localmente y confirmar que nada de lo tocado (Dockerfile, husky) rompe el flujo existente.

## Boundaries & Constraints

### In Scope

- Los 6 archivos/configs listados en Functional Requirements

### Out of Scope

- Habilitar branch protection en `main` exigiendo los checks de CI — paso manual de GitHub UI, fuera del DoD de #35 (igual que instalar la Socket Security GitHub App, fuera del DoD de #30)
- Reescribir `.husky/pre-push` / `pre-merge-commit` o `scripts/validate.sh`
- El job `lint` de CI usando un linter real (Biome) — eso es #26, otra fase; hasta entonces duplica `typecheck` a propósito, según nota del propio issue #35
- Crear o modificar `development-standards.md` / `SOCKET_FIREWALL_SETUP.md` (no existen en el repo; no se recrean como parte de esta fase)

### Technical Constraints

- pnpm 11.12.0 (pineado en `package.json`), Node — pasa de 24 a 26 (Current, no LTS hasta oct-2026, tradeoff documentado en #34)
- Todas las Actions de terceros por commit SHA completo

## Success Criteria

- [ ] Los 6 issues (#29, #30, #31, #33, #34, #35) tienen todos sus escenarios Gherkin verificados
- [ ] `docker build` del target `production` pasa con la imagen `node:26-alpine` pineada por digest
- [ ] Un commit con un secreto de prueba es bloqueado localmente en < 2s
- [ ] `.github/workflows/ci.yml` y `.github/workflows/socket-firewall.yml` pasan `actionlint` con 0 errores
- [ ] `scripts/validate.sh` sigue pasando sin cambios de comportamiento

## Implementation Plan

Ver `specs/fase-2-maintenance-plan.md`.

## Referencias

- Socket Firewall Free — Getting started: https://docs.socket.dev/docs/socket-firewall-free
- SocketDev/action (GitHub Action, modo firewall-free): https://github.com/SocketDev/action
- Gitleaks — `protect --staged`: https://github.com/gitleaks/gitleaks
