# Propuesta de Tests Adicionales para Home y Add Product

## Objetivo
Complementar la cobertura de pruebas actual con tests negativos, de validación, seguridad y accesibilidad siguiendo el patrón de la suite Login Page (7 positivos + 13 negativos = 20 tests por página).

---

## Home Page - Tests Adicionales Propuestos (15 tests)

### Tests Negativos (7 tests)

| ID | Nombre | Descripción | Justificación |
|-----|--------|-------------|---------------|
| HN1 | should display no results message when filter matches no products | Filtrar con un término que no existe | Validar manejo de resultados vacíos |
| HN2 | should handle special characters in filter input | Usar caracteres especiales como `<script>`, `'`, `"` | Seguridad - XSS básico |
| HN3 | should handle SQL injection attempt in filter | Inyección SQL en el filtro | Seguridad |
| HN4 | should handle very long filter input gracefully | 500+ caracteres en el filtro | Límites de entrada |
| HN5 | should handle whitespace-only filter input | Solo espacios en blanco | Validación de entrada |
| HN6 | should handle rapid filter clicks | Múltiples clicks en filter button | Race conditions |
| HN7 | should handle filter with numeric input | Números en el filtro | Tipos de datos inesperados |

### Tests de Validación y Datos (5 tests)

| ID | Nombre | Descripción |
|-----|--------|-------------|
| HV1 | should verify product data types and formats | Validar que precios son numéricos, fechas en formato correcto |
| HV2 | should verify table sorting functionality (if exists) | Verificar ordenamiento por columnas |
| HV3 | should maintain filter state after navigation | Filtrar, navegar a otra página y volver |
| HV4 | should verify empty product state | Estado cuando no hay productos |
| HV5 | should handle filter case-insensitively | Búsqueda sensible a mayúsculas/minúsculas |

### Tests de Accesibilidad (3 tests)

| ID | Nombre | Descripción |
|-----|--------|-------------|
| HA1 | should verify ARIA labels on interactive elements | Labels en inputs, botones |
| HA2 | should support keyboard navigation | Tab, Enter, Escape |
| HA3 | should verify focus management | Focus visible y orden lógico |

---

## Add Product Page - Tests Adicionales Propuestos (19 tests)

### Tests Negativos - Campos Requeridos (3 tests)

| ID | Nombre | Descripción | Similar a Login Page |
|-----|--------|-------------|---------------------|
| AN1 | should display validation error when product name is empty | Campo nombre requerido | N1, N2 |
| AN2 | should display validation error when price is empty | Campo precio requerido | N1, N2 |
| AN3 | should display errors when multiple fields are empty | Validación múltiple | N3 |

### Tests Negativos - Validación de Precio (4 tests)

| ID | Nombre | Descripción |
|-----|--------|-------------|
| AN4 | should reject negative price values | Precio negativo |
| AN5 | should reject non-numeric price input | Letras, símbolos |
| AN6 | should handle extremely large price values | Millones |
| AN7 | should validate decimal precision (2 decimal places max) | Formato monetario |

### Tests Negativos - Validación de Fecha (3 tests)

| ID | Nombre | Descripción |
|-----|--------|-------------|
| AN8 | should reject invalid date format (MM/DD/YYYY) | Formato incorrecto |
| AN9 | should reject future dates if not allowed | Fechas futuras |
| AN10 | should handle empty date field | Date Stocked opcional? |

### Tests Negativos - Límites y Seguridad (4 tests)

| ID | Nombre | Descripción |
|-----|--------|-------------|
| AN11 | should handle very long product name (500+ chars) | Límite de caracteres |
| AN12 | should handle SQL injection in product name | Seguridad |
| AN13 | should handle XSS attempt in product name | Script tags |
| AN14 | should handle rapid multiple clicks on submit | Doble envío |

### Tests de Comportamiento (3 tests)

| ID | Nombre | Descripción |
|-----|--------|-------------|
| AC1 | should cancel/navigate back without submitting | Botón cancelar o navegación atrás |
| AC2 | should preserve form data after failed submission | Datos mantienen after error |
| AC3 | should clear sensitive fields after failed submission | Password-like behavior? |

### Tests de Accesibilidad (2 tests)

| ID | Nombre | Descripción |
|-----|--------|-------------|
| AA1 | should verify all form fields have proper labels | Labels, ARIA |
| AA2 | should support keyboard-only navigation | Tab order, Enter submit |

---

## Resumen de Tests Propuestos

### Home Page: +15 tests (total: 20 tests)
- Negativos: 7
- Validación/Datos: 5
- Accesibilidad: 3

### Add Product: +19 tests (total: 20 tests)
- Negativos campos requeridos: 3
- Negativos validación precio: 4
- Negativos validación fecha: 3
- Negativos límites/seguridad: 4
- Comportamiento: 3
- Accesibilidad: 2

**Total nuevo proyecto: +34 tests → 76 tests en total** (actual: 42)

---

## Priorización por Impacto

### Alta Prioridad (implementar primero)
1. **Home HN1** - No results message (UX crítica)
2. **Home HN3** - SQL injection en filtro (Seguridad)
3. **AddProduct AN1-AN3** - Campos requeridos (Happy Path complement)
4. **AddProduct AN4-AN7** - Validación precio (Calidad de datos)
5. **AddProduct AN8-AN10** - Validación fecha (Calidad de datos)

### Media Prioridad
6. Accesibilidad tests (HA1-3, AA1-2)
7. Tests de límites (HN4, AN11-14)
8. Tests de comportamiento (AC1-3)

### Baja Prioridad (si hay tiempo)
9. Tests de features opcionales (ordenamiento HV2)
10. Tests de performance/carga

---

## Recomendación

Seguir el patrón de la suite Login Page que tiene 7 positivos + 13 negativos = 20 tests balanceados. Esto daría:

- **Home Page:** 5 existentes + 15 nuevos = 20 tests
- **Add Product:** 1 existente + 19 nuevos = 20 tests
- **Login Page:** 20 tests ✅ (ya balanceada)
- **Practice:** 16 tests

**Total ideal: 76 tests**

Se recomienda implementar los tests de ALTA PRIORIDAD primero (15 tests) para cubrir:
- Validaciones críticas de formulario
- Seguridad básica (SQL injection)
- Manejo de errores y UX

---

## Criterios de Aceptación para cada test

1. **Tests negativos:** Deben verificar mensajes de error apropiados y que el estado de la UI permanece consistente
2. **Tests de validación:** Deben probar boundaries y edge cases
3. **Tests de seguridad:** Deben prevenir inyecciones y mantener datos saneados
4. **Tests de accesibilidad:** Deben verificar attributes ARIA y navegación por teclado
5. **Tests de comportamiento:** Deben validar用户体验(UX) en errores y estados

---

**Creado:** 2025-02-17
**Autor:** Roo (AI Assistant)
**Basado en:** Análisis de código existente en `tests/Pages/`
