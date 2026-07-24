
Estoy de acuerdo con el enfoque de **no sobrediseñar** esta parte. Para esta prueba técnica, el objetivo es cumplir exactamente el enunciado con una implementación limpia, segura y fácil de explicar. No introduciría repositorios, CQRS, adapters o capas adicionales para el módulo de IA porque el enunciado no las exige.

## Estado del proyecto

### Día 1–9

* ✅ Backend completo
* ✅ Frontend completo
* ✅ SQL Server completo
* ✅ Docker
* ✅ JWT
* ✅ Roles
* ✅ Tests
* ✅ Git Flow

### Día 10

**Objetivo único**

> Cumplir completamente el Punto 4 (15%) y dejar preparado el Punto 5 (10%).

No hay cambios de base de datos.

No hay migraciones.

No hay cambios al frontend.

No hay cambios al dominio de tareas.

No hay cambios de autenticación.

---

# Rama

Ya estás sobre

```text
feature/day-10-openai-agent-foundation
```

No crear más ramas.

---

# Objetivo del Día 10

Agregar únicamente

```text
POST /api/ai/enrich-task
```

---

# Arquitectura mínima

No crear repositories.

No crear models SQLAlchemy.

No crear tablas.

No crear migraciones.

Solo crear un módulo IA.

---

# Orden exacto

## Paso 10.1

### Crear

```
backend/app/modules/ai/
```

---

### Crear

```
backend/app/modules/ai/api/
```

Contendrá

```
ai_routes.py
```

Responsabilidad

* Router FastAPI
* Endpoint POST
* Validación JWT existente
* Llamar service
* Retornar respuesta

Nada más.

---

## Paso 10.2

Crear

```
backend/app/modules/ai/services/
```

Contendrá

```
ai_service.py
```

Responsabilidad

* Leer prompt
* Construir petición OpenAI
* Structured Output
* Timeout
* Rate Limit
* APIError
* Fallback

Toda la lógica aquí.

---

## Paso 10.3

Crear

```
backend/app/modules/ai/schemas/
```

Contendrá

```
ai_schemas.py
```

Aquí únicamente:

### Request

```
TaskEnrichmentRequest
```

Campos

```
title
description
```

---

### Response

```
TaskEnrichmentResponse
```

Campos

```
prioridad_sugerida

categoria_sugerida

resumen

confianza
```

---

Ese schema será utilizado

* por FastAPI

y

* para validar la respuesta del LLM.

No usar regex.

No parsear texto.

---

## Paso 10.4

Crear

```
backend/app/modules/ai/prompts/
```

Crear

```
enrich_task_system.txt
```

Aquí irá el prompt.

Versionado.

Nunca hardcodeado.

Cumple exactamente el PDF.

---

## Paso 10.5

Modificar

```
backend/app/main.py
```

Agregar

```
from app.modules.ai.api.ai_routes import router as ai_router
```

y

```
app.include_router(ai_router)
```

Nada más.

---

## Paso 10.6

Modificar

```
backend/app/core/config.py
```

Ya quedó.

No volverlo a tocar.

---

## Paso 10.7

Modificar

```
backend/.env.example
```

Agregar

```
OPENAI_API_KEY=

OPENAI_MODEL=o3-mini

OPENAI_TIMEOUT_SECONDS=8
```

Nada más.

---

## Paso 10.8

Modificar

```
README.md
```

Agregar únicamente

### Prompt Injection

3–5 líneas.

---

### Costos

3–5 líneas.

Nada más.

---

## Paso 10.9

Crear

```
docs/agente.md
```

Máximo

2 páginas.

No implementación.

Solo diseño.

---

# Seguridad del endpoint

El endpoint debe:

✔ JWT obligatorio

✔ No aceptar campos extras

✔ Limitar longitud

Ejemplo

```
title

max_length=200
```

```
description

max_length=4000
```

✔ Timeout

8 segundos

✔ RateLimit

Capturar excepción

✔ APIError

Capturar excepción

✔ JSON inválido

Fallback

Nunca lanzar 500.

---

# Fallback

Si OpenAI falla

Responder

```json
{
  "prioridad_sugerida": "media",
  "categoria_sugerida": "general",
  "resumen": "No fue posible generar sugerencias automáticas.",
  "confianza": 0.0
}
```

Así el endpoint siempre responde.

---

# Resultado esperado

```
Cliente

↓

POST

↓

JWT

↓

Schema Request

↓

Service

↓

Prompt

↓

OpenAI

↓

Structured Output

↓

Schema Response

↓

200 OK
```

---

# Archivos nuevos

```
backend/app/modules/ai/
    api/
        ai_routes.py

    services/
        ai_service.py

    schemas/
        ai_schemas.py

    prompts/
        enrich_task_system.txt
```

---

# Archivos modificados

```
backend/app/main.py

backend/.env.example

README.md
```

---

# Archivos que NO se tocan

```
database.py

security.py

tasks/

users/

auth/

models/

migrations/

frontend/

SQL/
```

---

# Commit del Día 10

Cuando todo esté probado:

```bash
git add .

git commit -m "feat(ai): implement task enrichment endpoint with structured output"
```

---

# Pull Request

```
feature/day-10-openai-agent-foundation

↓

development
```

---

# Merge

```
development

↓

main
```

---

## Mi única recomendación respecto a la estructura

No crearía el directorio:

```
backend/app/modules/ai/repositories/
```

En este día.

No existe persistencia, no hay consultas a base de datos ni repositorios que abstraer. Crear esa carpeta vacía solo añadiría estructura sin aportar funcionalidad al requisito evaluado. Si en el futuro el módulo IA almacenara historiales de inferencias o prompts, entonces sí tendría sentido introducir un repositorio. Para esta prueba técnica, mantener el módulo con **`api` + `services` + `schemas` + `prompts`** es la solución más simple, coherente y alineada con lo que realmente se evalúa.
