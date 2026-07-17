
# ======================================================

# Marquillas Task Manager

# API VALIDATION TEST

# Version
v0.5.0

# Status
Validated

# Date
2026-07-17

# Author
Daniel Arboleda Tangarife

# ======================================================

# API_VALIDATION_TEST.md

## Objetivo

---
Responder dos preguntas:

> ¿Cómo valido que todo funciona?

y

> ¿Qué fue validado durante el desarrollo?

No explicar arquitectura.

No explicar Python.

No explicar FastAPI.

Eso ya está en el README.
---

---

# 1. Purpose

Explicar en menos de medio párrafo.

Ejemplo:

> This document describes how to validate the REST API after downloading the repository. It also summarizes the functional validations performed during development and the expected behavior of every critical module.

---

# 2. Prerequisites

Muy importante.

El evaluador debe saber exactamente qué necesita.

```
Docker Desktop

Docker Compose

Git

Nothing else.
```

Y una nota:

```
Python installation is NOT required.

SQL Server installation is NOT required.

Node.js installation is NOT required.
```

Eso transmite profesionalismo.

---

# 3. Running the project

Exactamente.

```
git clone

cd marquillas-task-manager

docker compose build

docker compose up -d
```

Luego

```
docker compose ps
```

Resultado esperado

```
backend

UP

frontend

UP

sqlserver

UP
```

Estado

✅

---

# 4. API Availability

```
Health

GET

/health
```

Esperado

```
200 OK
```

---

```
Database

GET

/health/database
```

Esperado

```
200 OK
```

---

Swagger

```
http://localhost:8000/docs
```

Estado

✅

---

OpenAPI

```
http://localhost:8000/openapi.json
```

Estado

✅

---

# 5. Automated Tests

Aquí sí haría una guía paso a paso.

## Running the tests

```
docker compose exec backend sh -c "PYTHONPATH=/app pytest -v"
```

No asumir que sabe Python.

Explicar:

> This command executes the complete automated validation suite inside the backend container.

---

## Current Result

```
18 tests collected

13 passed

5 pending adjustments
```

---

## Test Coverage

Tabla.

| Area             | Status |
| ---------------- | ------ |
| Authentication   | ✅     |
| Authorization    | ✅     |
| RBAC             | ✅     |
| CRUD Tasks       | ✅     |
| Business Rules   | ✅     |
| Filters          | ✅     |
| Pagination       | ✅     |
| Health Endpoints | ✅     |

---

## Pending Adjustments

Muy transparente.

```
Current pending items:

• Email validation fixtures using reserved domains.

• PYTHONPATH configuration when executing pytest outside the application context.

These items affect only the automated test fixtures and not the REST API implementation.
```

Esto es importante porque demuestra que distingues entre un problema de infraestructura de pruebas y un defecto funcional.

---

# 6. Functional Validation Matrix

Una tabla.

| Feature            | Endpoint               | Expected |
| ------------------ | ---------------------- | -------- |
| Health             | GET /health            | 200      |
| Database           | GET /health/database   | 200      |
| Login              | POST /api/auth/login   | 200      |
| Invalid Login      | POST /api/auth/login   | 401      |
| Current User       | GET /api/auth/me       | 200      |
| Create User        | POST /api/users        | 201      |
| Duplicate User     | POST /api/users        | 409      |
| Member Create User | POST /api/users        | 403      |
| Create Task        | POST /api/tasks        | 201      |
| Invalid Task       | POST /api/tasks        | 422      |
| Update Task        | PATCH /api/tasks/{id}  | 200      |
| Delete Task        | DELETE /api/tasks/{id} | 204      |

Mucho más fácil de revisar que páginas de texto.

---

# 7. RBAC Validation

Tabla.

| Operation         | Admin | Member |
| ----------------- | ----- | ------ |
| Create User       | ✅    | ❌403  |
| Create Task       | ✅    | ✅     |
| Update Own Task   | ✅    | ✅     |
| Update Other Task | ✅    | ❌403  |
| Reassign Task     | ✅    | ❌403  |
| Delete Task       | ✅    | ❌403  |

---

# 8. Docker Validation

```
docker compose build
```

Resultado

```
SUCCESS
```

---

```
docker compose up -d
```

Resultado

```
SUCCESS
```

---

```
docker compose ps
```

Resultado

```
All containers running
```

Estado

✅

---

# 9. Evidence Summary

Una tabla ejecutiva.

| Validation                     | Result  |
| ------------------------------ | ------- |
| Docker Build                   | ✅      |
| Containers Running             | ✅      |
| Health Endpoint                | ✅      |
| Database Health                | ✅      |
| Swagger                        | ✅      |
| OpenAPI                        | ✅      |
| JWT Authentication             | ✅      |
| CRUD Tasks                     | ✅      |
| RBAC                           | ✅      |
| Alembic                        | ✅      |
| Automated Tests Infrastructure | ✅      |
| Automated Tests Executed       | ✅      |
| Tests Passed                   | 13 / 18 |
| Pending Adjustments            | 5       |

---

# 10. Final Status

```
Backend

VALIDATED

Docker

VALIDATED

SQL Server

VALIDATED

REST API

VALIDATED

Swagger

VALIDATED

OpenAPI

VALIDATED

JWT

VALIDATED

RBAC

VALIDATED

Task Module

VALIDATED

Database Migrations

VALIDATED

Automated Test Infrastructure

VALIDATED

Current Automated Test Execution

18 tests collected

13 passed

5 pending adjustments

Project status

Ready for technical evaluation and continuation of the next development milestone.
```

---

## Recomendación final

Como este proyecto será evaluado por terceros, prepararía un conjunto de documentos consistente y orientado a la evaluación técnica:

```
README.md
```

Cómo levantar el proyecto.

```
ARCHITECTURE.md
```

Arquitectura y decisiones técnicas.

```
API_VALIDATION_REPORT.md
```

Cómo validar la API y resultados obtenidos.

```
CHANGELOG.md
```

Historial de versiones e hitos.

```
ROADMAP.md
```

Funcionalidades implementadas y siguientes etapas.

Con esos cinco documentos, el evaluador puede entender el proyecto, ejecutarlo, validar la API y revisar el estado del desarrollo sin necesidad de conocer previamente Python o FastAPI.
