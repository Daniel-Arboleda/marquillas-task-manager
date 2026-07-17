
# Objetivo del documento

El documento no debe repetir el README.

Debe responder una sola pregunta:

> **¿Cómo sabemos que la API funciona y qué fue validado?**

Eso es exactamente lo que buscan las pruebas técnicas.

---

# Estructura recomendada

## 1. Encabezado

```text
======================================================

Marquillas Task Manager

API VALIDATION REPORT

Version: 0.4.0

Status:
Validated

Date

Author

======================================================
```

---

## 2. Objetivo

Explicar algo como:

> Este documento registra las validaciones funcionales realizadas sobre la API durante el desarrollo del proyecto.

No más de medio párrafo.

---


## 3. Ambiente de pruebas

Algo parecido a:

```text
Docker Compose

Backend
FastAPI

Database
SQL Server 2022

Authentication
JWT

API
REST

Swagger

OpenAPI

Alembic
```


# Swagger

Documentación interactiva validada.

Una vez iniciado el proyecto mediante Docker Compose:

```bash
docker compose up
```

la documentación de la API se encuentra disponible en:

```
http://localhost:8000/docs
```

Desde esta interfaz es posible:

- consultar todos los endpoints disponibles;
- revisar los modelos Request/Response;
- autenticarse mediante JWT;
- ejecutar cada operación directamente desde el navegador;
- validar respuestas y códigos HTTP sin utilizar herramientas externas.

Especificación OpenAPI:

```
http://localhost:8000/openapi.json
```

Estado

✅

---

## 4. Estado general

Tabla.

| Validación | Estado |
| ----------- | ------ |
| Docker      | ✅     |
| Backend     | ✅     |
| SQL Server  | ✅     |
| Swagger     | ✅     |
| OpenAPI     | ✅     |
| Alembic     | ✅     |
| JWT         | ✅     |
| Health      | ✅     |
| CRUD Tasks  | ✅     |
| RBAC        | ✅     |

---

# Luego un bloque por módulo.

---

# HEALTH

Endpoint

```text
GET /health
```

Payload

```text
N/A
```

Respuesta esperada

```json
{
  "status":"ok",
  "service":"marquillas-task-manager-api",
  "version":"0.4.0"
}
```

Resultado

```text
200 OK
```

Estado

✅

---

# Database Health

Lo mismo.

---

# AUTH

## Login correcto

Endpoint

```text
POST /api/auth/login
```

Payload

Aquí sí usaría el payload  **corregido** , aunque originalmente haya cambiado durante las pruebas.

```json
{
  "email":"admin@test.com",
  "password":"12345678"
}
```

Esperado

```text
200 OK
```

Respuesta

```json
{
  "access_token":"JWT",
  "token_type":"bearer"
}
```

Estado

✅

---

## Login inválido

Payload

```json
{
  "email":"admin@test.com",
  "password":"incorrect"
}
```

Esperado

```text
401 Unauthorized
```

Estado

✅

---

# CURRENT USER

```
GET /api/auth/me
```

Con JWT válido

200

Con JWT inválido

401

---

# USERS

Administrador

```
POST /api/users
```

Payload

```json
{
  "name":"Daniel",
  "email":"daniel@test.com",
  "password":"12345678",
  "role":"member"
}
```

201

---

Duplicado

409

---

Member intentando crear usuario

403

---

# TASKS

Aquí documentaría absolutamente todo.

---

## POST

Payload válido

```json
{
  "title":"Implement JWT middleware",
  "description":"Protect API endpoints.",
  "priority":"high",
  "assigned_user_id":1,
  "due_date":"2026-08-01T10:00:00Z"
}
```

Respuesta

201

---

Payload inválido

Título vacío

422

---

Prioridad inválida

422

---

Fecha pasada

422

---

Usuario inexistente

404

(si ese es el comportamiento implementado)

---

## GET

Lista

200

---

Por id

200

---

No encontrado

404

---

## PATCH

200

---

Task inexistente

404

---

Due date inválida

422

---

Estado inválido

422

---

## DELETE

204

---

No encontrado

404

---

# RBAC

Aquí haría una tabla.

| Operación              | Admin | Member |
| ----------------------- | ----- | ------ |
| Crear usuario           | ✅    | ❌403  |
| Crear tarea propia      | ✅    | ✅     |
| Reasignar tarea         | ✅    | ❌403  |
| Actualizar tarea propia | ✅    | ✅     |
| Actualizar tarea ajena  | ✅    | ❌403  |
| Eliminar tarea ajena    | ✅    | ❌403  |

---

# Swagger

Validado

```
/docs
```

OpenAPI generado

```
/openapi.json
```

Estado

✅

---

# Docker

Validado

```
docker compose build
```

```
docker compose up
```

```
docker compose ps
```

Todos

```
UP
```

---

# Alembic

```
alembic current
```

```
002_task_domain_foundation (head)
```

---

# Pytest

Aquí sería completamente transparente.

No pondría:

```
Tests completos
```

Porque no sería cierto.

Pondría:

```
Infraestructura de pruebas validada.

pytest instalado.

Descubrimiento funcionando.

Implementación de pruebas automáticas:
Pendiente del siguiente hito.
```

Eso demuestra honestidad técnica.

---

# Evidencia

Aquí colocaría una tabla.

| Evidencia       | Resultado |
| --------------- | --------- |
| Docker Build    | ✅        |
| Docker Up       | ✅        |
| Health          | ✅        |
| Database Health | ✅        |
| Swagger         | ✅        |
| OpenAPI         | ✅        |
| CRUD Tasks      | ✅        |
| JWT             | ✅        |
| Roles           | ✅        |
| Alembic         | ✅        |

---

# Estado Final

Y terminaría con algo como:

```text
Estado del Proyecto

Backend

VALIDADO

API

VALIDADA

Docker

VALIDADO

Migraciones

VALIDADAS

Autenticación

VALIDADA

RBAC

VALIDADO

CRUD

VALIDADO

Swagger

VALIDADO

OpenAPI

VALIDADO

Proyecto listo para continuar con el Día 04.
```

---

## Hay un detalle que mejoraría antes de versionar

En la evidencia que compartiste todavía aparecen referencias a la versión **0.1.0** en algunos lugares, por ejemplo:

* `backend/app/main.py`
* `openapi.json`
* probablemente `backend/Dockerfile`
* probablemente `frontend/Dockerfile`
* posiblemente `/health`

Antes de generar el `API_VALIDATION_REPORT.md`, actualizaría **todas** las referencias de versión a **v0.4.0** para que:

* Swagger,
* OpenAPI,
* Health,
* Docker labels,
* y el propio reporte

sean completamente consistentes. Esa coherencia transmite un nivel de acabado mucho más profesional al evaluador.
