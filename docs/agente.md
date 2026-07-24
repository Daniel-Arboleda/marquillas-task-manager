
# Diseño del Agente de Inteligencia Artificial

## Objetivo

El agente de inteligencia artificial tiene como objetivo revisar automáticamente las tareas nuevas al inicio de cada jornada laboral y asistir al equipo mediante recomendaciones operativas. El agente no ejecuta cambios directamente sobre el sistema; únicamente propone acciones para que un usuario autorizado tome la decisión final.

Las decisiones posibles son:

- Sugerir un responsable según su carga de trabajo y experiencia.
- Sugerir subtareas cuando la tarea sea considerada compleja.
- Marcar la tarea para revisión humana cuando la información sea insuficiente.

---

# Flujo del agente

```text
Nueva tarea
      │
      ▼
Leer título y descripción
      │
      ▼
Consultar carga de trabajo de los usuarios
      │
      ▼
¿La información es suficiente?
 ┌─────────────────────┴─────────────────────┐
 │                                           │
Sí                                          No
 │                                           │
 ▼                                           ▼
Sugerir responsable                 Marcar para revisión
 │
 ▼
¿La tarea es compleja?
 ┌─────────────────────┴─────────────────────┐
 │                                           │
No                                          Sí
 │                                           │
 ▼                                           ▼
Finalizar                           Generar subtareas
      │
      ▼
Entregar recomendaciones
```

---

# Herramientas utilizadas

| Tool              | Propósito                                                                     | Parámetros                  |
| ----------------- | ------------------------------------------------------------------------------ | ---------------------------- |
| get_user_workload | Consultar la carga de trabajo actual de los usuarios disponibles.              | user_id                      |
| suggest_assignee  | Recomendar el usuario más adecuado considerando experiencia y disponibilidad. | task_title, task_description |
| suggest_subtasks  | Dividir una tarea compleja en actividades más pequeñas.                      | task_title, task_description |
| flag_for_review   | Solicitar revisión humana cuando la información sea insuficiente o ambigua.  | task_id, reason              |

---

# Política de parada

Para evitar ciclos infinitos o consumo innecesario de recursos, el agente operará bajo las siguientes restricciones:

- Máximo 3 iteraciones por tarea.
- Máximo 5 llamadas a herramientas durante una ejecución.
- Presupuesto máximo de 4000 tokens por proceso.
- Si no es posible obtener una recomendación válida dentro de estos límites, la tarea será marcada automáticamente para revisión humana.

---

# Métrica de evaluación

## Tasa de aceptación de recomendaciones

Esta métrica permite medir la utilidad real del agente dentro del proceso operativo.

**Fórmula**

```text
Recomendaciones aceptadas
──────────────────────────────
Total de recomendaciones
```

Una tasa alta indica que las sugerencias generadas por el agente son útiles y consistentes con los criterios del equipo.

---

# Riesgo y mitigación

## Riesgo

El agente podría generar recomendaciones utilizando información incompleta o insuficiente, produciendo asignaciones incorrectas o subtareas poco relevantes.

## Mitigación

Antes de emitir cualquier recomendación, el agente verificará que la tarea contenga la información mínima necesaria. Si detecta información insuficiente o ambigua, no realizará recomendaciones automáticas y utilizará la herramienta `flag_for_review` para solicitar validación por parte de un usuario autorizado.

---

# Consideraciones de diseño

- El agente actúa únicamente como asistente de apoyo.
- Todas las recomendaciones requieren validación humana antes de ser aplicadas.
- El diseño es independiente del proveedor de inteligencia artificial utilizado.
- La incorporación de nuevas herramientas podrá realizarse sin modificar el flujo principal del agente.
- La lógica propuesta corresponde únicamente al diseño conceptual solicitado por esta prueba técnica y no implica una implementación funcional dentro del sistema.
