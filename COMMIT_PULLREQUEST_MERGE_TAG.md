# ============================================================

# Marquillas Task Manager

# Standard Development Workflow

# Document: COMMIT_PULLREQUEST_MERGE_TAG.md

# Version: 1.0

# Status: Active

# Owner: Development Team

# Last Update: 2026-07-17

# ============================================================

# Objetivo

Este documento define el procedimiento oficial para cerrar un día de desarrollo (Development Day) dentro del proyecto **Marquillas Task Manager**.

Ningún hito podrá ser versionado hasta completar las verificaciones técnicas definidas en este documento.

Este flujo garantiza:

- Integridad del repositorio.
- Consistencia entre Backend, Base de Datos y Docker.
- Versionado reproducible.
- Releases estables.
- Historial Git limpio.
- Pull Requests verificables.
- Tags únicamente sobre estados funcionales.

---

# Flujo oficial

Todo Development Day deberá seguir estrictamente el siguiente orden:

```
Desarrollo

↓

Validación técnica

↓

Commit

↓

Push

↓

Pull Request

↓

Merge

↓

Tag

↓

Nueva rama
```

Nunca invertir el orden.

Nunca crear Tags sobre código no validado.

---

# 1. Validación del código

Terminal:

PowerShell

Ruta:

```text
marquillas_task_manager/
```

Verificar archivos modificados:

```powershell
git status
```

Verificar errores de formato Git:

```powershell
git diff --check
```

---

# 2. Reconstrucción completa del Backend

Cuando se modifique cualquier archivo Python, FastAPI o configuración Docker.

```powershell
docker compose down
```

```powershell
docker compose build --no-cache backend
```

```powershell
docker compose up -d
```

---

# 3. Verificar inicio correcto

```powershell
docker compose logs backend --tail=100
```

Debe aparecer:

```text
Application startup complete

Uvicorn running
```

---

# 4. Validar migraciones

Consultar versión actual:

```powershell
docker compose exec backend alembic current
```

Consultar migraciones disponibles:

```powershell
docker compose exec backend alembic heads
```

Consultar historial:

```powershell
docker compose exec backend alembic history
```

Aplicar migraciones pendientes:

```powershell
docker compose exec backend alembic upgrade head
```

Verificar nuevamente:

```powershell
docker compose exec backend alembic current
```

---

# 5. Validar compilación Python

Compilar archivos modificados.

Ejemplo:

```powershell
docker compose exec backend python -m py_compile /app/app/main.py
```

No debe producir errores.

---

# 6. Verificar Swagger

Descargar OpenAPI:

```powershell
Invoke-WebRequest `
http://localhost:8000/openapi.json `
-OutFile openapi.json
```

Buscar nuevos endpoints.

Ejemplo:

```powershell
Select-String `
-Path .\openapi.json `
-Pattern "/api/tasks"
```

También abrir:

```
http://localhost:8000/docs
```

Actualizar navegador con:

```
CTRL + SHIFT + R
```

o

```
CTRL + F5
```

Confirmar que los nuevos endpoints aparecen en Swagger.

---

# 7. Validación funcional

Probar manualmente todos los endpoints nuevos.

Como mínimo verificar:

- operación correcta
- autenticación
- autorización
- validaciones
- códigos HTTP

Ejemplo:

```
201 Created

200 OK

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity
```

---

# 8. Validación Health

```powershell
Invoke-RestMethod http://localhost:8000/health
```

```powershell
Invoke-RestMethod http://localhost:8000/health/database
```

Ambos deben responder correctamente.

---

# 9. Validación Docker

```powershell
docker compose ps
```

Todos los servicios deben encontrarse en estado:

```
Up
```

---

# 10. Validación Pytest

Ejecutar:

```powershell
docker compose exec backend pytest
```

Si aún no existen pruebas automáticas, deberá quedar registrado en el GODS_PLAN correspondiente.

---

# 11. Commit

Agregar archivos.

```powershell
git add .
```

Verificar:

```powershell
git status
```

Commit usando Conventional Commits.

Ejemplo:

```powershell
git commit -m "feat(tasks): complete task domain foundation"
```

---

# 12. Push

```powershell
git push origin <feature-branch>
```

---

# 13. Pull Request

Crear Pull Request hacia:

```
development
```

Nunca hacia:

```
main
```

El Pull Request debe encontrarse completamente verde antes del Merge.

---

# 14. Merge

Una vez aprobado:

Merge

↓

development

---

# 15. Crear Tag

Cambiar a development.

```powershell
git checkout development
```

Actualizar:

```powershell
git pull origin development
```

Crear Tag:

```powershell
git tag -a vX.Y.Z-descriptive-name -m "Release description"
```

Enviar Tag:

```powershell
git push origin vX.Y.Z-descriptive-name
```

Nunca crear Tags sobre ramas Feature.

---

# 16. Nueva rama

Crear inmediatamente la rama del siguiente día.

Ejemplo:

```powershell
git checkout -b feature/day-04-task-query-foundation
```

Publicar:

```powershell
git push -u origin feature/day-04-task-query-foundation
```

---

# Checklist de cierre

Antes de cerrar un Development Day verificar:

- [ ] Código compilando.
- [ ] Docker reconstruido.
- [ ] Backend inicia correctamente.
- [ ] Migraciones aplicadas.
- [ ] Swagger actualizado.
- [ ] OpenAPI actualizado.
- [ ] Endpoints funcionales.
- [ ] Health OK.
- [ ] Database Health OK.
- [ ] Git limpio.
- [ ] Commit realizado.
- [ ] Push realizado.
- [ ] Pull Request creado.
- [ ] Merge realizado.
- [ ] Tag publicado.
- [ ] Nueva rama creada.

---

# Política del proyecto

No se versionan:

- funcionalidades incompletas;
- endpoints no registrados;
- migraciones sin aplicar;
- código sin validar;
- Docker sin reconstruir;
- Swagger desactualizado;
- commits experimentales.

Cada Tag representa un estado funcional, reproducible y estable del proyecto.
