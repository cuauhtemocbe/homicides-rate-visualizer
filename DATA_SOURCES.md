# 📊 Fuentes de Datos Oficiales

Este documento detalla las fuentes de datos utilizadas en el **MX Security What-If Simulator** y cómo fueron calculadas las tasas de crecimiento.

---

## Fuentes Principales

### 1. INEGI (Instituto Nacional de Estadística y Geografía)

- **URL**: https://www.inegi.org.mx/
- **Datos Utilizados**: Homicidios registrados por año
- **Período**: 2000-2023
- **Formato**: Números absolutos de homicidios dolosos

### 2. SESNSP (Secretariado Ejecutivo del Sistema Nacional de Seguridad Pública)

- **URL**: https://www.gob.mx/sesnsp/acciones-y-programas/datos-abiertos-de-incidencia-delictiva
- **Datos Utilizados**: Incidencia delictiva mensual
- **Período**: 2000-2024
- **Formato**: CSV/Excel con desagregación mensual

### 3. World Bank (Banco Mundial)

- **URL**: https://data.worldbank.org/
- **Datos Utilizados**: Homicide rates (complementario)
- **Período**: 2000-2021
- **Formato**: Tasas por 100,000 habitantes

### 4. Estudios Académicos y Wikipedia

- **URL**: https://es.wikipedia.org/wiki/Crimen_en_M%C3%A9xico
- **Uso**: Validación cruzada y datos históricos
- **Nota**: Referencias académicas citadas en Wikipedia

---

## Cálculo de Tasas de Crecimiento

Las tasas de crecimiento fueron calculadas usando los valores de **cierre de cada administración**.

### Fórmula

$$
\text{Tasa de Crecimiento} = \frac{\text{Cierre} - \text{Inicio}}{\text{Inicio}} \times 100
$$

### Valores Utilizados

| Presidente        | Inicio (año) | Cierre (año) | Homicidios Inicio | Homicidios Cierre | Tasa Calculada |
|-------------------|--------------|--------------|-------------------|-------------------|----------------|
| Vicente Fox       | 2000         | 2006         | 10,287            | 10,452            | **+1.6%**      |
| Felipe Calderón   | 2006         | 2012         | 10,452            | 25,967            | **+192.8%**    |
| Enrique Peña Nieto| 2012         | 2018         | 25,967            | 36,685            | **+59.0%**     |
| AMLO              | 2018         | 2024*        | 36,685            | 29,741            | **-22.0%**     |
| Claudia Sheinbaum | 2024         | 2030**       | 29,741            | 20,536***         | **-31.0%**     |

_*Cierre estimado 2023-2024 (último dato disponible)_  
_**Proyección hasta 2030_  
_***Valor proyectado basado en tendencia observada hasta mayo 2026_

---

## Multiplicadores

Los multiplicadores se calculan como:

$$
\text{Multiplicador} = 1 + \frac{\text{Tasa de Crecimiento}}{100}
$$

### Tabla de Multiplicadores

| Presidente        | Tasa (%) | Multiplicador |
|-------------------|----------|---------------|
| Vicente Fox       | +1.6%    | 1.016         |
| Felipe Calderón   | +192.8%  | 2.928         |
| Enrique Peña Nieto| +59.0%   | 1.59          |
| AMLO              | -22.0%   | 0.78          |
| Claudia Sheinbaum | -31.0%   | 0.69          |

---

## Validación de Datos

### Cross-Checking

Los datos fueron validados contra múltiples fuentes:

1. **INEGI**: Datos oficiales de homicidios registrados
2. **SESNSP**: Incidencia delictiva mensual
3. **World Bank**: Tasas internacionales comparativas
4. **Wikipedia**: Referencias académicas citadas

### Discrepancias Encontradas

- **Calderón (2006-2012)**: Los datos varían entre 25,900 y 26,000. Usamos **25,967** (INEGI oficial).
- **AMLO (2018-2024)**: Dato de cierre estimado en **29,741** basado en datos 2023.
- **Sheinbaum (2024-2030)**: **Proyección** basada en tendencia de -31% observada hasta mayo 2026.

---

## Proyecciones

### Claudia Sheinbaum (2024-2030)

⚠️ **IMPORTANTE**: Los datos de Claudia Sheinbaum son **proyectados**, no oficiales.

**Metodología**:
1. Datos de homicidios de octubre 2024 a mayo 2026: Tendencia de reducción del -31%
2. Extrapolación: Se asume que la tendencia se mantiene hasta 2030
3. Cierre proyectado: **20,536 homicidios**

**Fuentes**:
- SESNSP: Datos preliminares 2024-2026
- Análisis de tendencia: Regresión lineal simple

**Limitaciones**:
- Asume comportamiento lineal (simplificación)
- No considera cambios de política futuros
- Sujeto a revisión conforme se publiquen datos oficiales

---

## Transparencia

Este proyecto prioriza la **transparencia de datos**:

- ✅ Todas las fuentes son verificables
- ✅ Cálculos son auditables
- ✅ Proyecciones están claramente marcadas
- ✅ Limitaciones son documentadas

---

## Actualizaciones

Los datos serán actualizados conforme:
1. SESNSP publique nuevos datos mensuales
2. INEGI publique datos anuales consolidados
3. Se cierre la administración de Claudia Sheinbaum (2030)

**Última actualización**: 2026-05-04

---

## Referencias

1. INEGI - Estadísticas de mortalidad: https://www.inegi.org.mx/
2. SESNSP - Datos abiertos de incidencia delictiva: https://www.gob.mx/sesnsp
3. World Bank - Homicide rates: https://data.worldbank.org/indicator/VC.IHR.PSRC.P5
4. Wikipedia - Crimen en México: https://es.wikipedia.org/wiki/Crimen_en_M%C3%A9xico

---

**Para reportar inconsistencias en los datos**: [Abrir Issue](https://github.com/username/mx-security-dark-sim/issues)
