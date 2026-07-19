# Decisión de continuidad

El estado actual ya corresponde al cierre técnico del  **Día 06 — Frontend Foundation** :

* Backend estable.
* `18 passed`.
* API de tareas integrada.
* Autenticación JWT operativa.
* Layout principal creado.
* Tabla, filtros y paginación conectados.
* Rama `feature/day-06-frontend-foundation` adelantada respecto a remoto.
* Quedan cambios pendientes de versionar.

Por lo tanto,  **no corresponde abrir un parche `[0.6.x]`** . Un parche solo tendría sentido si, después de cerrar y etiquetar el Día 06, apareciera un defecto puntual sin cambio funcional.

La secuencia correcta es:

1. Cerrar Día 06.
2. Integrarlo en `development`.
3. Crear tag `v0.6.0-frontend-foundation`.
4. Abrir  **Día 07** .
5. Completar el flujo funcional real de tareas.

---

# Día 07 — Task Workflow Completion

## Nombre técnico

```text
Día 07 — Task Workflow Completion
```

## Rama

```text
feature/day-07-task-workflow-completion
```

## Objetivo

Convertir la base visual del Día 06 en un flujo operativo completo:

```text
Listado → creación → detalle → edición → cancelación → actualización del listado
```

Al finalizar el día, ningún botón visible relacionado con tareas debe quedar vacío, simulado o sin comportamiento.

---

# Alcance exacto del Día 07

El Día 07 debe implementar únicamente:

* rutas frontend separadas;
* creación de tareas;
* consulta de detalle;
* edición de tareas;
* cancelación lógica;
* selección segura de usuarios asignables;
* navegación real desde la tabla;
* controles de acceso visuales;
* normalización del cliente HTTP;
* pruebas backend relacionadas con permisos y consultas;
* validación integral backend/frontend.

No se implementarán todavía:

* operaciones masivas;
* WebSockets;
* notificaciones;
* refresh tokens;
* microservicios;
* multi-tenancy;
* auditoría empresarial genérica;
* IA;
* dashboards estadísticos;
* drag-and-drop;
* optimistic updates;
* sistema de idempotency keys;
* Redux;
* Module Federation.

Eso evitará sobreingeniería y mantendrá el alcance compatible con la prueba técnica.

---

# Aclaración sobre multi-tenancy

La base actual  **no contiene** :

* `tenant_id`;
* modelo `Tenant`;
* middleware de tenant;
* JWT con tenant;
* repositorios filtrados por tenant.

Por tanto, no es correcto afirmar que actualmente existe aislamiento entre tenants.

En este proyecto, la frontera de seguridad real es:

```text
Administrador → acceso global
Miembro → tareas creadas por él o asignadas a él
```

Agregar multi-tenancy en este momento implicaría modificar:

* esquema de base de datos;
* JWT;
* usuarios;
* tareas;
* historial;
* repositorios;
* pruebas;
* datos iniciales;
* frontend.

Eso sería una desviación grave del alcance de la prueba. En el Día 07 se reforzará el aislamiento por usuario y rol, no un aislamiento tenant inexistente.

---

# Resultado esperado al finalizar el Día 07

## Administrador

Puede:

* listar todas las tareas;
* crear tareas;
* asignarlas a usuarios activos;
* consultar cualquier tarea;
* editar cualquier tarea;
* cambiar estado y prioridad;
* reasignar tareas;
* cancelar tareas.

## Miembro

Puede:

* listar únicamente tareas creadas por él o asignadas a él;
* crear tareas sin asignación o asignadas a sí mismo;
* consultar únicamente tareas relacionadas con él;
* modificar tareas relacionadas con él;
* cambiar estado y contenido permitido;
* no reasignar tareas;
* cancelar únicamente tareas relacionadas con él.

## Frontend

Debe disponer de estas rutas:

```text
/
/app
/app/tasks
/app/tasks/new
/app/tasks/:taskId
/app/tasks/:taskId/edit
/app/users
```

La ruta `/app/users` se mantendrá restringida a administradores.

---

# Fase 0 — Cerrar correctamente el Día 06

Antes de crear el Día 07, hay que cerrar el trabajo actual.

## 0.1. Terminal

Ejecutar en:

```powershell
D:\ProyectosFlutter\marquillas_task_manager
```

## 0.2. Verificar rama

```powershell
git branch --show-current
```

Debe devolver:

```text
feature/day-06-frontend-foundation
```

## 0.3. Verificar cambios

```powershell
git status
git diff --check
```

`git diff --check` no debe mostrar:

* trailing whitespace;
* conflictos;
* errores de espaciado.

## 0.4. No ejecutar `git pull`

No debe ejecutarse:

```powershell
git pull
```

sobre la rama actual con cambios sin confirmar.

Ejecutar solamente:

```powershell
git fetch origin --prune
```

## 0.5. Validación Docker

```powershell
docker compose down
docker compose build --no-cache backend frontend
docker compose up -d
docker compose ps
```

## 0.6. Logs

```powershell
docker compose logs backend --tail=100
docker compose logs frontend --tail=100
```

## 0.7. Base de datos

```powershell
docker compose exec backend alembic current
docker compose exec backend alembic heads
docker compose exec backend alembic history
docker compose exec backend alembic upgrade head
```

Para el Día 06 no debe crearse una migración nueva.

## 0.8. Validación Python

```powershell
docker compose exec backend python -m compileall app
docker compose exec backend python -m pytest -q
```

Resultado esperado:

```text
18 passed
```

## 0.9. Validación frontend

```powershell
docker compose exec frontend npm run build
```

Si existe lint configurado:

```powershell
docker compose exec frontend npm run lint
```

## 0.10. Commit Día 06

```powershell
git add .
git commit -m "feat(tasks): complete full-stack task workspace foundation"
```

## 0.11. Push

```powershell
git push -u origin feature/day-06-frontend-foundation
```

## 0.12. Pull Request

Base:

```text
development
```

Compare:

```text
feature/day-06-frontend-foundation
```

Título:

```text
feat(tasks): complete full-stack task workspace foundation
```

## 0.13. Merge

Realizar merge hacia:

```text
development
```

Preferencia:

```text
Squash and merge
```

si ese es el estándar establecido del repositorio.

## 0.14. Sincronizar `development`

```powershell
git checkout development
git fetch origin --prune
git pull --ff-only origin development
```

## 0.15. Validación posterior al merge

```powershell
docker compose up -d
docker compose exec backend python -m pytest -q
docker compose exec frontend npm run build
```

## 0.16. Tag Día 06

```powershell
git tag -a v0.6.0-frontend-foundation -m "Release v0.6.0: full-stack frontend and task workspace foundation"
git push origin v0.6.0-frontend-foundation
```

---

# Fase 1 — Crear rama Día 07

Desde `development` actualizado:

```powershell
git checkout development
git pull --ff-only origin development
git checkout -b feature/day-07-task-workflow-completion
git push -u origin feature/day-07-task-workflow-completion
```

Verificar:

```powershell
git branch --show-current
git status
```

---

# Plan de intervención por archivo

## Backend

No se requiere migración de base de datos para este día.

La estructura existente de `tasks`, `task_history` y `users` es suficiente.

---

## 1. Usuarios asignables

### Crear

```text
backend/app/modules/users/repositories/user_query_repository.py
```

### Acción

Crear un repositorio de consultas para usuarios activos.

Responsabilidad:

```python
list_active_users()
```

Comportamiento:

* usar `select(User)`;
* filtrar `User.is_active.is_(True)`;
* ordenar por nombre e ID;
* no devolver `password_hash`;
* no usar SQL textual;
* no interpolar parámetros manualmente.

---

### Crear

```text
backend/app/modules/users/services/user_query_service.py
```

### Acción

Crear el servicio de consulta de usuarios asignables.

Reglas:

* administrador: puede consultar usuarios activos;
* miembro: recibe únicamente su propio usuario;
* validar que el usuario actual esté activo;
* devolver esquemas de respuesta, no entidades con datos sensibles.

---

### Modificar

```text
backend/app/modules/users/api/user_routes.py
```

### Acción

Agregar:

```http
GET /api/users
```

Respuesta:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Administrator",
      "email": "admin@test.com",
      "role": "admin",
      "is_active": true
    }
  ]
}
```

Seguridad:

* requiere JWT;
* administrador obtiene usuarios activos;
* miembro obtiene únicamente su propio registro;
* nunca devuelve `password_hash`;
* límite interno razonable;
* sin búsqueda SQL manual.

No eliminar:

```http
POST /api/users
```

---

### Modificar

```text
backend/app/modules/users/schemas/user_schemas.py
```

### Acción

Agregar:

```python
UserListResponse
```

Con:

```python
items: list[UserResponse]
```

También normalizar `UserCreate`:

* `name.strip()`;
* `email.strip().lower()`;
* mantener longitud máxima;
* impedir nombres vacíos después de normalizar.

---

## 2. Historial de tareas

### Modificar

```text
backend/app/modules/tasks/repositories/task_repository.py
```

### Acción

Agregar método:

```python
list_history(task_id: int) -> list[TaskHistory]
```

Condiciones:

* filtrar por `TaskHistory.task_id`;
* ordenar por `created_at DESC`, `id DESC`;
* usar SQLAlchemy parametrizado.

---

### Modificar

```text
backend/app/modules/tasks/schemas/task_schemas.py
```

### Acción

Agregar:

```python
TaskHistoryResponse
TaskHistoryListResponse
```

Campos mínimos:

```text
id
task_id
action
performed_by
created_at
```

No ampliar todavía a valores anteriores y nuevos porque el modelo actual no posee esos campos.

---

### Modificar

```text
backend/app/modules/tasks/services/task_query_service.py
```

### Acción

Agregar método:

```python
history(task_id: int) -> TaskHistoryListResponse
```

Este método solo consulta el historial. La autorización continuará siendo aplicada por `TaskService`.

---

### Modificar

```text
backend/app/modules/tasks/services/task_service.py
```

### Acción

Agregar:

```python
history(
    task_id: int,
    current_user_id: int,
    is_admin: bool,
)
```

Flujo obligatorio:

1. obtener tarea;
2. ejecutar `validate_task_access`;
3. únicamente después consultar historial;
4. devolver respuesta.

Esto evita que un usuario determine si existe historial de una tarea ajena.

---

### Modificar

```text
backend/app/modules/tasks/api/task_routes.py
```

### Acción

Agregar el endpoint antes de una posible ruta dinámica incompatible:

```http
GET /api/tasks/{task_id}/history
```

Seguridad:

* requiere JWT;
* aplica las mismas reglas de acceso que `GET /api/tasks/{task_id}`;
* no expone historial de tareas ajenas;
* `task_id` debe definirse con `Path(ge=1)`.

---

## 3. Fortalecimiento de parámetros de tareas

### Modificar

```text
backend/app/modules/tasks/api/task_routes.py
```

### Acción

Fortalecer parámetros:

```python
task_id: int = Path(ge=1)
```

Para:

* consultar;
* editar;
* cancelar;
* consultar historial.

Fortalecer búsqueda:

```python
search: str | None = Query(default=None, max_length=200)
```

Los filtros de estado y prioridad ya quedan validados indirectamente en los esquemas, pero en la ruta se recomienda tiparlos con:

```python
TaskStatus | None
TaskPriority | None
```

Importarlos desde `task_schemas.py`.

Esto hace que FastAPI rechace valores inválidos antes de llegar al repositorio.

---

### Modificar

```text
backend/app/modules/tasks/schemas/task_schemas.py
```

### Acción

Agregar límites:

```python
description: str | None = Field(default=None, max_length=5000)
```

En creación y actualización.

Para `TaskUpdate`, debe distinguirse correctamente entre:

* campo no enviado;
* campo enviado como `null`.

La lógica actual con:

```python
model_dump(exclude_unset=True)
```

ya permite esa distinción.

---

## 4. Protección de transiciones

### Modificar

```text
backend/app/modules/tasks/services/task_validation_service.py
```

### Acción

Agregar validación mínima de transición:

```python
validate_status_transition(current_status, requested_status)
```

Reglas limpias:

```text
pending → in_progress | completed | cancelled
in_progress → pending | completed | cancelled
completed → in_progress
cancelled → ninguna transición
```

Una tarea cancelada no debe poder reactivarse mediante `PATCH`.

Esto protege el comportamiento incluso si un cliente malicioso evita el frontend.

---

### Modificar

```text
backend/app/modules/tasks/services/task_command_service.py
```

### Acción

Antes de aplicar cambios:

```python
if "status" in changes:
    self.validation.validate_status_transition(
        current_status=task.status,
        requested_status=payload.status,
    )
```

Además:

* si `changes` está vacío, devolver la tarea sin registrar un historial falso;
* si los valores enviados son iguales a los existentes, no registrar una actualización vacía;
* mantener una sola transacción por comando;
* mantener rollback en excepciones.

Esto proporciona idempotencia práctica para:

```text
PATCH sin cambios
DELETE de tarea ya cancelada
```

No se agregará infraestructura de claves idempotentes en este día.

---

# Frontend

## Principio de modularidad

El frontend seguirá una separación modular por dominio:

```text
api
auth
components
hooks
layouts
pages
routes
styles
```

No se implementará Module Federation. Para esta aplicación, eso sería innecesario.

La continuidad tipo microfrontend se conserva mediante:

* dominio `tasks` desacoplado;
* cliente API separado;
* hooks separados;
* páginas separadas;
* componentes reutilizables;
* rutas explícitas;
* ausencia de lógica de negocio dentro del layout.

---

## 5. Normalización del cliente HTTP

### Modificar

```text
frontend/src/api/httpClient.js
```

### Acción

Agregar manejo centralizado para `401`.

Comportamiento:

1. si la respuesta es `401`;
2. eliminar token;
3. emitir un evento de sesión vencida o redirigir de manera controlada;
4. evitar bucles infinitos;
5. conservar el detalle de error backend.

No debe realizarse:

```javascript
window.location.reload()
```

en todas las respuestas.

Preferencia:

```javascript
window.dispatchEvent(new CustomEvent("auth:unauthorized"));
```

---

### Modificar

```text
frontend/src/auth/AuthContext.jsx
```

### Acción

Escuchar:

```text
auth:unauthorized
```

y ejecutar:

```javascript
clearSession()
```

Agregar estado:

```javascript
initializing
```

La sesión no debe considerarse completamente resuelta mientras `/api/auth/me` está cargando.

Valor del contexto:

```javascript
{
    token,
    user,
    login,
    logout,
    initializing,
    isAuthenticated
}
```

---

### Modificar

```text
frontend/src/auth/ProtectedRoute.jsx
```

### Acción

Mientras `initializing` sea verdadero:

```jsx
<LoadingState message="Validating session..." />
```

Después:

* autenticado: renderizar contenido;
* no autenticado: redirigir a `/`.

Esto evita que un token inválido muestre brevemente contenido protegido.

---

## 6. API de usuarios

### Modificar

```text
frontend/src/api/userApi.js
```

### Acción

Agregar:

```javascript
export const listUsers = () =>
    httpClient.get(USER_ENDPOINT);
```

Mantener:

```javascript
createUser
```

---

### Crear

```text
frontend/src/hooks/useUsers.js
```

### Acción

Implementar:

* `users`;
* `loading`;
* `error`;
* `refresh`.

El hook no debe contener reglas de autorización. El backend seguirá siendo la autoridad.

---

## 7. Formulario de tareas

### Modificar

```text
frontend/src/components/TaskForm.jsx
```

Actualmente está vacío.

### Acción

Crear un formulario reutilizable para creación y edición.

Props:

```javascript
{
    initialValues,
    users,
    submitting,
    error,
    submitLabel,
    allowAssignment,
    allowStatusChange,
    onSubmit,
    onCancel
}
```

Campos:

```text
title
description
status
priority
assigned_user_id
due_date
```

Reglas frontend:

* título obligatorio;
* máximo 200 caracteres;
* descripción máximo 5000;
* fecha futura;
* convertir `datetime-local` a ISO;
* convertir asignación vacía a `null`;
* no enviar propiedades no disponibles;
* deshabilitar envío mientras procesa;
* no usar HTML sin sanitizar;
* no usar `dangerouslySetInnerHTML`.

El frontend ayuda al usuario, pero el backend continúa validando todos los campos.

---

## 8. Página de creación

### Crear

```text
frontend/src/pages/CreateTaskPage.jsx
```

### Acción

Flujo:

1. cargar usuarios asignables;
2. mostrar `TaskForm`;
3. ejecutar `createTask`;
4. después de éxito navegar a:

```text
/app/tasks/{taskId}
```

5. mostrar error backend sin perder los datos escritos;
6. impedir doble submit mediante `submitting`.

---

## 9. Página de detalle

### Crear

```text
frontend/src/pages/TaskDetailPage.jsx
```

### Acción

Flujo:

1. obtener `taskId` con `useParams`;
2. verificar que sea entero positivo;
3. ejecutar `getTask`;
4. consultar historial;
5. mostrar:
   * título;
   * descripción;
   * estado;
   * prioridad;
   * usuario asignado;
   * fecha límite;
   * creador;
   * fechas de creación y actualización;
   * historial;
6. permitir editar;
7. permitir cancelar con confirmación;
8. regresar al listado.

No renderizar descripción como HTML.

---

## 10. Página de edición

### Crear

```text
frontend/src/pages/EditTaskPage.jsx
```

### Acción

Flujo:

1. cargar tarea;
2. cargar usuarios;
3. transformar la fecha ISO para `datetime-local`;
4. renderizar `TaskForm`;
5. enviar exclusivamente campos modificados;
6. ejecutar `updateTask`;
7. navegar al detalle;
8. mantener errores visibles.

Para miembros:

* ocultar o deshabilitar reasignación;
* el backend seguirá bloqueando cualquier intento manipulado.

---

## 11. Hook de detalle

### Crear

```text
frontend/src/hooks/useTask.js
```

### Acción

Separar la consulta de una tarea individual.

Debe exponer:

```javascript
task
loading
error
refresh
update
remove
history
historyLoading
historyError
```

No reutilizar `useTasks` para detalle porque mezclaría:

* listado;
* filtros;
* paginación;
* entidad individual.

---

## 12. API de historial

### Modificar

```text
frontend/src/api/taskApi.js
```

### Acción

Agregar:

```javascript
export const getTaskHistory = (taskId) =>
    httpClient.get(`${TASKS_ENDPOINT}/${taskId}/history`);
```

---

## 13. Tabla funcional

### Modificar

```text
frontend/src/components/TaskTable.jsx
```

### Acción

Agregar props:

```javascript
onView
onEdit
```

Conectar botones:

```jsx
onClick={() => onView(task.id)}
onClick={() => onEdit(task.id)}
```

Formatear fecha con una función segura.

No mostrar el valor ISO crudo.

Corregir selección total:

Actualmente:

```javascript
selectedRows.length === tasks.length
```

puede ser incorrecto si `selectedRows` contiene IDs de otra página.

Debe calcularse con:

```javascript
tasks.every((task) => selectedRows.includes(task.id))
```

Cuando cambie de página, la selección debe limpiarse.

---

## 14. Filtros y acciones inexistentes

### Modificar

```text
frontend/src/components/TaskFilters.jsx
```

### Acción

Eliminar durante el Día 07:

```text
Assign
Complete
Delete
```

de acciones masivas.

Motivo:

* sus callbacks están vacíos;
* no existen endpoints bulk;
* mostrar controles falsos degrada la experiencia;
* implementarlos mediante múltiples peticiones no ofrece atomicidad;
* no se debe simular una capacidad que no está integrada.

Mantener:

* botón `New Task`;
* búsqueda;
* estado;
* prioridad;
* contador de selección solo si realmente se utiliza.

La selección masiva puede quedar aplazada para un día específico posterior.

---

## 15. Página de tareas

### Modificar

```text
frontend/src/pages/TasksPage.jsx
```

### Acción

Implementar:

```javascript
const navigate = useNavigate();
```

Conectar:

```javascript
handleCreate()
handleView(taskId)
handleEdit(taskId)
```

Rutas:

```text
/app/tasks/new
/app/tasks/:taskId
/app/tasks/:taskId/edit
```

Al cambiar cualquier filtro distinto de página:

```text
page = 1
selectedRows = []
```

Agregar debounce de búsqueda sencillo, aproximadamente 300 ms, mediante hook separado o estado local.

No instalar una dependencia externa solo para debounce.

---

## 16. Rutas frontend

### Modificar

```text
frontend/src/routes/AppRouter.jsx
```

### Acción

Corregir la arquitectura actual.

Actualmente `/app` renderiza directamente `TasksPage`, mientras el menú presenta dashboard y rutas que no existen.

Debe quedar con layout anidado:

```jsx
<Route
    path="/app"
    element={
        <ProtectedRoute>
            <AppLayout ... />
        </ProtectedRoute>
    }
>
    <Route index element={<DashboardPage />} />
    <Route path="tasks" element={<TasksPage />} />
    <Route path="tasks/new" element={<CreateTaskPage />} />
    <Route path="tasks/:taskId" element={<TaskDetailPage />} />
    <Route path="tasks/:taskId/edit" element={<EditTaskPage />} />
    <Route path="users" element={<UsersPage />} />
</Route>
```

Para soportarlo, `AppLayout` debe utilizar:

```jsx
<Outlet />
```

en lugar de recibir cada página como `children`.

---

### Modificar

```text
frontend/src/layouts/AppLayout.jsx
```

### Acción

Importar:

```javascript
Outlet
```

y reemplazar el contenido variable por:

```jsx
<Outlet />
```

Esto evita recrear el layout para cada ruta y conserva:

* sidebar;
* topbar;
* footer;
* contexto;
* navegación.

---

## 17. Dashboard

### Modificar

```text
frontend/src/pages/DashboardPage.jsx
```

### Acción

Mantener un dashboard mínimo.

No desarrollar todavía indicadores complejos.

Contenido:

* bienvenida;
* enlace a tareas;
* usuario actual;
* rol;
* acceso rápido a crear tarea.

No realizar cálculos falsos en frontend.

Si se muestran métricas, deben provenir de la respuesta real de `GET /api/tasks`, usando `total`; no contar solamente los elementos de la página.

---

## 18. Página de usuarios

### Crear

```text
frontend/src/pages/UsersPage.jsx
```

### Acción

Versión mínima:

* cargar usuarios mediante `GET /api/users`;
* administrador: visualizar usuarios activos;
* miembro: no debería ver la navegación hacia usuarios;
* mostrar estado de carga, error y vacío.

No implementar edición ni desactivación todavía.

---

### Modificar

```text
frontend/src/components/Sidebar.jsx
```

### Acción

Mostrar enlace `Users` únicamente si:

```javascript
user?.role === "admin"
```

Esto es una restricción visual, no de seguridad. El backend seguirá controlando permisos.

---

## 19. Títulos dinámicos

### Modificar

```text
frontend/src/components/TopBar.jsx
```

### Acción

La constante exacta por pathname no funciona con IDs dinámicos.

Implementar resolución por patrones:

```text
/app                         → Dashboard
/app/tasks                   → Tasks
/app/tasks/new               → New Task
/app/tasks/:id               → Task Detail
/app/tasks/:id/edit          → Edit Task
/app/users                   → Users
```

No usar datos no confiables del pathname para insertar HTML.

---

## 20. Estilos

### Modificar

```text
frontend/src/styles/forms.css
frontend/src/styles/tasks.css
frontend/src/styles/buttons.css
frontend/src/styles/cards.css
```

### Acción

Agregar únicamente estilos necesarios para:

* formulario de tarea;
* vista de detalle;
* timeline de historial;
* mensajes de validación;
* botones primario, secundario y peligro;
* layout móvil;
* estados disabled;
* confirmación de cancelación.

---

### Eliminar o dejar sin uso

```text
frontend/src/App.css
```

Actualmente contiene estilos del template de Vite y no está importado.

Acción recomendada:

```text
ELIMINAR
```

si `git grep` confirma que no está importado.

Comando:

```powershell
git grep "App.css"
```

Si no hay referencias:

```powershell
Remove-Item frontend\src\App.css
```

---

# Pruebas backend del Día 07

## Crear

```text
backend/tests/modules/tasks/test_task_history.py
```

### Casos

1. administrador consulta historial;
2. miembro relacionado consulta historial;
3. miembro ajeno recibe `403`;
4. tarea inexistente devuelve `404`.

---

## Crear o modificar

```text
backend/tests/modules/tasks/test_task_status_transitions.py
```

### Casos

1. `pending → in_progress`;
2. `in_progress → completed`;
3. `cancelled → in_progress` rechazado;
4. `PATCH` sin cambios no crea historial adicional;
5. cancelar dos veces conserva respuesta idempotente.

---

## Crear

```text
backend/tests/modules/users/test_user_list.py
```

### Casos

1. administrador obtiene usuarios activos;
2. miembro obtiene únicamente su propio usuario;
3. respuesta nunca contiene `password_hash`;
4. solicitud sin JWT recibe `401`.

---

# Pruebas frontend

Si no existe infraestructura de pruebas frontend, no instalar Vitest durante este día únicamente para cumplir una formalidad.

Sí debe ejecutarse:

```powershell
npm run build
npm run lint
```

y una validación manual controlada.

La cobertura automatizada crítica continúa concentrada en backend, donde están:

* seguridad;
* reglas de acceso;
* transacciones;
* validaciones;
* estados.

---

# Matriz de endpoints al finalizar el Día 07

| Método | Endpoint                         | Autenticación | Regla                             |
| ------- | -------------------------------- | -------------: | --------------------------------- |
| POST    | `/api/auth/login`              |             No | Credenciales válidas             |
| GET     | `/api/auth/me`                 |            Sí | Usuario autenticado               |
| POST    | `/api/users`                   |            Sí | Solo admin                        |
| GET     | `/api/users`                   |            Sí | Admin: activos; member: sí mismo |
| POST    | `/api/tasks`                   |            Sí | Según reglas de asignación      |
| GET     | `/api/tasks`                   |            Sí | Admin global; member relacionado  |
| GET     | `/api/tasks/{task_id}`         |            Sí | Acceso a tarea                    |
| PATCH   | `/api/tasks/{task_id}`         |            Sí | Acceso y transición válida      |
| DELETE  | `/api/tasks/{task_id}`         |            Sí | Cancelación lógica              |
| GET     | `/api/tasks/{task_id}/history` |            Sí | Mismo acceso que la tarea         |
| GET     | `/health`                      |             No | Estado aplicación                |
| GET     | `/health/database`             |             No | Conectividad DB                   |

---

# Seguridad del Día 07

## SQL injection

La protección se mantiene porque:

* las consultas usan SQLAlchemy;
* los parámetros se envían como expresiones;
* no se usa concatenación de SQL;
* `task_id` es entero validado;
* estado y prioridad son literales controlados;
* `page_size` tiene máximo 100.

El patrón:

```python
f"%{search}%"
```

no crea SQL injection al utilizarse como parámetro SQLAlchemy. Sin embargo, la búsqueda debe limitarse a 200 caracteres para evitar abuso innecesario.

---

## Autorización

La autorización debe permanecer en backend.

Nunca confiar en:

```javascript
user.role
```

como control definitivo.

El frontend puede ocultar botones, pero cualquier usuario puede modificar JavaScript o ejecutar la API directamente.

---

## XSS

* React escapa texto por defecto.
* No usar `dangerouslySetInnerHTML`.
* No renderizar descripción como HTML.
* No insertar respuestas de error como HTML.
* Mantener longitud máxima en backend.

---

## CSRF

El token se envía en:

```http
Authorization: Bearer
```

y no mediante cookies automáticas.

Eso reduce la exposición a CSRF tradicional.

---

## Transacciones

Cada creación, actualización o cancelación debe:

```text
guardar tarea + guardar historial + commit
```

dentro de una sola transacción.

Ante error:

```text
rollback completo
```

---

## Idempotencia

En este día:

* `DELETE` sobre tarea cancelada seguirá siendo idempotente;
* `PATCH` sin cambios no generará historial falso;
* doble submit frontend será bloqueado;
* no se implementarán claves de idempotencia distribuidas.

---

# Orden exacto de desarrollo

## Bloque A — Backend primero

1. Crear esquemas de usuarios.
2. Crear repositorio de consulta de usuarios.
3. Crear servicio de consulta de usuarios.
4. Agregar `GET /api/users`.
5. Crear esquemas de historial.
6. Agregar consulta de historial al repositorio.
7. Agregar consulta al query service.
8. Agregar autorización al service principal.
9. Agregar endpoint de historial.
10. Agregar validación de transiciones.
11. Evitar actualizaciones vacías.
12. Agregar límites de parámetros.
13. Crear pruebas.
14. Ejecutar pytest.

No comenzar páginas frontend hasta que estas pruebas estén verdes.

---

## Bloque B — Infraestructura frontend

15. Corregir `httpClient`.
16. Agregar estado de inicialización a auth.
17. Corregir `ProtectedRoute`.
18. Agregar API y hook de usuarios.
19. Agregar API y hook de detalle/historial.

---

## Bloque C — Navegación

20. Convertir `AppLayout` a `Outlet`.
21. Separar rutas.
22. Corregir `Sidebar`.
23. Corregir títulos dinámicos.

---

## Bloque D — Flujo de tareas

24. Implementar `TaskForm`.
25. Implementar creación.
26. Implementar detalle.
27. Implementar edición.
28. Conectar tabla.
29. Corregir filtros.
30. Eliminar controles masivos vacíos.
31. Agregar estilos.

---

## Bloque E — Validación final

32. Build frontend.
33. Tests backend.
34. Swagger.
35. Smoke tests.
36. Commit.
37. Push.
38. PR.
39. Merge.
40. Tag.

---

# Validación técnica final

Desde:

```powershell
D:\ProyectosFlutter\marquillas_task_manager
```

## Reconstrucción

```powershell
docker compose down
docker compose build --no-cache backend frontend
docker compose up -d
docker compose ps
```

## Logs

```powershell
docker compose logs backend --tail=150
docker compose logs frontend --tail=150
```

## Migraciones

```powershell
docker compose exec backend alembic current
docker compose exec backend alembic heads
docker compose exec backend alembic upgrade head
```

No debe aparecer una migración nueva del Día 07.

## Compilación backend

```powershell
docker compose exec backend python -m compileall app
```

## Tests

```powershell
docker compose exec backend python -m pytest -q
```

Resultado esperado:

```text
18 pruebas existentes + nuevas pruebas del Día 07
```

Idealmente entre:

```text
28 y 32 passed
```

El número exacto dependerá de la parametrización de los casos.

## Frontend

```powershell
docker compose exec frontend npm run build
```

Si existe:

```powershell
docker compose exec frontend npm run lint
```

## OpenAPI

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:8000/openapi.json" `
  -OutFile "$env:TEMP\marquillas-openapi-day07.json"
```

Verificar:

```powershell
Select-String `
  -Path "$env:TEMP\marquillas-openapi-day07.json" `
  -Pattern '"/api/tasks/\{task_id\}/history"'

Select-String `
  -Path "$env:TEMP\marquillas-openapi-day07.json" `
  -Pattern '"/api/users"'
```

---

# Smoke test funcional

## 1. Login administrador

```powershell
$loginBody = @{
    email = "admin@test.com"
    password = "12345678"
} | ConvertTo-Json

$login = Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:8000/api/auth/login" `
    -ContentType "application/json" `
    -Body $loginBody

$headers = @{
    Authorization = "Bearer $($login.access_token)"
}
```

## 2. Usuarios

```powershell
Invoke-RestMethod `
    -Method Get `
    -Uri "http://localhost:8000/api/users" `
    -Headers $headers
```

## 3. Crear tarea

```powershell
$taskBody = @{
    title = "Validate Day 07 workflow"
    description = "End-to-end task workflow validation"
    priority = "high"
} | ConvertTo-Json

$task = Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:8000/api/tasks" `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $taskBody
```

## 4. Consultar tarea

```powershell
Invoke-RestMethod `
    -Method Get `
    -Uri "http://localhost:8000/api/tasks/$($task.id)" `
    -Headers $headers
```

## 5. Editar tarea

```powershell
$updateBody = @{
    status = "in_progress"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Patch `
    -Uri "http://localhost:8000/api/tasks/$($task.id)" `
    -Headers $headers `
    -ContentType "application/json" `
    -Body $updateBody
```

## 6. Historial

```powershell
Invoke-RestMethod `
    -Method Get `
    -Uri "http://localhost:8000/api/tasks/$($task.id)/history" `
    -Headers $headers
```

## 7. Cancelar

```powershell
Invoke-RestMethod `
    -Method Delete `
    -Uri "http://localhost:8000/api/tasks/$($task.id)" `
    -Headers $headers
```

## 8. Repetir cancelación

```powershell
Invoke-RestMethod `
    -Method Delete `
    -Uri "http://localhost:8000/api/tasks/$($task.id)" `
    -Headers $headers
```

Debe mantenerse sin efectos secundarios adicionales.

---

# Validación visual obligatoria

Comprobar manualmente:

```text
http://localhost:5173/
http://localhost:5173/app
http://localhost:5173/app/tasks
http://localhost:5173/app/tasks/new
http://localhost:5173/app/users
```

Validar:

1. login;
2. redirección al dashboard;
3. navegación hacia tareas;
4. creación;
5. apertura de detalle;
6. edición;
7. historial;
8. cancelación;
9. actualización del listado;
10. recarga del navegador manteniendo sesión;
11. token inválido redirige al login;
12. navegación móvil;
13. miembro sin acceso visual a usuarios;
14. miembro sin posibilidad de reasignación.

---

# Commit del Día 07

Antes del commit:

```powershell
git status
git diff --check
git diff --stat
```

Commit recomendado:

```powershell
git add .
git commit -m "feat(tasks): complete task lifecycle and secure workflow"
```

Push:

```powershell
git push origin feature/day-07-task-workflow-completion
```

---

# Pull Request Día 07

Base:

```text
development
```

Compare:

```text
feature/day-07-task-workflow-completion
```

Título:

```text
feat(tasks): complete task lifecycle and secure workflow
```

Descripción:

```markdown
## Summary

Completes the end-to-end task workflow across backend and frontend.

## Backend

- Adds assignable-user queries.
- Adds task history endpoint.
- Strengthens task parameter validation.
- Enforces valid status transitions.
- Avoids empty update history entries.
- Preserves transactional task and history writes.

## Frontend

- Adds nested application routes.
- Adds create, detail and edit task pages.
- Implements the reusable task form.
- Connects task table actions.
- Adds task history visualization.
- Improves authentication initialization handling.
- Removes non-functional bulk action controls.
- Restricts administrative navigation visually.

## Validation

- Backend tests passing.
- Frontend production build passing.
- OpenAPI endpoints verified.
- End-to-end task lifecycle manually validated.
```

---

# Merge y tag del Día 07

Después del merge:

```powershell
git checkout development
git fetch origin --prune
git pull --ff-only origin development
```

Validar nuevamente:

```powershell
docker compose exec backend python -m pytest -q
docker compose exec frontend npm run build
```

Crear tag:

```powershell
git tag -a v0.7.0-task-workflow-completion -m "Release v0.7.0: secure end-to-end task workflow"
git push origin v0.7.0-task-workflow-completion
```

---

# Deuda técnica posterior al Día 07

## No crítica

Puede pasar a días posteriores:

* acciones masivas transaccionales;
* refresh token;
* rate limiting;
* logging estructurado;
* auditoría detallada por campo;
* recuperación de contraseña;
* desactivación de usuarios;
* métricas de dashboard;
* integración LLM;
* tests frontend;
* manejo global de notificaciones;
* ordenamiento backend;
* filtros por fecha.

## Debe quedar resuelto en Día 07

No debe pasar al siguiente día:

* rutas del sidebar que no funcionan;
* `TaskForm.jsx` vacío;
* botones `View` y `Edit` sin acción;
* botón `New Task` sin acción;
* acciones masivas falsas;
* `/app` mostrando tareas en vez del dashboard;
* falta de detalle de tarea;
* falta de edición;
* falta de historial visible;
* ausencia de estado de inicialización de autenticación;
* consulta insegura o inexistente de usuarios asignables.

---

# Próximo día después del cierre

Una vez cerrado el Día 07, el siguiente bloque correcto sería:

```text
Día 08 — Dashboard, Audit Detail and Operational UX
```

Rama prevista:

```text
feature/day-08-dashboard-audit-operational-ux
```

Pero no debe abrirse hasta que el Día 07 esté:

```text
committed
pushed
merged
tested
tagged
```
