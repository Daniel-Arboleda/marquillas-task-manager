

# ============================================================

# Marquillas Task Manager

# Document: GODS_PLAN_DAY_03.md

# Title: Task Query Foundation

# Version: 1.0

# Status: Draft | In Progress | Approved | Completed

# Author: Development Team

# Created: 2026-07-17

# Last Update: 2026-07-17

# ============================================================

## Estructura del Día 03

El documento debe ser un plan de ejecución, no solo una lista de tareas. Debería mantener el mismo nivel de detalle que el Día 02.

La estructura recomendada es:

```text
Estado esperado al cerrar el Día 03

Objetivo

Restricción de alcance

Estado inicial

Plan de ejecución

Día 03.1
Día 03.2
...
Día 03.16

Validación

Archivos

Seguridad

Git

Siguiente hito
```

---

# Estado esperado al cerrar el Día 03

Al finalizar este día el backend debe cumplir:

## CRUD

```text
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/{id}
PATCH  /api/tasks/{id}
DELETE /api/tasks/{id}
```

---

## Dominio

Existen completamente implementados

```text
Task
TaskHistory
```

---

## Validaciones

Backend

```text
✓ título obligatorio

✓ prioridad válida

✓ fecha futura

✓ estado válido

✓ usuario asignado existente

✓ permisos

✓ historial automático
```

---

## Tests

Mínimo

```text
4 pruebas nuevas
```

---

# Restricción de alcance

No desarrollar todavía

```text
Frontend

Filtros

Paginación

LLM

Stored Procedure

Window Functions

README

Agente
```

---

# Día 03.1

## Crear

```text
backend/migrations/versions/002_task_domain_foundation.py
```

Responsabilidad

Crear tablas

```text
tasks

task_history
```

Agregar

```text
PK

FK

CHECK

INDEX
```

---

# Día 03.2

## Crear

```text
backend/app/modules/tasks/domain/task_model.py
```

Responsabilidad

Solo ORM.

---

# Día 03.3

## Crear

```text
backend/app/modules/tasks/domain/task_history_model.py
```

Responsabilidad

Modelo historial.

---

# Día 03.4

## Modificar

```text
backend/app/modules/tasks/__init__.py
```

Registrar dominio.

---

# Día 03.5

## Crear

```text
backend/app/modules/tasks/schemas/task_schemas.py
```

Crear

```text
TaskCreate

TaskUpdate

TaskResponse

TaskFilters
```

---

# Día 03.6

## Crear

```text
backend/app/modules/tasks/repositories/task_repository.py
```

Funciones

```text
create

get

list

update

delete

history
```

Sin reglas.

---

# Día 03.7

## Crear

```text
backend/app/modules/tasks/services/task_service.py
```

Aquí vive toda la lógica.

Implementar

```text
validaciones

commit

rollback

auditoría
```

---

# Día 03.8

## Crear

```text
backend/app/modules/tasks/api/task_routes.py
```

Endpoints

```text
POST

GET

GET/{id}

PATCH

DELETE
```

---

# Día 03.9

## Modificar

```text
backend/app/main.py
```

Registrar

```text
task_router
```

---

# Día 03.10

## Crear

```text
backend/tests/test_tasks.py
```

---

# Día 03.11

Validaciones

```text
Título obligatorio

Prioridad

Fecha

Estado
```

---

# Día 03.12

Permisos

Admin

```text
Puede reasignar
```

Member

```text
No puede reasignar tareas de otros.
```

---

# Día 03.13

Historial

Registrar

```text
Creación

Actualización

Reasignación

Cambio de estado
```

---

# Día 03.14

Compilación

```text
py_compile
```

---

# Día 03.15

Swagger

Validar

```text
POST

GET

PATCH

DELETE
```

---

# Día 03.16

Tests

```text
pytest
```

---

# Archivos

## Crear

```text
backend/migrations/versions/002_task_domain_foundation.py

backend/app/modules/tasks/domain/task_model.py

backend/app/modules/tasks/domain/task_history_model.py

backend/app/modules/tasks/schemas/task_schemas.py

backend/app/modules/tasks/repositories/task_repository.py

backend/app/modules/tasks/services/task_service.py

backend/app/modules/tasks/api/task_routes.py

backend/tests/test_tasks.py
```

---

## Modificar

```text
backend/app/main.py

backend/app/modules/tasks/__init__.py
```

---

# No modificar

```text
Frontend

Usuarios

Auth

Security

Config
```

Porque ya quedaron cerrados.

---

# Validaciones

```text
POST crea.

GET lista.

GET{id} obtiene.

PATCH actualiza.

DELETE elimina.

Historial existe.

Tests pasan.

Swagger correcto.
```

---

# Commit

```text
feat(tasks): implement task domain foundation
```

---

# Pull Request

```text
feature/day-03-task-domain-foundation

↓

development
```

---

# Tag

Después del merge

```text
v0.4.0-task-domain-foundation
```

---

# Siguiente hito

No llamarlo simplemente Día 04.

Debe quedar documentado como

```text
Día 04 — Task Query Layer
```

Porque el objetivo ya no será crear entidades, sino enriquecer el dominio existente mediante:

* filtros por estado, prioridad y asignado,
* paginación,
* ordenamiento,
* búsqueda,
* optimización de consultas.

Ese orden mantiene una evolución coherente del proyecto: primero el modelo de negocio, luego la capa de consulta, después el frontend, y finalmente las capacidades de SQL e IA sobre una base estable.

# CORRECIÓN DEUDA TÉCNICA FUTURA LIBRERIAS DE PRUEBAS

Sí, este es el momento adecuado para resolver esa deuda. Es pequeña, está bien localizada y evitará interrupciones cuando llegues al  **03.10 Tests** .

No crearía un `requirements-dev.txt` en esta prueba porque añadiría otra pieza de infraestructura que el evaluador tendría que conocer. Dado que la prueba se ejecuta íntegramente en Docker, es perfectamente razonable incluir las dependencias de prueba en `requirements.txt`.

## `backend/requirements.txt`

Solo agregaría las dependencias mínimas que vas a utilizar.

```text
fastapi==0.116.1
uvicorn[standard]==0.35.0

sqlalchemy==2.0.43
alembic==1.16.4

pydantic==2.11.7
pydantic-settings==2.10.1

python-dotenv==1.1.1

pyodbc==5.2.0

python-jose[cryptography]==3.5.0

passlib[bcrypt]==1.7.4
bcrypt==4.3.0

python-multipart==0.0.20
email-validator==2.3.0

pytest==8.4.1
httpx==0.28.1
```

### ¿Por qué solo estas?

* `pytest` → framework de pruebas.
* `httpx` → cliente HTTP utilizado habitualmente para probar FastAPI.

No agregaría todavía:

* `pytest-cov`
* `pytest-asyncio`
* `factory-boy`
* `faker`

Porque el alcance actual no los requiere. Si más adelante decides medir cobertura o escribir pruebas asíncronas, podrás incorporarlos en un hito específico.

---

# Refrescar Docker

Como cambiaste `requirements.txt`, el contenedor debe reconstruirse.

Desde PowerShell en:

```text
D:\ProyectosFlutter\marquillas_task_manager
```

Ejecuta exactamente en este orden:

## 1. Detener contenedores

```powershell
docker compose down
```

---

## 2. Reconstruir imágenes

```powershell
docker compose build --no-cache backend
```

Esto fuerza la reinstalación de todas las dependencias del backend.

---

## 3. Levantar nuevamente

```powershell
docker compose up -d
```

---

## 4. Verificar que inició

```powershell
docker compose ps
```

Debe mostrar el backend como:

```text
Up
```

---

## 5. Confirmar que pytest quedó instalado

```powershell
docker compose exec backend pytest --version
```

Debe responder algo similar a:

```text
pytest 8.4.1
```

---

## 6. Validar FastAPI

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Debe responder:

```json
{
  "status": "ok"
}
```

---

## 7. Validar la base

```powershell
Invoke-RestMethod http://localhost:8000/health/database
```

Debe responder:

```json
{
  "status": "ok"
}
```

---

## 8. Confirmar Alembic

```powershell
docker compose exec backend alembic current
```

Debe indicar:

```text
002_task_domain_foundation (head)
```

---

## 9. Confirmar compilación

```powershell
docker compose exec backend python -m py_compile /app/app/main.py
```

---

## 10. Confirmar pytest operativo

Aunque todavía no existan pruebas, puedes ejecutar:

```powershell
docker compose exec backend pytest
```

Si aún no hay archivos `test_*.py`, lo esperado será un mensaje como:

```text
collected 0 items
```

Eso es correcto: significa que `pytest` ya está disponible y listo para cuando implementes el paso  **03.10** .

---

# Estado del Día 03

Después de esto quedaría:

```text
✓ 03.1 Migración

✓ 03.2 ORM

✓ 03.3 Historial

✓ 03.4 Registro

✓ 03.5 Schemas

✓ Infraestructura de pruebas lista

↓

03.6 Repository

03.7 Service

03.8 Endpoints

03.9 Router

03.10 Tests
```

Con esa preparación eliminas una deuda técnica antes de que aparezca y mantienes el proyecto alineado con el flujo esperado por la prueba técnica.

## Estado final Día 03

✓ Infraestructura de pytest instalada.

✓ Descubrimiento de pruebas funcionando.

Pendiente:

Implementación de pruebas automáticas (Día 04).
