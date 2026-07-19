Estoy de acuerdo con la estrategia. Con base en el estado que compartiste y el historial Git,  **no continuaría agregando funcionalidades al backend** . El backend ya cumple el objetivo principal del  **Punto 1** :

* ✅ CRUD de tareas
* ✅ JWT
* ✅ RBAC
* ✅ Validaciones
* ✅ Filtros
* ✅ Paginación
* ✅ Docker
* ✅ SQL Server
* ✅ Swagger/OpenAPI
* ✅ Alembic
* ✅ Health Checks
* ✅ 18/18 pruebas automáticas

Desde la perspectiva de una prueba técnica, seguir invirtiendo tiempo en el backend tiene un retorno decreciente. El siguiente bloque con mayor peso es el  **Frontend** , que representa la otra mitad del **40%** del Punto 1.

---

# Development Day 06

## Objetivo

Completar el **Frontend Foundation** para cerrar el Punto 1 de la prueba técnica.

No vamos a diseñar una aplicación bonita.

Vamos a construir un frontend:

* limpio
* modular
* reutilizable
* fácil de explicar
* alineado con React moderno

---

# Rama

Partiendo de **development** (después del merge del PR):

```powershell
git checkout development
git pull origin development
git checkout -b feature/day-06-frontend-foundation
git push -u origin feature/day-06-frontend-foundation
```

---

# Objetivo del día

Al finalizar el Día 06 debe existir:

```
Frontend completamente conectado al Backend
```

con:

* Login
* JWT
* Protección de rutas
* Layout
* Listado de tareas
* Filtros
* Paginación

Todavía **NO** vamos a crear formularios.

---

# Orden de implementación

Siempre de abajo hacia arriba.

Nunca comenzar por las páginas.

---

# Paso 1

## Estructura

```
frontend/

src/

    api/

    auth/

    components/

    hooks/

    layouts/

    pages/

    routes/

    services/

    styles/

    utils/
```

---

# Paso 2

## API

Crear

```
frontend/src/api/
```

Archivos

```
httpClient.js

authApi.js

taskApi.js

userApi.js
```

Responsabilidad

Toda comunicación HTTP.

Nada de fetch dentro de componentes.

---

# Paso 3

## Auth

```
src/auth/
```

Crear

```
AuthContext.jsx

ProtectedRoute.jsx

TokenStorage.js
```

Responsabilidades

* login
* logout
* guardar JWT
* leer JWT
* validar autenticación

---

# Paso 4

## Layout

```
src/layouts/
```

Crear

```
AppLayout.jsx
```

Contendrá

```
Header

Sidebar

Main

Footer
```

Todo reutilizable.

---

# Paso 5

## Componentes reutilizables

```
components/
```

Crear

```
LoadingState

EmptyState

ErrorState

Pagination

StatusBadge

PriorityBadge
```

Estos componentes serán utilizados por todas las páginas.

---

# Paso 6

## Hooks

```
hooks/
```

Crear

```
useTasks.js

useAuth.js
```

Toda la lógica de React vive aquí.

Las páginas solamente renderizan.

---

# Paso 7

## Página Login

```
pages/LoginPage.jsx
```

Debe permitir

* email
* password
* login
* guardar JWT
* redirigir

---

# Paso 8

## Página principal

```
pages/TasksPage.jsx
```

Debe mostrar

Tabla

↓

Filtros

↓

Paginación

↓

Estados

↓

Errores

↓

Vacío

---

# Paso 9

## Tabla

Crear

```
components/tasks/

TaskTable.jsx
```

Debe renderizar

Título

Estado

Prioridad

Asignado

Fecha

Acciones

---

# Paso 10

## Filtros

Crear

```
TaskFilters.jsx
```

Filtros

Estado

Prioridad

Usuario

---

# Paso 11

## Paginación

Ya existe en Backend.

Solo consumir

```
?page=

&page_size=
```

---

# Paso 12

## Rutas

```
routes/

AppRouter.jsx
```

Debe existir

```
/

↓

Login

/app

↓

Tasks
```

Protegidas mediante

```
ProtectedRoute
```

---

# Paso 13

## Estilos

```
styles/

global.css

layout.css

forms.css

tasks.css
```

Nada de CSS repetido.

---

# Día 06 NO incluye

No vamos a desarrollar todavía:

* Crear tarea
* Editar tarea
* Historial
* Usuarios
* IA

Eso corresponde al siguiente incremento.

---

# Resultado esperado al finalizar el Día 06

El usuario podrá:

✅ iniciar sesión

↓

✅ recibir JWT

↓

✅ navegar

↓

✅ consumir la API

↓

✅ listar tareas

↓

✅ filtrar

↓

✅ paginar

↓

✅ manejar estados de carga

↓

✅ manejar errores

↓

✅ manejar listas vacías

Todo conectado al backend ya validado.

---

# Versionado propuesto

Al cerrar este día, el hito natural sería:

```text
v0.7.0-frontend-foundation
```

porque:

* **v0.6.0** : Backend Validation Stable (cierre del backend del Punto 1).
* **v0.7.0** : Frontend Foundation (primera mitad del frontend).
* **v0.8.0** : Frontend CRUD Experience (formularios, edición y validaciones).
* **v0.9.0** : Full Stack Application Complete (cierre completo del Punto 1).

Esta secuencia mantiene un historial Git claro, con hitos alineados tanto al flujo del proyecto como a los entregables de la prueba técnica.
