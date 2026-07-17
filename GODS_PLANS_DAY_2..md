# Estado estimado al cerrar el Día 02

Si completas correctamente **Identity Foundation** con:

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/users
```

más JWT, hash de contraseñas, roles, protección de rutas, administrador inicial y pruebas básicas, el proyecto pasaría aproximadamente de **8–12 %** a  **18–22 % de cumplimiento global evaluable** .

Es una estimación técnica, no una calificación garantizada.

## Impacto por componente

| Componente evaluado    | Peso |             Estado después del Día 02 |
| ---------------------- | ---: | --------------------------------------: |
| Aplicación full-stack | 40 % | Aproximadamente 20–25 % del componente |
| Base de datos          | 15 % |                Aproximadamente 35–40 % |
| Consultas T-SQL        | 15 % |                                     0 % |
| Integración LLM       | 15 % |                                     0 % |
| Diseño de agente      | 10 % |                                     0 % |
| Repositorio y Git      |  5 % |       100 % del requisito mínimo de PR |

Dentro del componente full-stack quedarían satisfechos:

* Autenticación JWT.
* Login.
* Usuario actual.
* Rutas protegidas.
* Roles `admin` y `member`.
* Creación de usuarios restringida.
* Respuestas `401` y `403`.
* Parte de los tests automáticos.
* Segundo Pull Request hacia `development`.

Seguirían pendientes los elementos de mayor volumen:

* CRUD de tareas.
* Reasignación de tareas.
* Validación de fecha límite futura.
* Filtros y paginación.
* Historial funcional.
* Frontend del gestor.
* Consultas SQL.
* Integración LLM.
* Documento del agente.

---

# Día 02 — Identity Foundation

## Objetivo

Implementar identidad, autenticación y autorización mínimas para soportar el CRUD de tareas requerido por la prueba técnica.

## Restricción de alcance

Durante este día no se desarrollarán:

* CRUD de tareas.
* Refresh tokens.
* Recuperación de contraseña.
* Cierre de sesión con revocación.
* OAuth.
* Multi-tenant.
* MFA.
* Gestión de sesiones persistentes.
* Interfaz gráfica de login.
* Permisos configurables.
* Migraciones nuevas.

La prueba no exige multi-tenancy. Por tanto, no se debe agregar `tenant_id`, aislamiento por tenant ni middleware multi-tenant. Eso sería sobreingeniería y consumiría tiempo sin aumentar el cumplimiento.

El JWT será stateless. El archivo vacío `auth_session_model.py` no se utilizará durante este hito.

---

# Estado inicial

La rama correcta ya existe:

```text
feature/day-02-identity-foundation
```

Antes de comenzar:

```powershell
Set-Location D:\ProyectosFlutter\marquillas_task_manager

git branch --show-current
git status
git log --oneline -5
```

Resultado esperado:

```text
feature/day-02-identity-foundation
```

El árbol debe estar limpio.

---

# Plan de ejecución de dos horas

|       Tiempo | Hito                                        |
| -----------: | ------------------------------------------- |
|    0–10 min | Validar rama, contenedores y base           |
|   10–25 min | Configuración JWT                          |
|   25–40 min | Hash y generación de tokens                |
|   40–60 min | Schemas, repositorio y servicio de usuarios |
|   60–80 min | Servicio y dependencias de autenticación   |
|   80–95 min | Endpoints                                   |
|  95–105 min | Administrador inicial                       |
| 105–115 min | Pruebas mínimas                            |
| 115–120 min | Validación, commit y push                  |

---

# Día 02.1 — Validación de la base actual

## Acción

No modificar archivos.

## Comandos

Desde:

```text
D:\ProyectosFlutter\marquillas_task_manager
```

Ejecutar:

```powershell
docker compose up -d
docker compose ps
docker compose exec backend alembic current
Invoke-RestMethod http://localhost:8000/health
Invoke-RestMethod http://localhost:8000/health/database
```

Resultado esperado:

```text
001_initial_schema (head)
```

y ambos endpoints con estado `ok`.

---

# Día 02.2 — Configuración JWT

## Modificar

```text
backend/app/core/config.py
```

## Acción

Agregar únicamente parámetros de autenticación:

```python
jwt_secret_key: SecretStr
jwt_algorithm: str = "HS256"
jwt_access_token_expire_minutes: int = Field(default=60, ge=1, le=1440)
```

No hardcodear el secreto.

## Modificar

```text
docker-compose.yml
```

## Acción

Agregar al servicio `backend`:

```yaml
JWT_SECRET_KEY: "${JWT_SECRET_KEY}"
JWT_ALGORITHM: "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES: "60"
```

## Modificar

```text
.env
```

Agregar localmente:

```env
JWT_SECRET_KEY=<secreto-aleatorio-largo>
```

No subir este archivo.

Puede generar el secreto con:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

## Modificar

```text
backend/.env.example
```

Agregar:

```env
JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
```

## Validación

```powershell
docker compose config --quiet
git check-ignore .env
git ls-files .env
```

`git ls-files .env` no debe mostrar nada.

---

# Día 02.3 — Seguridad criptográfica

## Modificar

```text
backend/app/core/security.py
```

## Responsabilidad

Este archivo debe contener exclusivamente:

* Hash de contraseña.
* Verificación de contraseña.
* Creación de access token.
* Decodificación y validación de JWT.

Funciones recomendadas:

```python
hash_password(password: str) -> str
verify_password(password: str, password_hash: str) -> bool
create_access_token(subject: str) -> str
decode_access_token(token: str) -> str
```

## Decisiones

Usar:

* `bcrypt` para contraseñas.
* `python-jose` para JWT.
* Fecha de expiración UTC.
* Claim `sub` para identificar el usuario.
* Claim `exp` para expiración.
* Algoritmo fijo desde configuración.

No aceptar el algoritmo enviado por el token.

## Seguridad cubierta

* La contraseña nunca se almacena en texto plano.
* El JWT tiene expiración.
* El secreto no queda en el repositorio.
* El identificador del usuario se obtiene desde `sub`.
* Los tokens inválidos o vencidos producen `401`.
* No se exponen errores internos de `jose`.

---

# Día 02.4 — Schemas de usuario

## Crear

```text
backend/app/modules/users/schemas/user_schemas.py
```

## Clases mínimas

```text
UserCreate
UserResponse
```

### `UserCreate`

Campos:

```text
name
email
password
role
```

Validaciones:

* `name`: mínimo 2, máximo 120.
* `email`: correo válido y normalizado a minúsculas.
* `password`: mínimo 8 caracteres.
* `role`: únicamente `admin` o `member`.

### `UserResponse`

Campos:

```text
id
name
email
role
is_active
created_at
updated_at
```

Nunca retornar:

```text
password
password_hash
```

## Modificar

```text
backend/requirements.txt
```

Solo si `EmailStr` no está soportado actualmente, agregar:

```text
email-validator
```

Después reconstruir únicamente backend:

```powershell
docker compose build backend
docker compose up -d backend
```

---

# Día 02.5 — Repositorio de usuarios

## Crear

```text
backend/app/modules/users/repositories/user_repository.py
```

## Funciones mínimas

```python
get_user_by_id(db: Session, user_id: int) -> User | None
get_user_by_email(db: Session, email: str) -> User | None
create_user(db: Session, user: User) -> User
```

## Reglas

* Todas las consultas mediante SQLAlchemy.
* No construir SQL concatenando strings.
* Normalizar el correo antes de consultar.
* `flush()` antes de retornar el registro.
* `refresh()` después del commit, si el commit se realiza en el repositorio.
* Elegir un único propietario de la transacción.

Para este proyecto pequeño:

```text
El servicio controla commit y rollback.
El repositorio solo consulta, agrega y hace flush.
```

Esto evita transacciones distribuidas entre capas.

---

# Día 02.6 — Servicio de usuarios

## Crear

```text
backend/app/modules/users/services/user_service.py
```

## Responsabilidad

Implementar:

```python
create_user(db: Session, payload: UserCreate) -> User
```

## Reglas

1. Normalizar correo.
2. Verificar que no exista.
3. Hashear contraseña.
4. Crear `User`.
5. Hacer commit.
6. Hacer rollback ante error.
7. Retornar usuario sin contraseña.

## Errores

Correo duplicado:

```text
409 Conflict
```

Aunque la prueba no menciona `409`, es más preciso que `400` para un recurso duplicado.

Datos inválidos:

```text
422 Unprocessable Entity
```

El `UNIQUE` de SQL Server continúa siendo la última barrera frente a carreras concurrentes. La verificación previa mejora la experiencia, pero no sustituye la restricción física.

---

# Día 02.7 — Schemas de autenticación

## Crear

```text
backend/app/modules/auth/schemas/auth_schemas.py
```

## Clases mínimas

```text
LoginRequest
TokenResponse
```

### `LoginRequest`

```text
email
password
```

### `TokenResponse`

```text
access_token
token_type
expires_in
```

Valor esperado:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

# Día 02.8 — Servicio de autenticación

## Crear

```text
backend/app/modules/auth/services/auth_service.py
```

## Función mínima

```python
authenticate_user(db: Session, email: str, password: str) -> User
```

## Reglas

* Consultar usuario por correo normalizado.
* Verificar `is_active`.
* Verificar password mediante bcrypt.
* No revelar si falló el correo o la contraseña.
* Retornar siempre el mismo mensaje ante credenciales incorrectas.

Respuesta:

```text
401 Unauthorized
```

Mensaje recomendado:

```text
Invalid credentials
```

Esto limita enumeración de usuarios.

---

# Día 02.9 — Dependencias de seguridad

## Crear

```text
backend/app/modules/auth/auth_dependencies.py
```

## Dependencias

```python
get_current_user(...)
require_admin(...)
```

### `get_current_user`

Flujo:

```text
Authorization: Bearer <token>
        ↓
Validar JWT
        ↓
Extraer sub
        ↓
Consultar usuario
        ↓
Verificar is_active
        ↓
Retornar User
```

Errores:

* Token ausente: `401`.
* Token inválido: `401`.
* Token vencido: `401`.
* Usuario inexistente: `401`.
* Usuario inactivo: `401`.

Header:

```text
WWW-Authenticate: Bearer
```

### `require_admin`

Recibe el usuario autenticado.

Regla:

```python
current_user.role == "admin"
```

Si no:

```text
403 Forbidden
```

---

# Día 02.10 — Endpoint de login

## Crear

```text
backend/app/modules/auth/api/auth_routes.py
```

## Endpoint

```text
POST /api/auth/login
```

Entrada:

```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

Salida:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

## Endpoint

```text
GET /api/auth/me
```

Protegido con:

```text
get_current_user
```

Salida:

```json
{
  "id": 1,
  "name": "Administrator",
  "email": "admin@example.com",
  "role": "admin",
  "is_active": true
}
```

---

# Día 02.11 — Endpoint administrativo de usuarios

## Crear

```text
backend/app/modules/users/api/user_routes.py
```

## Endpoint

```text
POST /api/users
```

Protección:

```text
require_admin
```

Respuestas:

| Caso              | Código |
| ----------------- | ------: |
| Usuario creado    |     201 |
| Sin token         |     401 |
| Token inválido   |     401 |
| Usuario member    |     403 |
| Correo repetido   |     409 |
| Payload inválido |     422 |

No crear aún:

* `GET /api/users`
* `PATCH /api/users/{id}`
* `DELETE /api/users/{id}`

La prueba solo exige que el administrador pueda crear usuarios. El resto puede desarrollarse únicamente si posteriormente resulta necesario.

---

# Día 02.12 — Registro de routers

## Modificar

```text
backend/app/main.py
```

## Acción

Importar y registrar:

```python
from app.modules.auth.auth_routes import router as auth_router
from app.modules.users.user_routes import router as users_router
```

Agregar:

```python
app.include_router(auth_router)
app.include_router(users_router)
```

Los routers deben declarar sus propios prefijos:

```text
/api/auth
/api/users
```

No repetir prefijos en `main.py`.

---

# Día 02.13 — Administrador reproducible

## Crear

```text
backend/app/commands/create_initial_admin.py
```

## Responsabilidad

Crear un administrador inicial de manera idempotente.

Variables:

```text
INITIAL_ADMIN_NAME
INITIAL_ADMIN_EMAIL
INITIAL_ADMIN_PASSWORD
```

## Modificar

```text
docker-compose.yml
```

Agregar al backend:

```yaml
INITIAL_ADMIN_NAME: "${INITIAL_ADMIN_NAME}"
INITIAL_ADMIN_EMAIL: "${INITIAL_ADMIN_EMAIL}"
INITIAL_ADMIN_PASSWORD: "${INITIAL_ADMIN_PASSWORD}"
```

## Modificar

```text
backend/.env.example
```

Agregar valores de ejemplo no reales.

## Comportamiento idempotente

```text
Si el correo no existe:
    crear administrador
Si ya existe:
    no duplicar
    terminar correctamente
```

El script no debe cambiar silenciosamente la contraseña de un administrador existente.

## Ejecución

Desde la raíz:

```powershell
docker compose exec backend python -m app.commands.create_initial_admin
```

Puede ejecutarse dos veces para verificar idempotencia:

```powershell
docker compose exec backend python -m app.commands.create_initial_admin
docker compose exec backend python -m app.commands.create_initial_admin
```

Debe quedar un solo usuario.

---

# Día 02.14 — Pruebas automáticas mínimas

## Crear

```text
backend/tests/__init__.py
backend/tests/conftest.py
backend/tests/test_auth.py
```

## Agregar dependencias de prueba

Modificar:

```text
backend/requirements.txt
```

Agregar únicamente si no existen:

```text
pytest
httpx
```

## Casos mínimos

### Test 1

```text
Login con credenciales incorrectas devuelve 401.
```

### Test 2

```text
GET /api/auth/me sin token devuelve 401.
```

### Test 3

```text
Un member autenticado no puede crear usuarios y recibe 403.
```

Estos tres tests contribuyen directamente al mínimo de tres tests exigido por la prueba. Sin embargo, posteriormente conviene agregar tests de reglas de tareas, porque el evaluador solicita reglas de negocio y autenticación no cubre todo el dominio.

## Ejecución

```powershell
docker compose exec backend pytest -q
```

---

# Día 02.15 — Validación funcional

## Reiniciar backend

Como `backend` usa bind mount, los cambios de código se reflejan en el contenedor, pero las dependencias nuevas requieren rebuild:

```powershell
docker compose build backend
docker compose up -d backend
docker compose ps
```

## Crear administrador

```powershell
docker compose exec backend python -m app.commands.create_initial_admin
```

## Verificar Swagger

Abrir:

```text
http://localhost:8000/docs
```

Deben aparecer:

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/users
GET  /health
GET  /health/database
```

## Validar login desde PowerShell

```powershell
$loginBody = @{
    email = $env:INITIAL_ADMIN_EMAIL
    password = $env:INITIAL_ADMIN_PASSWORD
} | ConvertTo-Json

$login = Invoke-RestMethod `
    -Method Post `
    -Uri http://localhost:8000/api/auth/login `
    -ContentType "application/json" `
    -Body $loginBody

$token = $login.access_token
$token
```

Si esas variables no están cargadas en la sesión de PowerShell, usar los valores locales de `.env` manualmente sin pegarlos en documentación ni commits.

## Validar usuario actual

```powershell
Invoke-RestMethod `
    -Method Get `
    -Uri http://localhost:8000/api/auth/me `
    -Headers @{ Authorization = "Bearer $token" }
```

## Crear usuario member

```powershell
$userBody = @{
    name = "Team Member"
    email = "member@example.com"
    password = "SecureMember123!"
    role = "member"
} | ConvertTo-Json

Invoke-RestMethod `
    -Method Post `
    -Uri http://localhost:8000/api/users `
    -Headers @{ Authorization = "Bearer $token" } `
    -ContentType "application/json" `
    -Body $userBody
```

Resultado esperado:

```text
201 Created
```

## Verificar ausencia de stack traces

Probar token inválido:

```powershell
try {
    Invoke-RestMethod `
        -Method Get `
        -Uri http://localhost:8000/api/auth/me `
        -Headers @{ Authorization = "Bearer invalid-token" }
} catch {
    $_.Exception.Response.StatusCode.value__
}
```

Resultado:

```text
401
```

La respuesta no debe contener traceback.

---

# Día 02.16 — Validación técnica final

```powershell
docker compose exec backend python -m py_compile /app/app/core/config.py
docker compose exec backend python -m py_compile /app/app/core/security.py
docker compose exec backend python -m py_compile /app/app/modules/auth/schemas/auth_schemas.py
docker compose exec backend python -m py_compile /app/app/modules/auth/services/auth_service.py
docker compose exec backend python -m py_compile /app/app/modules/auth/auth_dependencies.py
docker compose exec backend python -m py_compile /app/app/modules/auth/api/auth_routes.py
docker compose exec backend python -m py_compile /app/app/modules/users/schemas/user_schemas.py
docker compose exec backend python -m py_compile /app/app/modules/users/repositories/user_repository.py
docker compose exec backend python -m py_compile /app/app/modules/users/services/user_service.py
docker compose exec backend python -m py_compile /app/app/modules/users/api/user_routes.py
docker compose exec backend python -m py_compile /app/app/commands/create_initial_admin.py
docker compose exec backend pytest -q
docker compose exec backend alembic current
Invoke-RestMethod http://localhost:8000/health
Invoke-RestMethod http://localhost:8000/health/database
```

No debe generarse una migración `002`, porque la identidad usa columnas ya existentes:

```text
email
password_hash
role
is_active
```

---

# Archivos del Día 02

## Crear

```text
backend/app/modules/auth/schemas/auth_schemas.py
backend/app/modules/auth/services/auth_service.py
backend/app/modules/auth/auth_dependencies.py
backend/app/modules/auth/api/auth_routes.py
backend/app/modules/users/schemas/user_schemas.py
backend/app/modules/users/repositories/user_repository.py
backend/app/modules/users/services/user_service.py
backend/app/modules/users/api/user_routes.py
backend/app/commands/create_initial_admin.py
backend/tests/__init__.py
backend/tests/conftest.py
backend/tests/test_auth.py
```

## Modificar

```text
backend/app/core/config.py
backend/app/core/security.py
backend/app/main.py
backend/requirements.txt
backend/.env.example
docker-compose.yml
```

## No modificar

```text
backend/app/modules/users/user_model.py
backend/app/modules/tasks/task_model.py
backend/app/modules/tasks/task_history_model.py
backend/migrations/env.py
backend/migrations/versions/001_initial_schema.py
backend/app/core/database.py
frontend/*
```

No se debe tocar el frontend durante este hito. El login visual será parte del día de frontend. Crear ahora contextos, hooks o componentes incompletos aumentaría superficie y riesgo sin cerrar un requisito completo.

---

# Seguridad cubierta sin sobreingeniería

## Inyección SQL

Mitigación:

* SQLAlchemy ORM.
* Parámetros enlazados.
* Sin concatenación SQL.
* Constraints físicos en SQL Server.

## Enumeración de usuarios

Mitigación:

* Login retorna el mismo mensaje para usuario inexistente y contraseña incorrecta.

## Escalada de privilegios

Mitigación:

* `POST /api/users` usa `require_admin`.
* El rol no se toma del token como única fuente; se consulta el usuario actual en base de datos.

## Exposición de contraseñas

Mitigación:

* Hash bcrypt.
* `password_hash` no aparece en schemas de respuesta.
* Swagger no devuelve credenciales.

## Tokens alterados o vencidos

Mitigación:

* Firma JWT.
* Algoritmo fijo.
* Expiración.
* Respuesta `401`.
* Usuario activo validado en cada solicitud.

## Duplicación de administrador

Mitigación:

* Seed idempotente.
* Restricción `UNIQUE` sobre email.

## Multi-tenant

No aplica al reto. No agregar aislamiento de tenants inexistentes.

---

# Cierre Git del Día 02

Solo cerrar cuando:

```text
POST /api/auth/login funciona.
GET /api/auth/me funciona.
POST /api/users funciona para admin.
POST /api/users devuelve 403 para member.
Credenciales inválidas devuelven 401.
El seed es idempotente.
Los tests pasan.
Swagger muestra Bearer authentication.
No hay secretos rastreados.
```

## Revisar cambios

```powershell
git status
git diff --stat
git diff --check
git check-ignore .env
git ls-files .env
```

## Commit

```powershell
git add backend/app/core/config.py
git add backend/app/core/security.py
git add backend/app/main.py
git add backend/requirements.txt
git add backend/.env.example
git add backend/app/modules/auth
git add backend/app/modules/users
git add backend/app/commands/create_initial_admin.py
git add backend/tests
git add docker-compose.yml

git status
git commit -m "feat(auth): implement JWT identity foundation"
```

## Push

```powershell
git push origin feature/day-02-identity-foundation
```

## Pull Request

Destino:

```text
development
```

Origen:

```text
feature/day-02-identity-foundation
```

Título:

```text
feat(auth): implement JWT identity foundation
```

## Descripción resumida del PR

```markdown
# Día 02 — Identity Foundation

## Objetivo

Implementar autenticación y autorización JWT para proteger la API y habilitar la gestión administrativa de usuarios.

## Alcance

- Hash seguro de contraseñas.
- Login mediante JWT.
- Bearer authentication.
- Consulta del usuario autenticado.
- Roles `admin` y `member`.
- Creación de usuarios restringida a administradores.
- Administrador inicial reproducible e idempotente.
- Manejo de errores `401`, `403`, `409` y `422`.
- Pruebas automáticas básicas de autenticación.

## Endpoints

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/users`

## Validaciones

- Compilación de módulos Python.
- Pruebas con `pytest`.
- Login válido e inválido.
- Protección de rutas.
- Restricción administrativa.
- Health checks.
- Verificación de Alembic.
```

## Después del merge

```powershell
git checkout development
git pull origin development
git tag -a v0.3.0-identity-foundation -m "Identity Foundation"
git push origin v0.3.0-identity-foundation
git branch -d feature/day-02-identity-foundation
git push origin --delete feature/day-02-identity-foundation
git checkout -b feature/day-03-task-domain
git push -u origin feature/day-03-task-domain
```

---

# Siguiente hito

Después del merge del Día 02 comenzará:

```text
Día 03 — Task Domain
```

Su alcance deberá limitarse a:

* agregar `due_date` mediante migración `002`;
* schemas de tareas;
* repository;
* service;
* CRUD;
* validación de fecha futura;
* permisos de reasignación;
* registro de historial;
* errores 400, 403, 404 y 422.

No debe comenzar hasta que Identity Foundation esté integrada y validada en `development`.
