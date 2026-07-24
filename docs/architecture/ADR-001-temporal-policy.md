# ADR-001 – Política Temporal Corporativa

**Estado:** Propuesto
**Prioridad:** Alta
**Proyecto:** Marquillas Task Manager
**Evolución prevista:** NexoLayer Operational Platform
**Fecha:** 2026-07-24

---

# Contexto

Durante la etapa final de estabilización de la prueba técnica se detectó una inconsistencia en la validación de fechas al comparar objetos `datetime` con y sin información de zona horaria (`offset-naive` vs `offset-aware`).

El error identificado fue:

```text
TypeError: can't compare offset-naive and offset-aware datetimes
```

Aunque el incidente fue identificado durante la validación del campo `due_date` del módulo de tareas, el análisis evidenció un problema de mayor alcance: actualmente el proyecto no posee una política temporal corporativa que defina cómo deben representarse, validarse, almacenarse y serializarse las fechas y horas en todos los módulos de la plataforma.

La ausencia de una política común puede producir inconsistencias entre Backend, Frontend, Base de Datos, APIs, integraciones futuras y procesos distribuidos, especialmente durante la evolución del proyecto hacia una plataforma modular reutilizable dentro del ecosistema NexoLayer.

---

# Problema identificado

Actualmente diferentes componentes del sistema pueden producir o consumir objetos temporales utilizando criterios distintos:

- `datetime` sin zona horaria (Naive DateTime).
- `datetime` con zona horaria (Aware DateTime).
- Fechas sin hora (`date`).
- Conversión implícita realizada por librerías o frameworks.
- Conversión automática realizada por el navegador.

Esto puede ocasionar:

- Comparaciones inválidas.
- Errores de serialización.
- Inconsistencias entre Frontend y Backend.
- Diferencias horarias dependiendo del servidor.
- Problemas de sincronización entre servicios.
- Dificultades durante futuras integraciones con módulos de planificación, monitoreo y calendarios.

---

# Decisión

Para no introducir cambios arquitectónicos de alto impacto durante la evaluación de la prueba técnica se adopta la siguiente estrategia.

## Corto plazo

1) Mantener el contrato funcional actual de la prueba técnica.

2) Corregir únicamente la inconsistencia detectada en la validación de fechas para recuperar la estabilidad del sistema.

3) No modificar el modelo temporal completo durante esta etapa.

4) No introducir cambios incompatibles con la solución ya implementada.

5) Finalizar completamente la prueba técnica antes de iniciar refactorizaciones transversales.

---

# Justificación

La prueba técnica tiene como objetivo demostrar:

- Arquitectura.
- Calidad de código.
- Buenas prácticas.
- Diseño modular.
- Capacidad de evolución.

Modificar completamente el manejo temporal durante la etapa final incrementaría el riesgo de introducir regresiones en funcionalidades ya validadas.

Se prioriza entregar una solución estable y posteriormente realizar una evolución arquitectónica controlada.

---

# Evolución planificada

Una vez finalizada y versionada la prueba técnica se iniciará la construcción de una política temporal corporativa reutilizable para NexoLayer.

Esta capacidad será transversal al sistema y no pertenecerá a un módulo funcional específico.

Su implementación estará ubicada dentro del núcleo compartido de la plataforma, evitando duplicación de lógica entre módulos.

Ejemplo de ubicación:

```text
backend/
└── app/
    └── core/
        └── temporal/
```

o

```text
backend/
└── app/
    └── shared/
        └── temporal/
```

La ubicación definitiva será definida durante la evolución arquitectónica de NexoLayer.

---

# Alcance funcional futuro

La política temporal deberá proporcionar como mínimo los siguientes componentes.

## Fuente única de tiempo

Implementar un servicio centralizado (`Clock`) que represente la única fuente oficial de tiempo del sistema.

Todo el proyecto deberá obtener la fecha y hora mediante este servicio, evitando llamadas directas a `datetime.now()` distribuidas por los módulos.

---

## Manejo estandarizado de UTC

Definir una política única para:

- almacenamiento;
- serialización;
- deserialización;
- comparación;
- conversión entre zonas horarias.

Todos los eventos del sistema deberán seguir el mismo criterio temporal.

---

## Validadores temporales reutilizables

Centralizar reglas como:

- fecha futura;
- fecha pasada;
- rango permitido;
- duración mínima;
- duración máxima;
- ventanas de tiempo.

Evitar duplicación de validaciones entre módulos.

---

## Conversión consistente Backend ↔ Frontend

Definir una única estrategia para transformar fechas entre:

- Base de Datos.
- Backend.
- API REST.
- Frontend.
- Navegador.

Garantizando consistencia independientemente de la ubicación geográfica del usuario.

---

## Política de representación temporal

Definir claramente cuándo utilizar:

- `date`
- `datetime`
- UTC
- hora local
- eventos
- programación
- vencimientos

Cada tipo de dato deberá responder a una necesidad funcional específica y no a decisiones aisladas de implementación.

---

# Reutilización prevista

La política temporal será compartida por todos los módulos actuales y futuros de la plataforma.

Entre ellos:

- Tasks.
- Work Orders.
- Scheduler.
- Calendar.
- Notifications.
- Inventory Events.
- Remote Monitoring.
- IoT.
- Edge Devices.
- AI Agents.
- Audit.
- Telemetry.
- Customer Operations.

De esta forma toda la plataforma utilizará un único criterio temporal.

---

# Beneficios esperados

- Eliminación de inconsistencias entre fechas.
- Comparaciones seguras.
- Reducción de deuda técnica.
- Código más mantenible.
- Reutilización entre módulos.
- Mayor facilidad para pruebas automatizadas.
- Preparación para despliegues distribuidos.
- Compatibilidad con futuras integraciones internacionales.
- Base sólida para la evolución de NexoLayer como plataforma SaaS multi-tenant.

---

# Estado actual

**Fase 1**

- Corrección puntual del error detectado.
- Recuperación de la estabilidad.
- Finalización de la prueba técnica.
- Validación funcional completa.
- Versionado del proyecto.

**Fase 2**

- Diseño de la Política Temporal Corporativa.
- Implementación del núcleo temporal compartido.
- Refactorización gradual de los módulos existentes.
- Adopción progresiva del nuevo estándar temporal.

---

# Observación

La inconsistencia detectada durante la validación de `due_date` no se considera únicamente un error de implementación, sino un hallazgo de arquitectura que evidencia la necesidad de establecer una política temporal corporativa común. La resolución inmediata permitirá finalizar la prueba técnica sin introducir cambios disruptivos, mientras que la evolución planificada proporcionará una base consistente y reutilizable para el crecimiento de NexoLayer y sus futuros módulos.
