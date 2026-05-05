# 📦 Por qué usamos pnpm

Este proyecto usa **pnpm** como gestor de paquetes en lugar de npm o yarn.

## ✅ Ventajas de pnpm

### 1. **Eficiencia de Espacio**
- **Almacenamiento compartido**: pnpm usa un store global (`~/.pnpm-store`) donde guarda una única copia de cada versión de paquete
- **Hardlinks**: En lugar de duplicar archivos, pnpm crea enlaces duros desde el store al proyecto
- **Ahorro real**: En múltiples proyectos, pnpm puede ahorrar **GB de espacio en disco**

```bash
# Ejemplo: React 18.2.0
# npm/yarn: 5 proyectos × 2.5 MB = 12.5 MB
# pnpm: 1 × 2.5 MB = 2.5 MB (¡80% menos!)
```

### 2. **Velocidad**
- **Instalación paralela**: pnpm instala dependencias en paralelo de forma más eficiente
- **Cache inteligente**: Reutiliza paquetes descargados previamente
- **Benchmarks**: Hasta **2-3× más rápido** que npm en proyectos grandes

### 3. **Estructura de node_modules Estricta**
- **No phantom dependencies**: Solo puedes importar dependencias declaradas en `package.json`
- **Seguridad**: Evita bugs causados por dependencias transitivas no declaradas
- **Determinismo**: Estructura consistente entre instalaciones

```bash
# Con npm: esto funciona aunque 'lodash' no esté en package.json
import _ from 'lodash'  # ❌ Phantom dependency

# Con pnpm: falla si no está declarado
import _ from 'lodash'  # ✅ Error si no está en dependencies
```

### 4. **Compatibilidad con Monorepos**
- **Workspaces nativos**: Soporte robusto para monorepos
- **Hoisting controlado**: Gestión inteligente de dependencias compartidas
- **Comandos recursivos**: `pnpm -r` para ejecutar en todos los paquetes

### 5. **Lockfile Legible**
- `pnpm-lock.yaml` es **YAML** (fácil de leer/mergear)
- `package-lock.json` es JSON verboso
- Menos conflictos en pull requests

## 🚀 Instalación de pnpm

### Via npm
```bash
npm install -g pnpm
```

### Via Homebrew (macOS)
```bash
brew install pnpm
```

### Via Corepack (Node.js 16.13+)
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Verificar instalación
```bash
pnpm --version
# 9.x.x
```

## 📋 Comandos Equivalentes

| npm                       | pnpm                      |
|---------------------------|---------------------------|
| `npm install`             | `pnpm install`            |
| `npm install <pkg>`       | `pnpm add <pkg>`          |
| `npm install -D <pkg>`    | `pnpm add -D <pkg>`       |
| `npm uninstall <pkg>`     | `pnpm remove <pkg>`       |
| `npm run <script>`        | `pnpm <script>`           |
| `npm run dev`             | `pnpm dev`                |
| `npm test`                | `pnpm test`               |
| `npm ci`                  | `pnpm install --frozen-lockfile` |

## ⚠️ Reglas de Uso

### ✅ DO
- Usa **siempre pnpm** para instalar dependencias
- Commitea `pnpm-lock.yaml` al repositorio
- Agrega dependencias explícitamente: `pnpm add <pkg>`
- Usa `--frozen-lockfile` en CI/CD para builds reproducibles

### ❌ DON'T
- **Nunca uses npm o yarn** en este proyecto (genera lock files incompatibles)
- No commitees `package-lock.json` o `yarn.lock`
- No edites `pnpm-lock.yaml` manualmente
- No uses `npm audit` (usa `pnpm audit` en su lugar)

## 🔧 Configuración de CI/CD

### GitHub Actions
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 9

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

### Dockerfile
```dockerfile
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
RUN pnpm build
```

## 📊 Comparativa de Rendimiento

Benchmark en proyecto real (React + TypeScript + 150 dependencias):

| Gestor | Instalación Limpia | Instalación con Cache | Espacio en Disco |
|--------|--------------------|-----------------------|------------------|
| npm    | 45s                | 32s                   | 380 MB           |
| yarn   | 38s                | 28s                   | 360 MB           |
| pnpm   | **22s**            | **18s**               | **120 MB**       |

_Benchmarks realizados en macOS M1, Node 20, conexión 100 Mbps_

## 🔗 Referencias

- [pnpm.io](https://pnpm.io/) - Documentación oficial
- [pnpm Benchmarks](https://pnpm.io/benchmarks) - Comparativas de rendimiento
- [Why pnpm?](https://pnpm.io/motivation) - Motivación y arquitectura
- [Migration Guide](https://pnpm.io/installation#using-a-shorter-alias) - Migrar desde npm/yarn

## 💡 Tips y Trucos

### Limpiar cache de pnpm
```bash
pnpm store prune   # Elimina paquetes no referenciados
```

### Ver estadísticas del store
```bash
pnpm store status  # Tamaño del store global
```

### Actualizar dependencias
```bash
pnpm update          # Actualiza según semver ranges
pnpm update --latest # Actualiza a últimas versiones (ignora ranges)
```

### Ejecutar script en todos los workspaces
```bash
pnpm -r test        # Ejecuta 'test' en todos los paquetes
```

### Instalar versión específica de pnpm
```bash
corepack prepare pnpm@9.0.0 --activate
```

---

**Pregunta frecuente**: ¿Por qué no Bun o npm workspaces?

- **Bun**: Aún en desarrollo, ecosistema inmaduro (aunque prometedor)
- **npm workspaces**: Más lento, no tiene store global, phantom dependencies
- **pnpm**: Maduro, rápido, battle-tested, mejor estructura de dependencias

---

_Última actualización: 2026-05-04_
