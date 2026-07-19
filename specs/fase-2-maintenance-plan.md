# Implementation Plan: Fase 2 — Mantenimiento que protege la experiencia

**Spec**: [specs/fase-2-maintenance.md](./fase-2-maintenance.md)
**Created**: 2026-07-18
**Status**: approved

## Components

### 1. Dependabot config (#29)
- **Purpose**: PRs automáticos de dependencias desactualizadas/vulnerables
- **Files**: `.github/dependabot.yml`
- **Effort**: XS

### 2. Node 26 upgrade (#34)
- **Purpose**: Runtime vigente con parches de seguridad/performance
- **Files**: `Dockerfile`, `Dockerfile.dev`
- **Effort**: S

### 3. Digest pin (#31)
- **Purpose**: Build reproducible, sin repoint silencioso de la tag
- **Files**: `Dockerfile`
- **Effort**: XS

### 4. Secret scanning pre-commit (#33)
- **Purpose**: Bloquear un secreto antes de que entre al historial de git
- **Files**: `.husky/pre-commit`, `.gitleaks.toml` (solo si hace falta allowlisting)
- **Effort**: S

### 5. Hosted CI pipeline (#35)
- **Purpose**: Gate independiente del hook local, corre siempre (no depende de que el contribuidor tenga husky instalado)
- **Files**: `.github/workflows/ci.yml`
- **Effort**: M

### 6. Socket Firewall gate (#30)
- **Purpose**: Auto-cerrar un PR de Dependabot con una dependencia maliciosa confirmada
- **Files**: `.github/workflows/socket-firewall.yml`
- **Effort**: M

## Dependencies

### Build Order

1. **#29** Dependabot config — fundacional, sin dependencias
2. **#34** Node 26 upgrade — fundacional, sin dependencias
3. **#31** Digest pin — depende de #34 (pinear `node:26-alpine`, no `node:24-alpine`)
4. **#33** Secret scanning — independiente
5. **#35** CI pipeline — independiente
6. **#30** Socket Firewall — depende conceptualmente de #29 (dispara con PRs reales de `dependabot[bot]`), implementación independiente

### External Dependencies

- `gitleaks/gitleaks` binario — ya instalado localmente (`~/.local/bin/gitleaks`); no se agrega a `package.json` (es un binario de sistema, no un paquete npm)
- `SocketDev/action@ba6de6cc0565af1f42295590380973573297e31f` (`v1.3.2`), modo `firewall-free`
- `aquasecurity/trivy-action@ed142fd0673e97e23eac54620cfb913e5ce36c25` (`v0.36.0`)
- `actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` (`v7.0.0`)

SHAs resueltos vía `gh api repos/<org>/<repo>/tags` el 2026-07-18; re-verificar si este plan se reusa mucho después.

## Risks & Assumptions

### Risks

- **Node 26 no es LTS todavía** (LTS esperado oct-2026). Mitigación: es un tradeoff documentado explícitamente en #34, no un error — se acepta runtime freshness sobre ventana de soporte LTS.
- **`sfw pnpm install` en un entorno real puede comportarse distinto a lo documentado** (el CLI es relativamente nuevo). Mitigación: el DoD de #30 ya exige validar con `act` o una rama de prueba, no solo `actionlint`.
- **`development-standards.md` y `SOCKET_FIREWALL_SETUP.md` referenciados en los issues no existen en el repo** — se resolvió con la doc pública de Socket y Gitleaks; no se recrean esos documentos (fuera de scope, ver spec).

### Assumptions

- Docker Desktop/Engine local disponible para validar el build de producción (confirmado: Docker 29.6.2)
- `gitleaks` global es aceptable para el hook (no se vendoriza el binario en el repo)
- No hace falta pipear a un registry de contenedores en `ci.yml`: el job `build` gateado a `main` corre `pnpm run build` (Vite), no `docker build` — coherente con que este repo no tiene hoy un paso de publish de imagen

## Milestones

- [ ] M1: Dependabot + Node 26 + digest pin mergeables y el `docker build` de producción pasa (checkpoint de infra base)
- [ ] M2: Secret scanning bloquea un secreto de prueba localmente
- [ ] M3: `ci.yml` pasa `actionlint` y corre en un push de prueba con los 6 jobs paralelos + build gateado
- [ ] M4: `socket-firewall.yml` pasa `actionlint` y su lógica condicional se valida

## Tasks

### Foundation (Build First)

- [ ] **Task 1 — Enable Dependabot (#29)**
  - **Acceptance**: `.github/dependabot.yml` válido contra el schema de Dependabot; entries `npm`/`docker`/`github-actions`, `directory: "/"`, `schedule.interval: weekly`
  - **Files**: `.github/dependabot.yml`
  - **Tests**: `check-jsonschema --builtin-schema vendor.github-dependabot .github/dependabot.yml` (o equivalente disponible)
  - **Effort**: XS

- [ ] **Task 2 — Node 26 upgrade (#34)**
  - **Acceptance**: los 3 `FROM` (builder, production, dev) referencian `node:26-alpine`; `docker build --target production` corre typecheck+tests+build sin error; healthcheck pasa
  - **Files**: `Dockerfile`, `Dockerfile.dev`
  - **Tests**: `docker build --target production -t homicides-rate-visualizer:test .` + `docker run` con curl al healthcheck
  - **Effort**: S

- [ ] **Task 3 — Digest pin (#31)**
  - **Acceptance**: `Dockerfile` builder+production referencian `node:26-alpine@sha256:<digest>`; `Dockerfile.dev` sigue en tag flotante sin cambios
  - **Files**: `Dockerfile`
  - **Tests**: mismo build de Task 2, más `diff` de `Dockerfile.dev` mostrando 0 cambios
  - **Effort**: XS

### Features (Build Second)

- [ ] **Task 4 — Secret scanning pre-commit (#33)**
  - **Acceptance**: `.husky/pre-commit` corre `gitleaks protect --staged`; bloquea un secreto de prueba, no bloquea un diff limpio, no escanea archivos fuera del staged, corre en < 2s
  - **Files**: `.husky/pre-commit`
  - **Tests**: commit de prueba con un patrón tipo AWS key (`AKIA[0-9A-Z]{16}`) en un archivo staged → rechazado; commit limpio → pasa; medir tiempo con `time git commit`
  - **Effort**: S

- [ ] **Task 5 — Hosted CI pipeline (#35)**
  - **Acceptance**: los 7 escenarios Gherkin del issue pasan; `actionlint` 0 errores; jobs `lint`/`test`/`typecheck`/`lock-check`/`license-check`/`trivy-fs` corren en paralelo en push/PR; `build` solo en push a `main` tras `lint`+`test`
  - **Files**: `.github/workflows/ci.yml`
  - **Tests**: `actionlint .github/workflows/ci.yml`; inspección manual de cada `uses:`/`permissions:`
  - **Effort**: M

### Integration (Build Third)

- [ ] **Task 6 — Socket Firewall gate (#30)**
  - **Acceptance**: los 5 escenarios Gherkin del issue pasan; `actionlint` 0 errores; `if: github.actor == 'dependabot[bot]'`; `permissions: pull-requests: write` explícito y nada más
  - **Files**: `.github/workflows/socket-firewall.yml`
  - **Tests**: `actionlint .github/workflows/socket-firewall.yml`; validación de la lógica condicional (documentar método usado, ya que un dry-run completo con `act` requiere más setup)
  - **Effort**: M

## Effort Estimate

| Fase | Effort |
|------|--------|
| Foundation (Tasks 1-3) | XS + S + XS |
| Features (Task 4-5) | S + M |
| Integration (Task 6) | M |

Total: 6 issues, effort combinado S/M — se ejecuta en una sola sesión.
