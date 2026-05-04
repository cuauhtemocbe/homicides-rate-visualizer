# Implementation Plan: Homicide Growth Analyzer

**Spec**: `specs/homicide-growth-analyzer.md`  
**Created**: 2026-05-03  
**Status**: draft

## Build Order

### Phase 1: Foundation (Build First)
1. **Data Layer** - Hardcoded data structures
2. **Business Logic** - Core calculations
3. **State Management** - Zustand store

### Phase 2: Visualization (Build Second)
4. **Chart Component** - Recharts time series
5. **Tooltip Component** - Interactive data display

### Phase 3: Simulation (Build Third)
6. **Simulation Controls** - UI for selecting periods/admins
7. **Simulation Engine** - Growth rate swapping logic

### Phase 4: Polish (Build Last)
8. **Responsive Design** - Mobile-first styling
9. **Accessibility** - WCAG 2.1 AA compliance

---

## Components

### 1. Data Layer (`src/data/`)
**Files**: 
- `homicides.data.ts` - Hardcoded monthly records (2000-2026)
- `population.data.ts` - CONAPO population projections
- `sexenios.data.ts` - Presidential period metadata
- `types.ts` - TypeScript interfaces

**Effort**: M (need to compile real data from SESNSP)

### 2. Business Logic (`src/lib/`)
**Files**:
- `rate-calculator.ts` - Calculate rates per 100k
- `growth-calculator.ts` - Calculate growth slopes
- `inertia-detector.ts` - Mark first 6 months
- `validators.ts` - Data integrity checks

**Effort**: S

### 3. State Management (`src/store/`)
**Files**:
- `use-homicide-store.ts` - Zustand store
  - Historical data
  - Simulation parameters
  - Computed projections

**Effort**: S

### 4. Chart Component (`src/components/`)
**Files**:
- `TimeSeriesChart.tsx` - Main Recharts component
- `ChartTooltip.tsx` - Custom tooltip
- `ChartLegend.tsx` - Legend with inertia explanation

**Effort**: M

### 5. Simulation Controls (`src/components/`)
**Files**:
- `SimulationPanel.tsx` - Period and admin selectors
- `MetricsDisplay.tsx` - Show current period stats

**Effort**: S

### 6. Simulation Engine (`src/lib/`)
**Files**:
- `simulation-engine.ts` - Apply growth rates across periods
- `projection-calculator.ts` - Generate "ghost" lines

**Effort**: M

### 7. App Shell (`src/`)
**Files**:
- `App.tsx` - Main layout
- `styles/` - Tailwind config and global styles

**Effort**: S

---

## Tasks

### Foundation
- [ ] **T1**: Install dependencies (Recharts, Zustand, date-fns, Tailwind)
  - **Effort**: XS
  - **Files**: `package.json`
  
- [ ] **T2**: Define TypeScript interfaces
  - **Effort**: XS
  - **Files**: `src/data/types.ts`

- [ ] **T3**: Compile and hardcode SESNSP data (2000-2026)
  - **Effort**: M (manual data gathering)
  - **Files**: `src/data/homicides.data.ts`

- [ ] **T4**: Hardcode CONAPO population data
  - **Effort**: S
  - **Files**: `src/data/population.data.ts`

- [ ] **T5**: Define sexenio metadata
  - **Effort**: XS
  - **Files**: `src/data/sexenios.data.ts`

- [ ] **T6**: Build RateCalculator
  - **Effort**: S
  - **Files**: `src/lib/rate-calculator.ts`
  - **Tests**: Unit tests for rate formula

- [ ] **T7**: Build GrowthCalculator
  - **Effort**: S
  - **Files**: `src/lib/growth-calculator.ts`
  - **Tests**: Unit tests for slope calculation

- [ ] **T8**: Build InertiaDetector
  - **Effort**: XS
  - **Files**: `src/lib/inertia-detector.ts`
  - **Tests**: Unit tests for first 6 months logic

- [ ] **T9**: Setup Zustand store
  - **Effort**: S
  - **Files**: `src/store/use-homicide-store.ts`

### Visualization
- [ ] **T10**: Build TimeSeriesChart with Recharts
  - **Effort**: M
  - **Files**: `src/components/TimeSeriesChart.tsx`
  - **Tests**: Renders correct number of data points

- [ ] **T11**: Build custom ChartTooltip
  - **Effort**: S
  - **Files**: `src/components/ChartTooltip.tsx`
  - **Tests**: Shows correct fields

- [ ] **T12**: Add inertia visual styling (shaded area)
  - **Effort**: S
  - **Files**: Update `TimeSeriesChart.tsx`

- [ ] **T13**: Add ChartLegend
  - **Effort**: XS
  - **Files**: `src/components/ChartLegend.tsx`

### Simulation
- [ ] **T14**: Build SimulationPanel UI
  - **Effort**: S
  - **Files**: `src/components/SimulationPanel.tsx`

- [ ] **T15**: Build SimulationEngine logic
  - **Effort**: M
  - **Files**: `src/lib/simulation-engine.ts`
  - **Tests**: Apply Calderón growth to AMLO period

- [ ] **T16**: Connect simulation to chart (render ghost line)
  - **Effort**: S
  - **Files**: Update `TimeSeriesChart.tsx`, store

- [ ] **T17**: Build MetricsDisplay panel
  - **Effort**: S
  - **Files**: `src/components/MetricsDisplay.tsx`

### Polish
- [ ] **T18**: Setup Tailwind CSS
  - **Effort**: XS
  - **Files**: `tailwind.config.js`, `src/index.css`

- [ ] **T19**: Make responsive (mobile-first)
  - **Effort**: M
  - **Files**: All components

- [ ] **T20**: WCAG 2.1 AA compliance (keyboard nav, ARIA labels)
  - **Effort**: S
  - **Files**: All components

- [ ] **T21**: E2E tests (Playwright)
  - **Effort**: M
  - **Files**: `e2e/` directory

---

## Risks & Assumptions

**Risks**:
- **Data Availability**: SESNSP data for all months 2000-2026 may have gaps → **Mitigation**: Use INEGI as backup
- **Data Size**: 312 records × simulation data may slow chart → **Mitigation**: Recharts handles this well, memoize calculations
- **Mobile Chart UX**: Complex tooltips hard on mobile → **Mitigation**: Simplify tooltip on small screens

**Assumptions**:
- User has access to SESNSP/CONAPO data sources
- Recharts supports inertia shading (use `ReferenceArea`)
- Railway deployment works with static Vite build (it does)

---

## Milestones

- [ ] **M1**: Data compiled and validated (T1-T5)
- [ ] **M2**: Basic chart renders historical data (T6-T10)
- [ ] **M3**: Simulation engine works (T14-T16)
- [ ] **M4**: Mobile-responsive and accessible (T18-T20)
- [ ] **M5**: All tests passing (T21)

---

## Effort Estimate

| Phase | Tasks | Days |
|-------|-------|------|
| Foundation | T1-T9 | 2-3 |
| Visualization | T10-T13 | 2 |
| Simulation | T14-T17 | 2 |
| Polish | T18-T21 | 2 |
| **Total** | 21 tasks | **7-9 days** |

---

**Next**: User approval to advance to Phase 3 (Tasks/Implementation)
