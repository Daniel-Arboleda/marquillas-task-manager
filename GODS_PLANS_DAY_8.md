
No está completamente cerrado todavía. El código sí quedó publicado, pero antes de desarrollar el Día 08 debes corregir una desalineación:

* `main` quedó en `c58d23f`, incluyendo la resolución del conflicto.
* `development` quedó en `0c7abb8`.
* `feature/day-08-feature-complete-ui` nació desde ese `development` anterior.
* Por tanto, `main` contiene un commit que aún no está en `development` ni en la rama del Día 08.

Si desarrollas así, el próximo PR de `development` hacia `main` puede volver a presentar el mismo conflicto.

# 1. Sincronización obligatoria antes del Día 08

Ejecuta exactamente:

```powershell
git checkout main
git pull origin main
git status
```

Después:

```powershell
git checkout development
git pull origin development
git merge --ff-only main
git push origin development
```

Como `main` contiene el merge de `development`, este paso debería producir un avance rápido, sin nuevo commit de merge.

Luego actualiza la rama del Día 08:

```powershell
git checkout feature/day-08-feature-complete-ui
git pull origin feature/day-08-feature-complete-ui
git merge --ff-only development
git push origin feature/day-08-feature-complete-ui
```

Finalmente:

```powershell
git status
git log --oneline --decorate --graph -12
```

Estado esperado:

```text
On branch feature/day-08-feature-complete-ui
Your branch is up to date with 'origin/feature/day-08-feature-complete-ui'.

nothing to commit, working tree clean
```

Y los tres punteros deben contener la línea de evolución de `c58d23f`:

```text
main
development
feature/day-08-feature-complete-ui
```

No necesitas crear un Pull Request para esta sincronización porque la rama del Día 08 aún no tiene desarrollo propio.

---

# 2. Lo que sí está configurado y lo que todavía debes revisar

La configuración local y remota básica está correcta:

```text
feature/day-08-feature-complete-ui
    ↕
origin/feature/day-08-feature-complete-ui
```

El mensaje:

```text
set up to track 'origin/feature/day-08-feature-complete-ui'
```

confirma que los próximos:

```powershell
git pull
git push
```

trabajarán contra la rama remota adecuada.

Sin embargo, los logs no demuestran que GitHub tenga reglas de protección configuradas. Para garantizar versionamiento profesional, en GitHub revisa:

```text
Repository
→ Settings
→ Branches
→ Branch protection rules
```

## Regla para `main`

Configura:

```text
Branch name pattern:
main
```

Activa:

```text
Require a pull request before merging
Require approvals
Require conversation resolution before merging
Do not allow force pushes
Do not allow deletions
```

Si todavía trabajas solo, una aprobación obligatoria puede bloquearte. En ese caso:

```text
Require a pull request before merging: sí
Required approvals: 0 o desactivado temporalmente
```

## Regla para `development`

Configura:

```text
Branch name pattern:
development
```

Activa:

```text
Require a pull request before merging
Require conversation resolution before merging
Do not allow force pushes
Do not allow deletions
```

El flujo desde ahora debe ser:

```text
feature/*
   ↓ Pull Request
development
   ↓ Pull Request
main
```

No vuelvas a ejecutar merges locales hacia `development` o `main` si quieres que aparezcan en la pestaña **Pull requests** de GitHub.

---

# Día 08 — Feature Complete Task Management UI

## Rama

```text
feature/day-08-feature-complete-ui
```

## Versión objetivo

```text
v0.8.0-feature-complete-ui
```

## Objetivo del día

Completar la experiencia funcional de gestión de tareas sobre la arquitectura existente, sin reestructurar innecesariamente el proyecto.

El Día 08 debe dejar:

* listado completo y estable;
* creación y edición sin navegación innecesaria;
* detalle e historial integrados;
* filtros y paginación conectados al backend;
* indicadores calculados realmente en backend;
* acciones protegidas según rol;
* prevención de envíos duplicados;
* estados de carga, error y vacío consistentes;
* backend y frontend alineados;
* pruebas y compilación limpias;
* integración mediante Pull Request.

## Fuera de alcance

No se debe introducir hoy:

* microservicios;
* Redux;
* un design system completo;
* WebSockets;
* multi-tenancy;
* nuevos modelos de base de datos;
* auditoría genérica;
* idempotencia distribuida;
* reestructuración total por features;
* nuevas dependencias sin necesidad real.

Este proyecto de Marquillas no es actualmente multi-tenant. No debes añadir `tenant_id` artificialmente. La separación aplicable es:

* `admin`: visibilidad y administración global.
* `member`: acceso permitido según asignación y reglas existentes.

---

# 3. Contrato funcional del Día 08

## Flujo principal

```text
Usuario inicia sesión
        ↓
Consulta tareas
        ↓
Filtra / pagina / busca
        ↓
Abre detalle
        ↓
Consulta historial
        ↓
Crea o edita desde drawer
        ↓
Backend valida permisos y transición
        ↓
UI refresca listado y detalle
```

## Criterios funcionales

### Administrador

Puede:

```text
- listar todas las tareas;
- filtrar tareas;
- crear tareas;
- asignar usuarios;
- editar tareas;
- consultar historial;
- eliminar tareas según la regla vigente.
```

### Miembro

Puede:

```text
- consultar las tareas permitidas;
- consultar el detalle permitido;
- actualizar únicamente operaciones autorizadas;
- no acceder a acciones administrativas;
- no manipular usuarios o tareas fuera de su alcance.
```

La autorización real debe permanecer en backend. Ocultar botones en React no sustituye la seguridad del endpoint.

---

# 4. Backend

No se necesita migración de base de datos para este día.

## 4.1 `backend/app/modules/tasks/schemas/task_schemas.py`

**Acción:** modificar.

Agregar el contrato de resumen de tareas:

```python
TaskSummaryResponse
```

Campos mínimos:

```text
total
pending
in_progress
completed
low_priority
medium_priority
high_priority
```

Los valores deben ser enteros no negativos.

No devolver modelos SQLAlchemy directamente.

---

## 4.2 `backend/app/modules/tasks/repositories/task_repository.py`

**Acción:** modificar.

Agregar una consulta agregada para calcular los indicadores usando SQL:

```text
COUNT
CASE
GROUP BY o expresiones agregadas equivalentes
```

La consulta debe:

* usar parámetros gestionados por SQLAlchemy;
* evitar SQL construido mediante concatenación;
* respetar el alcance del usuario autenticado;
* reutilizar filtros permitidos cuando corresponda;
* ejecutar los cálculos en base de datos;
* no cargar todas las tareas en memoria para contarlas.

Operación esperada:

```python
get_summary(...)
```

No debe contener reglas HTTP ni lanzar `HTTPException`.

---

## 4.3 `backend/app/modules/tasks/services/task_query_service.py`

**Acción:** modificar.

Agregar:

```python
get_task_summary(...)
```

Responsabilidades:

* recibir el usuario autenticado;
* determinar el alcance permitido;
* llamar al repositorio;
* transformar el resultado a un esquema estable;
* no duplicar reglas de autorización ya centralizadas.

Para `member`, el resumen debe corresponder al mismo universo de tareas que puede consultar.

---

## 4.4 `backend/app/modules/tasks/services/task_service.py`

**Acción:** modificar solo si actúa como fachada pública.

Exponer la operación:

```python
get_summary(...)
```

No replicar la consulta ni la validación.

---

## 4.5 `backend/app/modules/tasks/api/task_routes.py`

**Acción:** modificar.

Agregar:

```http
GET /api/v1/tasks/summary
```

Requisitos:

```text
- autenticación JWT obligatoria;
- autorización mediante dependencias existentes;
- response_model explícito;
- sin parámetros arbitrarios;
- sin SQL en la ruta;
- sin exposición de excepciones internas;
- retorno consistente.
```

La ruta `/summary` debe declararse antes de rutas dinámicas como:

```http
GET /api/v1/tasks/{task_id}
```

De lo contrario, FastAPI podría intentar interpretar `summary` como `task_id`, dependiendo del tipo y orden de rutas.

---

## 4.6 `backend/tests/test_tasks.py`

**Acción:** modificar.

Agregar pruebas para:

```text
1. admin obtiene resumen global correcto;
2. member obtiene únicamente el resumen permitido;
3. usuario no autenticado recibe 401;
4. contadores cambian al crear o actualizar tareas;
5. transición inválida sigue siendo rechazada;
6. parámetros maliciosos no modifican la consulta;
7. la respuesta nunca contiene datos privados de usuarios.
```

Debido al conflicto anterior, revisa primero que el archivo no contenga marcas residuales:

```powershell
Select-String -Path backend/tests/test_tasks.py -Pattern "<<<<<<<|=======|>>>>>>>"
```

El comando no debe devolver resultados.

---

# 5. Frontend

## 5.1 `frontend/src/api/taskApi.js`

**Acción:** modificar.

Agregar:

```javascript
getTaskSummary()
```

Debe usar `httpClient.js`.

No repetir:

* manejo manual del token;
* base URL;
* lógica de `401`;
* serialización genérica.

---

## 5.2 `frontend/src/hooks/useTasks.js`

**Acción:** modificar.

Consolidar:

* carga del listado;
* filtros;
* paginación;
* recarga;
* error;
* estado de carga;
* actualización después de crear, editar o eliminar.

Evitar llamadas duplicadas causadas por dependencias inestables en `useEffect`.

Los filtros enviados al backend deben salir exclusivamente de una lista controlada.

El contrato oficial del backend para el Día 08 utiliza `assigned_user_id`, validado mediante la suite automatizada de 25 pruebas. El frontend debe mantener este contrato para evitar incompatibilidades y preservar la alineación con la API.

```text
search
status
priority
assigned_user_id
page
page_size
```

No aceptar nombres de campo construidos por el usuario para ordenar o filtrar.

Los filtros deben normalizarse antes de enviarse al backend, descartando cualquier clave no incluida en esta lista blanca.

## Justificación técnica

Esta actualización deja consistente todo el proyecto:

| Componente              | Estado               |
| ----------------------- | -------------------- |
| API FastAPI             | `assigned_user_id` |
| Repositorio             | `assigned_user_id` |
| Servicios               | `assigned_user_id` |
| Endpoint                | `assigned_user_id` |
| Tests (25/25)           | `assigned_user_id` |
| Documentación Día 08  | `assigned_user_id` |
| Frontend (`useTasks`) | `assigned_user_id` |

De esta forma:

* no rompes ninguna de las **25 pruebas** ya aprobadas;
* no necesitas modificar backend, repositorio ni servicios;
* el contrato REST queda único y consistente;
* `useTasks.js` podrá implementar la lista blanca de filtros sin realizar transformaciones adicionales entre `assigned_to` y `assigned_user_id`;
* se evita mantener dos nombres para el mismo concepto, reduciendo deuda técnica y posibles errores futuros.

Con esta corrección, el plan del Día 08 queda alineado con el estado real del proyecto y puedes continuar con el desarrollo de `frontend/src/hooks/useTasks.js` sin introducir incompatibilidades.

---

## 5.3 `frontend/src/hooks/useTask.js`

**Acción:** modificar.

Asegurar:

```text
- carga de detalle;
- carga de historial;
- edición;
- eliminación;
- estados separados de error;
- no ejecutar GET después de DELETE;
- limpiar estado después de eliminar.
```

La corrección anterior debe permanecer:

```javascript
await deleteTask(taskId);
setTask(null);
setHistory([]);
setError(null);
setHistoryError(null);
```

---

## 5.4 `frontend/src/hooks/useUsers.js`

**Acción:** revisar y modificar únicamente si es necesario.

Debe:

* consultar usuarios asignables;
* cargar solamente cuando el formulario lo necesita;
* evitar consultas repetidas;
* tratar `403` de forma controlada;
* no mostrar opciones administrativas a usuarios sin permiso.

---

## 5.5 `frontend/src/components/TaskDrawer.jsx`

**Acción:** crear.

Responsabilidad:

* envolver creación o edición;
* mostrar título según modo;
* cerrar con botón y tecla Escape;
* bloquear cierre accidental mientras se envía;
* mantener foco accesible;
* renderizar `TaskForm`;
* no contener llamadas directas al API.

Modos:

```text
create
edit
```

Props sugeridas:

```text
open
mode
task
onClose
onSuccess
```

---

## 5.6 `frontend/src/components/TaskHistory.jsx`

**Acción:** crear.

Responsabilidad:

* mostrar historial cronológico;
* representar usuario, acción, campo y fecha;
* manejar estado vacío;
* no transformar permisos;
* no consultar directamente al API.

---

## 5.7 `frontend/src/components/ConfirmDialog.jsx`

**Acción:** crear.

Usarlo para eliminación.

Debe evitar:

```javascript
window.confirm(...)
```

Comportamiento:

```text
- mensaje explícito;
- botón cancelar;
- botón confirmar;
- estado submitting;
- impedir doble clic;
- foco accesible.
```

---

## 5.8 `frontend/src/components/TaskForm.jsx`

**Acción:** modificar.

Asegurar:

* mismo formulario para crear y editar;
* validación de título;
* normalización de espacios;
* fechas válidas;
* valores de estado y prioridad cerrados;
* bloqueo del botón mientras envía;
* prevención de doble submit;
* errores del backend visibles;
* no enviar campos que el rol no puede modificar;
* no confiar en validación frontend como mecanismo de seguridad.

No debe llamar directamente a `fetch`, `axios` ni `httpClient`.

---

## 5.9 `frontend/src/components/TaskFilters.jsx`

**Acción:** modificar.

Asegurar:

* búsqueda con `useDebounce`;
* filtros controlados;
* botón para limpiar;
* reinicio a página 1 al cambiar filtros;
* valores compatibles con los enums del backend;
* sin consultas por cada pulsación inmediata.

---

## 5.10 `frontend/src/components/TaskTable.jsx`

**Acción:** modificar.

Agregar o consolidar:

```text
- navegación al detalle;
- editar;
- eliminar;
- badges;
- fecha límite;
- usuario asignado;
- estado vacío;
- acciones según rol.
```

Los botones se ocultan según rol para UX, pero el backend sigue siendo la autoridad.

---

## 5.11 `frontend/src/pages/TasksPage.jsx`

**Acción:** modificar.

La página debe quedar delgada.

Responsabilidades:

```text
- componer filtros;
- componer tabla;
- abrir drawer;
- abrir confirmación;
- coordinar refresh;
- mostrar indicadores.
```

No debe contener:

* llamadas directas a API;
* validaciones de negocio;
* transformación compleja de respuestas;
* lógica JWT.

---

## 5.12 `frontend/src/pages/TaskDetailPage.jsx`

**Acción:** modificar.

Integrar:

```text
- datos principales;
- historial;
- editar mediante drawer;
- eliminar mediante confirmación;
- estados loading/error;
- navegación después de eliminar.
```

---

## 5.13 `frontend/src/pages/CreateTaskPage.jsx`

**Acción:** eliminar si el flujo queda completamente cubierto por `TaskDrawer`.

```powershell
git rm frontend/src/pages/CreateTaskPage.jsx
```

---

## 5.14 `frontend/src/pages/EditTaskPage.jsx`

**Acción:** eliminar si el flujo queda completamente cubierto por `TaskDrawer`.

```powershell
git rm frontend/src/pages/EditTaskPage.jsx
```

No elimines estas páginas hasta que el drawer esté funcional y las rutas hayan sido actualizadas.

---

## 5.15 `frontend/src/components/TaskDetailPage.jsx`

**Acción:** eliminar la duplicación existente.

La versión válida debe permanecer en:

```text
frontend/src/pages/TaskDetailPage.jsx
```

Eliminar:

```powershell
git rm frontend/src/components/TaskDetailPage.jsx
```

Antes confirma:

```powershell
Get-ChildItem frontend/src -Recurse -Filter TaskDetailPage.jsx
```

---

## 5.16 `frontend/src/routes/AppRouter.jsx`

**Acción:** modificar.

Eliminar rutas obsoletas:

```text
/tasks/new
/tasks/:taskId/edit
```

si el flujo se mueve definitivamente a drawers.

Mantener:

```text
/login
/app
/app/tasks
/app/tasks/:taskId
```

También debe quedar resuelta la duplicación de `Outlet`.

Si `AppLayout.jsx` ya contiene:

```jsx
<Outlet />
```

`AppRouter.jsx` no debe pasar otro `Outlet` como hijo.

Estructura esperada:

```jsx
<Route element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
        ...
    </Route>
</Route>
```

---

## 5.17 `frontend/src/layouts/AppLayout.jsx`

**Acción:** revisar.

Debe existir un solo:

```jsx
<Outlet />
```

Debe conservar:

```text
Sidebar
TopBar
main
Footer
```

No agregar estado de tareas en el layout.

---

## 5.18 Estilos existentes del frontend

**Acción:** modificar los archivos CSS que ya usa el proyecto.

Agregar únicamente estilos para:

```text
drawer
overlay
summary cards
history timeline
confirm dialog
responsive table
focus states
disabled buttons
```

No crear un framework CSS ni migrar estilos durante este día.

---

# 6. Indicadores reales

La página de tareas puede mostrar:

```text
Total
Pendientes
En progreso
Completadas
Alta prioridad
```

La fuente debe ser:

```http
GET /api/v1/tasks/summary
```

No calcularlos con la página actual del listado porque produciría estadísticas falsas cuando exista paginación.

---

# 7. Seguridad mínima obligatoria

## Backend

Verificar:

```text
- JWT obligatorio;
- permisos evaluados en servidor;
- consultas SQLAlchemy parametrizadas;
- enums cerrados;
- page_size limitado;
- identificadores tipados;
- errores internos no expuestos;
- transacciones con rollback;
- member sin acceso global;
- eliminación y edición autorizadas.
```

## Frontend

Verificar:

```text
- no insertar HTML recibido del servidor;
- no usar dangerouslySetInnerHTML;
- no guardar información sensible adicional;
- no construir URLs desde entrada libre;
- bloquear doble submit;
- limpiar errores previos;
- manejar 401 globalmente;
- no considerar ocultar botones como autorización.
```

## Idempotencia

No agregaría una infraestructura completa de `Idempotency-Key` en este Día 08.

Para este alcance, implementa:

```text
- botón deshabilitado durante submit;
- una sola promesa activa por formulario;
- transacción única en backend;
- validación de estado antes de actualizar;
- no repetir DELETE;
```

Es suficiente para evitar duplicaciones de interfaz sin introducir una capa innecesaria.

---

# 8. Orden exacto de implementación

## Fase 0 — Base sincronizada

```text
main → development → feature/day-08
```

## Fase 1 — Backend summary

```text
schemas
repository
query service
service facade
route
tests
```

## Fase 2 — API y hooks frontend

```text
taskApi
useTasks
useTask
useUsers
```

## Fase 3 — Componentes reutilizables

```text
TaskDrawer
TaskHistory
ConfirmDialog
TaskForm
TaskFilters
TaskTable
```

## Fase 4 — Composición de páginas

```text
TasksPage
TaskDetailPage
```

## Fase 5 — Limpieza de rutas y duplicados

```text
AppRouter
AppLayout
CreateTaskPage
EditTaskPage
components/TaskDetailPage
```

## Fase 6 — Estilos y accesibilidad

```text
drawer
focus
responsive
loading
error
empty
```

## Fase 7 — Validación completa

```text
backend tests
frontend build
manual smoke test
git diff
```

---

# 9. Pruebas del Día 08

## Backend

Desde la raíz del proyecto, según tu entorno:

```powershell
pytest backend/tests/test_tasks.py -v
```

Luego:

```powershell
pytest -v
```

## Frontend

```powershell
cd frontend
npm run build
cd ..
```

Si existe lint:

```powershell
cd frontend
npm run lint
cd ..
```

No agregues un comando de lint si el proyecto no lo tiene configurado.

## Verificación de conflictos residuales

```powershell
Get-ChildItem -Recurse -File | Select-String -Pattern "<<<<<<<|>>>>>>>"
```

Para evitar ruido con dependencias:

```powershell
Get-ChildItem backend,frontend/src -Recurse -File | Select-String -Pattern "<<<<<<<|>>>>>>>"
```

## Estado Git

```powershell
git status
git diff --check
git diff
```

---

# 10. Commit del Día 08

Cuando todo funcione:

```powershell
git add .
git status
```

Revisa que no aparezcan:

```text
.env
node_modules
__pycache__
.pytest_cache
dist
tmp
```

Crear commit:

```powershell
git commit -m "feat(ui): complete task management experience"
```

Publicar:

```powershell
git push origin feature/day-08-feature-complete-ui
```

No hagas merge local a `development`.

---

# 11. Pull Request: Día 08 hacia development

En GitHub:

```text
base:
development

compare:
feature/day-08-feature-complete-ui
```

## Título

```text
feat(ui): complete task management experience
```

## Descripción en Markdown

```markdown
# Day 08 — Feature Complete Task Management UI

## Summary

Completes the task management user experience while preserving the existing FastAPI and React architecture.

## Backend

- Added secure task summary endpoint.
- Added database-level task aggregations.
- Preserved role-based task visibility.
- Added response schemas and query service integration.
- Expanded task endpoint tests.

## Frontend

- Added task creation and editing drawer.
- Added task history presentation.
- Added reusable confirmation dialog.
- Improved filters, pagination and task actions.
- Added backend-driven task indicators.
- Improved loading, empty and error states.
- Removed duplicated task detail component.
- Simplified routing and layout outlet composition.

## Security

- Backend remains the authorization authority.
- SQLAlchemy parameterized queries are preserved.
- Duplicate form submissions are blocked.
- Restricted actions are hidden by role and validated server-side.
- No raw HTML rendering was introduced.

## Database

No database migration required.

## Validation

- Backend test suite passes.
- Frontend production build passes.
- No unresolved merge markers.
- Working tree clean.

## Version target

`v0.8.0-feature-complete-ui`
```

Haz el merge desde GitHub.

---

# 12. Después del merge hacia development

En local:

```powershell
git checkout development
git pull origin development
```

No ejecutes:

```powershell
git merge feature/day-08-feature-complete-ui
```

El merge ya lo habrá realizado GitHub.

---

# 13. Pull Request: development hacia main

En GitHub:

```text
base:
main

compare:
development
```

## Título

```text
release: v0.8.0 feature complete task management UI
```

## Descripción

```markdown
# Release v0.8.0

## Scope

Feature-complete task management user experience.

## Included

- Backend task summary.
- Secure role-aware aggregations.
- Task creation and editing drawer.
- Task detail and history.
- Filters and pagination.
- Protected task actions.
- Responsive and accessible states.
- Route and component cleanup.
- Backend tests and frontend production build.

## Database

No migration required.

## Release tag

`v0.8.0-feature-complete-ui`
```

Fusiona el PR en GitHub.

---

# 14. Tag después del merge a main

Después de que GitHub complete el merge:

```powershell
git checkout main
git pull origin main
git status
```

Crear el tag sobre el commit real de `main`:

```powershell
git tag -a v0.8.0-feature-complete-ui -m "Feature Complete Task Management UI"
git push origin v0.8.0-feature-complete-ui
```

Luego sincronizar `development` con `main`:

```powershell
git checkout development
git pull origin development
git merge --ff-only main
git push origin development
```

Así el siguiente día nacerá exactamente desde la versión liberada.

---

# Resultado esperado del Día 08

```text
main
└── v0.8.0-feature-complete-ui

development
└── sincronizado con main

feature/day-08-feature-complete-ui
└── fusionada mediante PR
```

El siguiente día debería comenzar solamente después de validar:

```powershell
git checkout development
git pull origin development
git status
```

A partir de ese punto, el candidato natural sería el  **Día 09 — AI Task Enrichment and Production Readiness** , pero únicamente después de cerrar completamente el Día 08 y comprobar que la interfaz funcional, los permisos y las pruebas están estables.
