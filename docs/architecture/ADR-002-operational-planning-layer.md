# ADR-002 – Operational Planning Layer

**Estado:** Propuesto
**Prioridad:** Alta
**Proyecto:** Marquillas Task Manager
**Evolución prevista:** NexoLayer Operational Platform
**Dependencia:** ADR-001 – Política Temporal Corporativa
**Fecha:** 2026-07-24

---

# Contexto

Durante el diseño de la evolución arquitectónica posterior a la prueba técnica se identificó que las tareas representan únicamente unidades de trabajo, pero no constituyen un mecanismo de planificación operacional.

Actualmente el módulo de tareas permite:

- Crear tareas.
- Asignarlas a usuarios.
- Definir prioridades.
- Definir fechas objetivo.
- Gestionar estados.
- Registrar historial.

Sin embargo, ninguna de estas capacidades define cómo debe organizarse, visualizarse o coordinarse la operación de una empresa.

En una organización técnico-operativa, manufacturera o de mantenimiento industrial, la planificación constituye una capacidad independiente de la gestión de tareas.

Por esta razón se propone incorporar una nueva capa arquitectónica denominada **Operational Planning Layer**, responsable de transformar eventos operativos en diferentes modelos de planificación sin modificar los módulos funcionales que los originan.

---

# Problema identificado

Actualmente una tarea contiene información suficiente para ser ejecutada, pero no existe una infraestructura que permita responder preguntas como:

- ¿Qué actividades están programadas para mañana?
- ¿Qué técnico tiene mayor carga de trabajo?
- ¿Qué proyectos presentan retrasos?
- ¿Qué actividades coinciden en el tiempo?
- ¿Qué mantenimiento debe ejecutarse primero?
- ¿Cómo se encuentra distribuida la operación durante la semana?

Intentar resolver estos escenarios directamente dentro del módulo de tareas produciría una alta dependencia entre la lógica de negocio y la representación visual.

---

# Decisión

La planificación operacional será considerada una capacidad transversal de la plataforma y no una funcionalidad propia del módulo de tareas.

Los módulos funcionales únicamente generarán información operacional.

La responsabilidad de organizar dicha información recaerá sobre una capa independiente denominada **Operational Planning Layer**.

Esta capa será reutilizada por cualquier módulo que genere eventos planificables.

---

# Justificación

Separar planificación y ejecución ofrece múltiples beneficios:

- Reduce el acoplamiento entre módulos.
- Permite múltiples representaciones sin duplicar datos.
- Facilita futuras integraciones.
- Incrementa la reutilización.
- Evita mantener múltiples motores de planificación independientes.
- Mantiene una arquitectura escalable.

La planificación deja de depender del origen de la información y pasa a depender únicamente de eventos operativos.

---

# Dependencia arquitectónica

Esta decisión depende directamente del ADR-001.

El ADR-001 define:

- cómo existe el tiempo;
- cómo se representa;
- cómo se valida;
- cómo se almacena.

El ADR-002 define:

- cómo utilizar ese tiempo para organizar la operación.

Sin una política temporal unificada no es posible construir una planificación consistente.

---

# Arquitectura propuesta

```text
Tasks
Work Orders
Maintenance
Projects
Activities
Stock Requests
Remote Monitoring Events

            │
            ▼

Operational Planning Layer

            │
            ▼

Planning Engine

            │
            ├──────── Calendar
            ├──────── Kanban
            ├──────── Timeline
            ├──────── Gantt
            ├──────── Agenda
            ├──────── Route Planner
            └──────── Workload
```

Los módulos funcionales no conocerán la forma en que posteriormente se representa la planificación.

---

# Principios arquitectónicos

## Separación de responsabilidades

Los módulos generan trabajo.

La capa de planificación organiza el trabajo.

Las vistas presentan el trabajo.

Cada responsabilidad permanece desacoplada.

---

## Fuente única de planificación

Toda representación visual deberá consumir exactamente la misma información operacional.

No existirán motores independientes para:

- calendario;
- gantt;
- kanban;
- agenda.

Todos consumirán una única fuente de planificación.

---

## Independencia de representación

La modificación de una vista no deberá afectar ninguna otra.

Agregar nuevas representaciones no requerirá modificar los módulos funcionales.

---

## Escalabilidad

La incorporación futura de nuevas visualizaciones deberá realizarse mediante nuevos adaptadores sin alterar la lógica existente.

---

# Representaciones previstas

Inicialmente la plataforma priorizará:

## Calendar View

Primera representación oficial.

Permitirá programar actividades sobre fechas reales.

Será la vista principal para empresas técnico-operativas.

---

## Gantt View

Representación orientada a proyectos.

Permitirá visualizar duración, dependencias y avance.

Especialmente útil para planificación interna y coordinación de equipos.

---

## Kanban View

Representación basada en flujo de trabajo.

Enfocada en estados operativos.

---

## Timeline View

Visualización cronológica de eventos.

---

## Agenda View

Lista secuencial de actividades programadas.

---

## Workload View

Distribución de carga entre recursos.

---

## Route Planner

Planificación geográfica de desplazamientos y servicios.

---

# Casos de uso futuros

La capa de planificación será utilizada por:

- Gestión de mantenimiento.
- Órdenes de trabajo.
- Inventario operativo.
- Atención en campo.
- Programación de visitas.
- Planeación de producción.
- Programación de inspecciones.
- Monitoreo remoto.
- Operaciones IoT.
- Customer Operations.

---

# Beneficios esperados

- Mejor planificación operacional.
- Mayor visibilidad para gerencia.
- Mejor utilización de recursos.
- Reducción de conflictos de programación.
- Escalabilidad arquitectónica.
- Mayor reutilización.
- Base para capacidades Industry 4.0.

---

# Fuera del alcance de la prueba técnica

La implementación de la Operational Planning Layer no hace parte del alcance de la prueba técnica.

Durante esta fase únicamente se documenta la decisión arquitectónica.

La implementación iniciará posteriormente dentro de NexoLayer una vez se encuentre finalizada la Política Temporal Corporativa definida en el ADR-001.

---

# Estado actual

**Fase 1**

- Finalizar la prueba técnica.
- Corregir incidencias.
- Versionar una base estable.

**Fase 2**

- Implementar ADR-001.
- Construir infraestructura temporal compartida.

**Fase 3**

- Implementar Operational Planning Layer.

**Fase 4**

- Incorporar Calendar View.

**Fase 5**

- Incorporar Gantt, Kanban, Timeline, Agenda, Workload y Route Planner.

---

# Observación

La Operational Planning Layer constituye una capacidad estratégica de NexoLayer y representa la transición desde una aplicación de gestión de tareas hacia una plataforma de planificación operacional para empresas técnico-operativas, manufactureras e Industria 4.0. Su propósito no es reemplazar los módulos funcionales existentes, sino proporcionar una infraestructura común que permita organizar, visualizar y coordinar la operación mediante múltiples modelos de planificación sobre una única fuente de información.
