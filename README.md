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
- **📊 Dualidad Visual**: Dos gráficas lado a lado (Real vs What-If)
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
| F. Calderón      | +192.8%             | 2.928         | 25,967         |
| E. Peña Nieto    | +59.0%              | 1.59          | 36,685         |
| AMLO             | -22.0%              | 0.78          | 29,741         |
| C. Sheinbaum*    | -31.0%              | 0.69          | 20,536         |

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

| Script               | Descripción                                   |
|----------------------|-----------------------------------------------|
| `pnpm dev`           | Inicia el servidor de desarrollo (Vite)       |
| `pnpm build`         | Construye para producción                     |
| `pnpm typecheck`     | Revisa los tipos de TypeScript                |
| `pnpm test`          | Ejecuta pruebas en modo watch                 |
| `pnpm test:run`      | Ejecuta pruebas una sola vez                  |
| `pnpm test:coverage` | Ejecuta pruebas con cobertura                 |
| `pnpm preview`       | Previsualiza el build de producción           |

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── DualChart/              # Componentes de gráficas
│   │   ├── DualChart.tsx       # Contenedor principal
│   │   ├── RealChart.tsx       # Gráfica de realidad histórica
│   │   └── WhatIfChart.tsx     # Gráfica de simulación
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

**Coverage Targets**:
- SimulationEngine: >95%
- Componentes: >80%

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

- **Dark Mode Nativo**: No hay opción de light mode
- **Dualidad Visual**: Real vs What-If siempre visible
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
- **Package Manager**: pnpm

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
