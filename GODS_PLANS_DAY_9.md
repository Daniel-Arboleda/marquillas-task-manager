
# Estado que considero que estás cerrando

Lo que realmente terminaste no es solo "UI".

Terminaste una estabilización bastante amplia que incluye:

* Refactor del flujo de edición de tareas.
* Estabilización Backend/Frontend.
* Ajustes del dominio de tareas.
* Correcciones de validaciones.
* Ajustes de repositorios y servicios.
* Refactor de componentes React.
* Arquitectura tipo microfrontend en el frontend.
* Documentación de arquitectura de BD.
* Seed completo.
* Documentación de comandos.
* Mejoras en Docker.
* Mejoras de pruebas.

Eso merece un commit mucho más descriptivo.

---

# Commit recomendado

```text
feat(application): stabilize full-stack architecture and complete database foundation
```

Es suficientemente amplio para representar el trabajo realizado sin ser ambiguo.

---

# Tag recomendado

No intentaría "inventar" un `v0.8.0-ui`.

Yo usaría algo representativo del resultado.

```text
v0.8.0-application-stabilization
```

o incluso

```text
v0.8.0-full-stack-stabilization
```

Me parece el mejor nombre.

---

# Flujo Git recomendado

Desde:

```
D:\ProyectosFlutter\marquillas_task_manager
```

## 1

Verificar diferencias

```powershell
git diff --check
```

---

## 2

Agregar todo

```powershell
git add .
```

---

## 3

Verificar

```powershell
git status
```

Debe quedar únicamente:

```
Changes to be committed
```

---

## 4

Commit

```powershell
git commit -m "feat(application): stabilize full-stack architecture and complete database foundation"
```

---

## 5

Push

```powershell
git push origin feature/day-08-feature-complete-ui
```

---

## 6

Crear Pull Request

```
feature/day-08-feature-complete-ui

↓

development
```

---

## 7

Merge

```
development
```

---

## 8

Cambiar

```powershell
git checkout development
```

---

## 9

Actualizar

```powershell
git pull origin development
```

---

## 10

Crear Tag

```powershell
git tag -a v0.8.0-application-stabilization -m "Application stabilization, database documentation and demo seed"
```

---

## 11

Publicar Tag

```powershell
git push origin v0.8.0-application-stabilization
```

---

# Nuevo Día

Aquí sí cambiaría la numeración.

No seguiría pensando en "0.8".

Eso ya es historia del repositorio.

El siguiente bloque de trabajo es un **nuevo día de desarrollo**.

Yo lo llamaría:

```
Day 09
SQL Server Foundation
```

Rama:

```powershell
git checkout -b feature/day-09-sql-server-foundation
```

```powershell
git push -u origin feature/day-09-sql-server-foundation
```

---

# GODS_PLAN_DAY_09.md

Objetivo

Completar completamente el Punto 3 de la prueba técnica.

No tocar React.

No tocar FastAPI.

No tocar Docker.

No tocar autenticación.

No tocar UI.

Solo SQL Server.

---

# Alcance

## Crear

```
sql/
```

---

## Crear

```
sql/consultas.sql
```

---

## Consulta 1

Reporte

Debe incluir

```
COUNT()

GROUP BY

SUM() OVER()

CAST()

ROUND()

%
```

---

## Consulta 2

Ranking

Debe utilizar

```
ROW_NUMBER()

RANK()

DENSE_RANK()
```

comparando resultados.

---

## Consulta 3

Crear

```
sp_reasignar_tarea
```

Debe implementar

```
BEGIN TRAN

COMMIT

ROLLBACK

TRY

CATCH

THROW
```

---

## Validaciones

Debe verificar

Administrador

```
users.role='admin'
```

---

Usuario destino

Existe

---

Tarea

Existe

---

Actualizar

```
tasks.assigned_user_id
```

---

Registrar

```
task_history
```

---

# Archivos

Crear

```
sql/consultas.sql
```

Modificar

```
README.md
```

Agregar sección

```
Consultas SQL Server
```

---

# No intervenir

Backend

Frontend

Docker

Alembic

React

JWT

Tests

Seed

Migraciones

---

# Criterio de cierre del Día 09

* `consultas.sql` completo.
* Las tres consultas ejecutan correctamente sobre SQL Server.
* Comentario descriptivo antes de cada consulta.
* Procedimiento almacenado validado.
* README actualizado con una referencia al archivo SQL.

Con ese cierre, el proyecto quedaría con el **Punto 3 (15%) completamente cubierto**, sin introducir deuda técnica ni cambios innecesarios en módulos que ya están estabilizados.
