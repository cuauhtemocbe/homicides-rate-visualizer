# 🌑 MX Security What-If Simulator

_Un simulador interactivo en dark mode para analizar escenarios hipotéticos de homicidios en México (2000-2026)._

---

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)
![Dark Mode](https://img.shields.io/badge/Theme-Dark_Mode-black)
![Licencia](https://img.shields.io/badge/license-MIT-green)

---

## 🌐 Demo

![MX Security What-If Simulator Screenshot](./docs/screenshot-dark.png)

_Dualidad visual: Realidad histórica vs Simulación What-If_

---

## ✨ Características

- **🌑 Dark Mode Nativo**: Interfaz oscura optimizada (#121212, #1E1E1E)
- **📊 Comparación Visual**: Gráfico de líneas comparando Real vs What-If
- **🎰 Sistema de Slots**: 4 slots configurables para reordenar presidentes
- **🔢 Motor de Cascada**: Algoritmo matemático $V_{final} = V_{anterior} \times (1 + TC)$
- **📈 Datos Oficiales**: INEGI, SESNSP, World Bank
- **⚡ Performance**: Renderizado <1s, interacciones <100ms
- **📱 Responsive**: Mobile-first design

---

## 🎯 ¿Qué hace?

El simulador permite responder preguntas "What-If" sobre homicidios en México:

- ¿Qué habría pasado si AMLO hubiera gobernado en lugar de Calderón?
- ¿Cómo se verían los números con 4 sexenios de Peña Nieto?
- ¿Qué efecto tendría repetir el comportamiento de Fox 5 veces?

---

## 🧮 Algoritmo de Cascada

El motor usa una **lógica de cascada acumulativa**:

```
Slot 0 (Fijo): Fox → 10,452 homicidios

Slot 1: [Presidente seleccionado]
  Valor = 10,452 × Multiplicador₁

Slot 2: [Presidente seleccionado]
  Valor = Valor₁ × Multiplicador₂

Slot 3: [Presidente seleccionado]
  Valor = Valor₂ × Multiplicador₃

Slot 4: [Presidente seleccionado]
  Valor = Valor₃ × Multiplicador₄
```

### Tabla de Multiplicadores

| Presidente       | Tasa de Crecimiento | Multiplicador | Cierre Oficial |
|------------------|---------------------|---------------|----------------|
| V. Fox           | +1.6%               | 1.016         | 10,452         |
| F. Calderón      | +148.4%             | 2.484         | 25,967         |
| E. Peña Nieto    | +41.3%              | 1.413         | 36,685         |
| AMLO             | -18.9%              | 0.811         | 29,741         |
| C. Sheinbaum*    | -31.0%              | 0.690         | 20,536         |

_*Datos proyectados con base en tendencia observada hasta mayo 2026_

---

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) 18+ o [Bun](https://bun.sh/)
- [pnpm](https://pnpm.io/) (recomendado) o npm

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/username/mx-security-dark-sim.git
cd mx-security-dark-sim

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173/`

---

## ⚡ Scripts Disponibles

### 🚀 Desarrollo

| Script               | Descripción                                          |
|----------------------|------------------------------------------------------|
| `pnpm dev`           | Inicia servidor de desarrollo en http://localhost:5173 |
| `pnpm start:dev`     | Inicia servidor de desarrollo y abre navegador automáticamente |
| `pnpm preview`       | Previsualiza el build de producción localmente      |

### 🏗️ Build y Validación

| Script               | Descripción                                          |
|----------------------|------------------------------------------------------|
| `pnpm build`         | Compila TypeScript y construye para producción      |
| `pnpm typecheck`     | Verifica tipos de TypeScript sin generar archivos   |
| `pnpm lint`          | Ejecuta linter de TypeScript                         |
| `pnpm validate`      | Ejecuta todas las validaciones (typecheck + tests + build) |

### 🧪 Testing

| Script               | Descripción                                          |
|----------------------|------------------------------------------------------|
| `pnpm test`          | Ejecuta pruebas en modo watch (reinicia al cambiar archivos) |
| `pnpm test:run`      | Ejecuta pruebas una sola vez (para CI/CD)           |
| `pnpm test:watch`    | Alias de `pnpm test` (modo watch explícito)         |
| `pnpm test:coverage` | Ejecuta pruebas y genera reporte de cobertura       |
| `pnpm test:ui`       | Abre interfaz gráfica de Vitest en el navegador     |

### 🧹 Limpieza

| Script               | Descripción                                          |
|----------------------|------------------------------------------------------|
| `pnpm clean`         | Limpia build artifacts (dist/, cache de Vite)       |
| `pnpm clean:all`     | Limpia todo incluyendo node_modules y pnpm store    |

### 📋 Comandos Útiles Frecuentes

```bash
# Desarrollo diario
pnpm start:dev                    # Inicia dev server con navegador

# Antes de commit
pnpm validate                     # Valida typecheck + tests + build

# Testing con coverage
pnpm test:coverage                # Ver cobertura de tests
pnpm test:ui                      # Debuggear tests visualmente

# Limpieza y reinstalación
pnpm clean:all && pnpm install    # Reinstalación completa

# Verificar build de producción
pnpm build && pnpm preview        # Build + preview local
```

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── DualChart/              # Componentes de gráficas
│   │   ├── DualChart.tsx       # Contenedor principal
│   │   └── ComparisonChart.tsx # Gráfica de comparación (Real vs What-If)
│   ├── SimulationControls/     # Controles de simulación
│   │   ├── SimulationControls.tsx
│   │   └── PresidentSlot.tsx   # Selector individual
│   ├── MetricsPanel/           # Panel de métricas
│   │   └── MetricsPanel.tsx
│   └── DataSourceFooter/       # Footer con fuentes
│       └── DataSourceFooter.tsx
├── data/
│   ├── presidentes.data.ts     # Datos de presidentes
│   ├── historico.data.ts       # Datos históricos reales
│   └── types.ts                # TypeScript interfaces
├── engine/
│   ├── SimulationEngine.ts     # Motor de simulación
│   └── SimulationEngine.test.ts
├── store/
│   └── useSimulationStore.ts   # Zustand store (estado global)
├── hooks/
│   └── useChartColors.ts       # Hook de colores dark mode
└── App.tsx                      # Componente principal
```

---

## 🧪 Testing

```bash
# Tests unitarios
pnpm test:run

# Tests con coverage
pnpm test:coverage

# Tests en modo watch
pnpm test
```

**Coverage Gate** (enforced in `vite.config.ts` — `pnpm test:coverage` fails below these):
- Global: 85% statements / 75% branches / 85% functions / 85% lines
- `src/engine/**` (lógica de negocio pura, ej. `SimulationEngine`): 100% statements / functions / lines

Los umbrales globales se fijaron unos puntos por debajo del baseline medido (90.36% stmts / 80.71% branches / 89.62% funcs / 92.59% lines al 2026-07-18) para dejar margen sin volverse aspiracionales. `src/engine/` lleva un umbral más alto que el resto por ser lógica de negocio pura sin dependencias de UI — ya está en 100% hoy y debe mantenerse así.

---

## 🎨 Diseño y UX

### Paleta de Colores

- **Fondo**: `#121212`
- **Cards**: `#1E1E1E`
- **Texto**: `#E0E0E0`
- **Rojo (Crecimiento)**: `#EF4444`
- **Verde (Reducción)**: `#10B981`
- **Acento**: `#3B82F6`

### Filosofía de Diseño

- **Dark/Light Mode**: Toggle de tema oscuro y claro
- **Comparación Visual**: Real vs What-If en un solo gráfico de líneas
- **Interactividad Rápida**: Cambios de slot en <100ms
- **Transparencia**: Fuentes oficiales visibles en footer

---

## 📊 Fuentes de Datos

Los datos provienen de fuentes oficiales:

- **INEGI**: Instituto Nacional de Estadística y Geografía
- **SESNSP**: Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública
- **World Bank**: Banco Mundial
- **Estudios Académicos**: Referencias verificadas en Wikipedia

> **Nota sobre Proyecciones**: Los datos de la administración de Claudia Sheinbaum (2024-2030) están **proyectados** con base en la tendencia de reducción del -31% observada hasta mayo de 2026. Estos valores son estimaciones sujetas a cambios.

---

## 🛠️ Stack Tecnológico

- **Framework**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **State Management**: Zustand 4
- **Gráficas**: Recharts 2
- **Styling**: Tailwind CSS 3
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm ([¿Por qué pnpm?](./docs/PNPM.md))

---

## 🚢 Deployment

### Railway (Recomendado)

```bash
# Build
pnpm build

# El contenido de dist/ es servido como sitio estático
```

Railway detecta automáticamente el proyecto Vite y lo despliega.

### Otros Providers

Compatible con: Vercel, Netlify, GitHub Pages, Cloudflare Pages

---

## 🤝 Contribuir

`main` tiene branch protection: un PR no es mergeable si `lint`, `test`, `typecheck`, `lock-check`, `license-check` o `trivy-fs` fallan en CI (`.github/workflows/ci.yml`). `enforce_admins` está deliberadamente en `false` — el owner del repo puede saltarse el gate en un push/merge directo si hace falta, en vez de quedar bloqueado igual que cualquier otro colaborador.

1. Fork el repositorio
2. Crea una rama de feature (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios
4. Ejecuta tests (`pnpm test:run`)
5. Verifica types (`pnpm typecheck`)
6. Commit (`git commit -m 'Add amazing feature'`)
7. Push (`git push origin feature/amazing-feature`)
8. Abre un Pull Request

---

## 📜 Licencia

Este proyecto está disponible bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **INEGI, SESNSP, World Bank**: Por los datos oficiales
- **Comunidad Open Source**: Por las herramientas increíbles

---

## 📞 Contacto

- **Issues**: [GitHub Issues](https://github.com/username/mx-security-dark-sim/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/mx-security-dark-sim/discussions)

---

**Hecho con ❤️ y datos oficiales | Dark Mode 🌑**
