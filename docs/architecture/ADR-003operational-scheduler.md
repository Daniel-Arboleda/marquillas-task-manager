# ADR-003 – Operational Planning Layer

**Estado:** Propuesto
**Prioridad:** Alta
**Proyecto:** Marquillas Task Manager
**Evolución prevista:** NexoLayer Operational Platform
**Fecha:** 2026-07-24

---

# Contexto

Durante el análisis arquitectónico realizado al finalizar la prueba técnica se identificó que el módulo de tareas representa únicamente unidades de trabajo, pero no constituye un sistema de planificación operacional.

Actualmente una tarea puede contener información como responsable, prioridad, estado y fecha de vencimiento. Sin embargo, estos datos aún no pueden ser utilizados para construir una planificación operativa que permita organizar recursos, personas, actividades y operaciones dentro de una organización.

El crecimiento previsto de NexoLayer contempla empresas técnico-operativas, manufactureras, de mantenimiento, servicios en campo y maquilas, donde la planificación diaria constituye uno de los procesos críticos de la operación.

Por esta razón se propone separar conceptualmente las tareas de la planificación, permitiendo que múltiples representaciones visuales consuman una única fuente de información operacional.

---

# Problema identificado

Actualmente las tareas representan únicamente información operativa.

No existe una capa responsable de:

- organizar actividades en el tiempo;
- visualizar la carga operacional;
- programar recursos;
- distribuir actividades futuras;
- representar la operación desde diferentes perspectivas.

Intentar incorporar estas capacidades directamente dentro del módulo de tareas produciría un crecimiento excesivo de responsabilidades, incrementando el acoplamiento y reduciendo la capacidad de evolución del sistema.

---

# Decisión

Se establece que la planificación operacional será una capacidad independiente de los módulos funcionales.

Las tareas continuarán representando únicamente unidades de trabajo.

La planificación será responsable exclusivamente de organizar dichas unidades dentro de un contexto temporal y operacional.

Esta decisión permite desacoplar completamente el modelo de negocio de su representación visual y operacional.

---

# Justificación

Una misma tarea puede necesitar visualizarse de diferentes maneras dependiendo del área que la consulte.

Por ejemplo:

- Gerencia requiere una visión ejecutiva.
- Operaciones necesita programación diaria.
- Supervisión requiere seguimiento de actividades.
- Proyectos necesita cronogramas.
- Técnicos requieren agendas personales.
- Logística necesita rutas.
- Planeación requiere capacidad instalada.

Duplicar tareas para cada necesidad produciría inconsistencias y múltiples fuentes de verdad.

La planificación debe reutilizar las mismas entidades operativas existentes.

---

# Principio arquitectónico

Las entidades operativas no conocen la forma en que serán planificadas.

La planificación consume entidades existentes.

Nunca ocurre el proceso inverso.

```text
Tasks
Work Orders
Maintenance
Projects
Activities
Stock Requests

↓

Operational Planning Layer

↓

Calendar
Kanban
Timeline
Gantt
Agenda
Dispatch
Route Planner
Workload
```

La fuente de información permanece única.

Las vistas cambian.

Los datos no.

---

# Alcance funcional futuro

La capa de planificación deberá proporcionar como mínimo las siguientes capacidades.

## Calendario Operacional

Visualización diaria, semanal y mensual.

Programación de actividades.

Reprogramación mediante interacción visual.

Asignación de responsables.

Visualización de conflictos.

---

## Agenda Operativa

Vista individual por usuario.

Actividades pendientes.

Actividades futuras.

Historial operativo.

---

## Gantt Operacional

Planificación de proyectos.

Dependencias.

Duraciones.

Secuencias.

Control de avance.

Visualización de hitos.

---

## Timeline

Representación cronológica continua.

Seguimiento histórico.

Análisis temporal.

Eventos operativos.

---

## Kanban

Representación por flujo de trabajo.

Estados.

Transiciones.

Priorización.

Seguimiento visual.

---

## Planeación de Recursos

Asignación de técnicos.

Equipos.

Vehículos.

Herramientas.

Capacidad disponible.

---

## Planeación de Rutas

Agrupación geográfica.

Optimización de desplazamientos.

Visitas programadas.

Orden de ejecución.

---

## Balance de Carga

Distribución del trabajo.

Sobrecarga.

Capacidad libre.

Análisis por responsable.

---

# Integración con la Política Temporal

Esta arquitectura depende directamente de la Política Temporal Corporativa definida en el ADR-001.

La planificación nunca deberá implementar reglas propias de manejo de fechas.

Toda operación relacionada con tiempo deberá consumir la infraestructura temporal compartida de la plataforma.

La Política Temporal define cómo existe el tiempo.

La Capa de Planificación define cómo se organiza el trabajo utilizando ese tiempo.

---

# Reutilización prevista

La capa de planificación será utilizada por todos los módulos operativos.

Entre ellos:

- Tasks.
- Work Orders.
- Maintenance.
- Customer Operations.
- Inventory Operations.
- Remote Monitoring.
- Field Service.
- Projects.
- Production.
- Quality.
- Logistics.
- Preventive Maintenance.
- Corrective Maintenance.

Todos compartirán exactamente la misma infraestructura de planificación.

---

# Beneficios esperados

- Separación clara de responsabilidades.
- Eliminación de duplicidad de información.
- Única fuente de verdad operacional.
- Escalabilidad arquitectónica.
- Reutilización entre módulos.
- Menor acoplamiento.
- Mayor mantenibilidad.
- Facilidad para incorporar nuevas vistas.
- Preparación para crecimiento empresarial.
- Adaptabilidad a distintos sectores industriales.

---

# Relación con Industria 4.0

Uno de los pilares de Industria 4.0 consiste en digitalizar la planificación operacional y conectar la ejecución con información disponible en tiempo real.

La Capa de Planificación permitirá evolucionar progresivamente hacia procesos de programación inteligente, sincronización de recursos, monitoreo operacional y coordinación de actividades distribuidas.

Esta capacidad constituye uno de los componentes fundamentales para convertir NexoLayer en una plataforma de operación técnica e Industria 4.0.

---

# Evolución futura

La presente decisión arquitectónica habilita la construcción futura de capacidades avanzadas como:

- Programación automática.
- Optimización de recursos.
- Planeación asistida por IA.
- Reprogramación dinámica.
- Simulación operacional.
- Predicción de carga.
- Integración con dispositivos IoT.
- Coordinación con monitoreo remoto.
- Planeación multi-tenant.
- Dashboards ejecutivos de planificación.

---

# Estado actual

**Fase 1**

- Finalización de la prueba técnica.
- Estabilización funcional.
- Corrección de incidencias.
- Versionado del proyecto.

**Fase 2**

- Implementación de la Política Temporal Corporativa (ADR-001).

**Fase 3**

- Diseño e implementación de la Capa de Planificación Operacional.

**Fase 4**

- Incorporación progresiva de vistas Calendar, Agenda, Kanban, Timeline y Gantt.

**Fase 5**

- Evolución hacia planificación inteligente integrada con el ecosistema NexoLayer.

---

# Observación

La planificación operacional no constituye un módulo funcional independiente, sino una capacidad transversal de la plataforma. Su responsabilidad será organizar y representar temporalmente las entidades operativas existentes sin alterar su modelo de negocio, permitiendo que una única fuente de información pueda visualizarse mediante diferentes paradigmas de planificación según las necesidades de cada área de la organización.
