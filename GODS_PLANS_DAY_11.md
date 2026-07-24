
# Antes de iniciar el Día 10: corrección obligatoria del versionado

En la secuencia mostrada falta el **merge del Pull Request del Día 9 hacia `development`**.

Además, ejecutaste:

```powershell
git checkout development
git pull origin development
git tag -a v0.9.0-sql-server-foundation ...
```

cuando `development` todavía estaba en:

```text
c58d23f
```

Por tanto, el tag `v0.9.0-sql-server-foundation` quedó apuntando al estado anterior y **no contiene el commit SQL `4a5f675`**.

La rama `feature/day-10-openai-agent-foundation` también nació desde ese estado anterior. Antes de escribir código debes corregir la línea de integración.

## 0.1. Primero, en GitHub

Completa el Pull Request:

```text
feature/day-09-sql-server-foundation
↓
development
```

Confirma que GitHub muestre el PR como:

```text
Merged
```

## 0.2. Corregir tag y recrear la rama Día 10

Después del merge, ejecuta desde la raíz:

```powershell
git checkout development
```

```powershell
git pull origin development
```

Verifica que el commit SQL esté incluido:

```powershell
git log --oneline -5
```

Debe aparecer `4a5f675` o el merge commit que lo contiene.

Elimina el tag incorrecto local:

```powershell
git tag -d v0.9.0-sql-server-foundation
```

Elimina el tag incorrecto remoto:

```powershell
git push origin --delete v0.9.0-sql-server-foundation
```

Créalo nuevamente sobre `development` actualizado:

```powershell
git tag -a v0.9.0-sql-server-foundation -m "SQL Server queries, stored procedure and validation foundation"
```

```powershell
git push origin v0.9.0-sql-server-foundation
```

Como la rama Día 10 todavía está vacía, elimínala y recréala desde el `development` correcto:

```powershell
git branch -D feature/day-10-openai-agent-foundation
```

```powershell
git push origin --delete feature/day-10-openai-agent-foundation
```

```powershell
git checkout -b feature/day-10-openai-agent-foundation
```

```powershell
git push -u origin feature/day-10-openai-agent-foundation
```

---

# Development Day 10 — LLM Enrichment and Agent Design

No corresponde crear un Día `9.x`.

El Día 9 ya representa una unidad funcional cerrada: SQL Server Foundation. El siguiente hito limpio es:

```text
Día 10 — IA: enriquecimiento con LLM y diseño de agente
```

## Objetivo del día

Cerrar los puntos 4 y 5 de la prueba técnica:

1. Implementar `POST /api/ai/enrich-task`.
2. Obtener una salida JSON estructurada.
3. Validar la salida mediante Pydantic.
4. Responder con fallback seguro ante errores.
5. Versionar el system prompt.
6. Documentar protección contra prompt injection y control de costos.
7. Crear `/docs/agente.md`, máximo dos páginas.

## Decisiones para evitar sobreingeniería

Durante este día:

* No se modifica la base de datos.
* No se crean migraciones.
* No se modifica el módulo de tareas.
* No se añade una pantalla frontend.
* No se crea persistencia de respuestas del LLM.
* No se crean colas, caché Redis ni workers.
* No se introduce multi-tenancy porque este proyecto no tiene arquitectura multi-tenant.
* No se permite que el LLM invoque herramientas ni modifique tareas.
* El endpoint solamente devuelve sugerencias.
* Se reutiliza JWT y la dependencia de autenticación existentes.
* No se crea un “agente real”; el Punto 5 exige únicamente diseño documental.

Esto protege el 30 % restante de la evaluación sin poner en riesgo el 70 % ya terminado.

---

# Orden exacto de integración

## Paso 1 — Dependencia y configuración

### Modificar

```text
backend/requirements.txt
```

### Acción

Agregar únicamente la dependencia oficial del proveedor LLM utilizado:

```text
openai
```

No fijes una versión arbitraria sin comprobar el archivo actual. Si las dependencias ya usan versiones exactas, conserva ese patrón.

### Modificar

```text
backend/app/core/config.py
```

### Acción

Agregar las configuraciones:

```python
openai_api_key
openai_model
openai_timeout_seconds
```

Valores conceptuales:

```text
OPENAI_API_KEY
OPENAI_MODEL
OPENAI_TIMEOUT_SECONDS=8
```

La clave debe modelarse como secreto, siguiendo el patrón usado por `database_password` y JWT.

### Modificar

```text
.env.example
```

### Acción

Agregar:

```env
OPENAI_API_KEY=
OPENAI_MODEL=
OPENAI_TIMEOUT_SECONDS=8
```

No modificar ni versionar `.env`.

---

## Paso 2 — System prompt versionado

### Crear

```text
backend/app/modules/ai/prompts/enrich_task_system.txt
```

### Responsabilidad

Definir exclusivamente:

* rol del modelo;
* tratamiento de título y descripción como datos no confiables;
* prohibición de obedecer instrucciones incluidas en la tarea;
* categorías cortas;
* prioridades permitidas;
* resumen máximo de dos líneas;
* confianza entre `0.0` y `1.0`;
* obligación de devolver únicamente la estructura esperada.

No incluir la API key, lógica Python ni contenido dinámico.

---

## Paso 3 — Schemas de entrada y salida

### Crear

```text
backend/app/modules/ai/schemas/ai_schemas.py
```

### Acción

Crear estos modelos:

```python
TaskEnrichmentRequest
TaskEnrichmentResponse
```

### Contrato de entrada

```json
{
  "title": "string",
  "description": "string"
}
```

Validaciones:

* `title`: mínimo 1, máximo 200.
* `description`: opcional, máximo 5000.
* normalización mediante `strip()`.
* título vacío después de normalizar: inválido.

### Contrato de salida

```json
{
  "prioridad_sugerida": "baja | media | alta",
  "categoria_sugerida": "string corto",
  "resumen": "1-2 líneas para el asignado",
  "confianza": 0.0
}
```

Validaciones:

* prioridad mediante `Literal["baja", "media", "alta"]`;
* categoría con longitud máxima;
* resumen con longitud máxima;
* confianza con `ge=0.0` y `le=1.0`;
* modelo inmutable si ese patrón ya se usa en los schemas del proyecto.

No aceptar campos libres.

---

## Paso 4 — Servicio LLM

### Crear

```text
backend/app/modules/ai/services/ai_service.py
```

### Responsabilidad

Implementar una clase pequeña:

```text
TaskEnrichmentService
```

Con una operación pública:

```text
enrich_task(...)
```

### Flujo interno

1. Cargar el prompt desde el archivo.
2. Enviar título y descripción como datos delimitados.
3. Solicitar salida estructurada contra `TaskEnrichmentResponse`.
4. Validar nuevamente el resultado con Pydantic.
5. Retornar la sugerencia válida.
6. Aplicar fallback ante cualquier fallo controlado.

### Fallback recomendado

```json
{
  "prioridad_sugerida": "media",
  "categoria_sugerida": "general",
  "resumen": "Revisar la tarea y confirmar alcance, prioridad y responsable.",
  "confianza": 0.0
}
```

### Errores que debe absorber el servicio

* timeout;
* rate limit;
* respuesta vacía;
* JSON inválido;
* schema inválido;
* error temporal del proveedor;
* clave ausente o proveedor no configurado.

El endpoint no debe devolver stack traces ni propagar excepciones del SDK.

### Seguridad

* No concatenar instrucciones del usuario dentro del system prompt.
* Tratar título y descripción como datos.
* No habilitar tools.
* No permitir lectura de archivos solicitados por el usuario.
* No exponer variables de entorno.
* Aplicar límites de longitud antes de llamar al proveedor.
* No registrar el prompt completo ni la clave.
* No ejecutar código generado.
* No aceptar nombres de modelo desde el request.

---

## Paso 5 — Endpoint protegido

### Crear

```text
backend/app/modules/ai/ai_routes.py
```

### Endpoint

```http
POST /api/ai/enrich-task
```

### Acción

* Recibir `TaskEnrichmentRequest`.
* Exigir usuario autenticado.
* Permitir tanto `admin` como `member`.
* Invocar `TaskEnrichmentService`.
* Devolver `TaskEnrichmentResponse`.
* Mantener el formato de errores del proyecto.
* No persistir la sugerencia.
* No modificar automáticamente la tarea.

La reasignación sigue protegida por sus reglas existentes. Este endpoint no debe convertirse en un bypass de permisos.

### Estado HTTP

```text
200 OK
```

También cuando se use fallback, porque el requisito indica que el endpoint no puede caerse por fallos del proveedor.

Los errores de entrada o seguridad siguen funcionando normalmente:

```text
401 Unauthorized
422 Unprocessable Entity
```

---

## Paso 6 — Registrar el router

### Modificar

El archivo central donde actualmente se registran los routers de:

* autenticación;
* usuarios;
* tareas.

Probablemente:

```text
backend/app/main.py
```

o el agregador de routers que ya utilice el proyecto.

### Acción

Agregar exclusivamente el router de IA:

```python
app.include_router(ai_router)
```

o su equivalente actual.

No crear un segundo sistema de enrutamiento ni alterar los prefijos existentes.

El endpoint final debe quedar exactamente como:

```text
POST /api/ai/enrich-task
```

---

## Paso 7 — Tests mínimos del endpoint

### Crear

```text
backend/tests/test_ai_enrichment.py
```

### Pruebas imprescindibles

#### Test 1 — Requiere autenticación

```text
POST /api/ai/enrich-task
sin token
→ 401
```

#### Test 2 — Valida entrada

Título vacío:

```json
{
  "title": "   ",
  "description": "Descripción"
}
```

Resultado:

```text
422
```

#### Test 3 — Fallback ante error del proveedor

Mockear el cliente LLM para lanzar timeout.

Resultado:

```text
200
```

Y cuerpo:

```json
{
  "prioridad_sugerida": "media",
  "categoria_sugerida": "general",
  "resumen": "Revisar la tarea y confirmar alcance, prioridad y responsable.",
  "confianza": 0.0
}
```

#### Test 4 — Salida estructurada válida

Mockear una respuesta válida y verificar que el endpoint conserva el schema.

No realizar llamadas reales a OpenAI durante Pytest.

---

## Paso 8 — Documento del agente

### Crear

```text
docs/agente.md
```

### Límite

Máximo dos páginas.

### Estructura exacta

```markdown
# Diseño del agente de revisión de tareas

## Objetivo

## Flujo

## Tools

## Política de parada

## Métrica principal

## Riesgo y mitigación
```

### Flujo recomendado

```text
Inicio del día
    ↓
Obtener tareas nuevas
    ↓
Validar información mínima
    ├── Información insuficiente → flag_for_review
    └── Información suficiente
            ↓
       get_user_workload
            ↓
       Evaluar complejidad
            ├── Compleja → suggest_subtasks
            └── Simple → continuar
            ↓
       suggest_assignee
            ↓
       Generar sugerencias
            ↓
       Revisión humana
            ↓
           Fin
```

### Tools obligatorias

| Tool                  | Propósito                                     | Parámetros                                  |
| --------------------- | ---------------------------------------------- | -------------------------------------------- |
| `get_user_workload` | Consultar carga activa de los usuarios         | `user_ids`, `statuses`                   |
| `suggest_assignee`  | Recomendar responsable por carga y experiencia | `task`, `candidate_users`, `workload`  |
| `suggest_subtasks`  | Dividir una tarea compleja                     | `title`, `description`, `max_subtasks` |
| `flag_for_review`   | Marcar falta de información                   | `task_id`, `reason`, `missing_fields`  |

### Política de parada

* máximo 4 invocaciones de tools por tarea;
* máximo 2 ciclos de razonamiento;
* presupuesto fijo de tokens;
* terminar inmediatamente cuando se llama `flag_for_review`;
* nunca ejecutar asignaciones ni crear subtareas sin aprobación humana.

### Métrica principal

```text
Tasa de aceptación de sugerencias
```

Cálculo:

```text
sugerencias aceptadas sin modificación
÷
total de sugerencias revisadas
```

Complementarla con porcentaje de sugerencias modificadas y tiempo ahorrado.

### Riesgo principal

Recomendaciones sesgadas por datos históricos de asignación.

Mitigación:

* revisión humana;
* uso de carga actual;
* explicación breve del criterio;
* auditoría periódica;
* exclusión de atributos personales no operativos.

---

## Paso 9 — README principal

### Modificar

```text
README.md
```

### Agregar una sección breve

```markdown
## IA aplicada
```

Debe contener:

* proveedor utilizado;
* endpoint;
* variable de entorno;
* comportamiento fallback;
* ubicación del prompt;
* referencia a `docs/agente.md`.

### Respuesta: protección contra prompt injection

Usa 3–5 líneas:

> El título y la descripción se tratan como datos no confiables y nunca como instrucciones del sistema. El prompt delimita ambos campos y prohíbe obedecer instrucciones contenidas en ellos. El modelo no tiene acceso a tools, archivos, secretos ni operaciones de escritura. La entrada tiene límites de longitud y la salida se valida contra un schema Pydantic cerrado.

### Respuesta: control de costo para 10.000 llamadas diarias

Usa 3–5 líneas:

> Aplicaría rate limiting por usuario, caché por hash de título y descripción, un modelo de bajo costo y límites estrictos de tokens. Las llamadas repetidas reutilizarían resultados y las solicitudes se agruparían cuando fuera posible. También establecería presupuestos diarios, métricas por consumidor y circuit breaker cuando se alcance el umbral operativo.

### Alcance no implementado

Indicar expresamente:

* no se persisten sugerencias;
* no se creó UI para IA;
* el agente es diseño, no implementación;
* las decisiones siguen requiriendo aprobación humana.

---

# No modificar durante el Día 10

No intervengas:

```text
backend/app/modules/tasks/
backend/app/modules/users/
backend/migrations/
frontend/src/
sql/
```

La evaluación no exige UI para el Punto 4. Introducir cambios frontend en los 30 minutos disponibles aumentaría el riesgo sin mejorar el cumplimiento central.

---

# Distribución realista de los 30 minutos

|     Tiempo | Actividad                            |
| ---------: | ------------------------------------ |
|   0–3 min | Corregir merge, tag y rama           |
|   3–6 min | Configuración, dependencia y prompt |
|  6–12 min | Schemas y servicio                   |
| 12–16 min | Router y registro                    |
| 16–20 min | Tests                                |
| 20–24 min | `docs/agente.md`                   |
| 24–27 min | README                               |
| 27–30 min | Validación, commit y push           |

---

# Validación técnica

## Reconstruir backend

Como se agrega una dependencia Python:

```powershell
docker compose build backend
```

```powershell
docker compose up -d
```

## Aplicar migraciones

No hay migraciones nuevas, pero confirma el estado:

```powershell
docker compose exec backend alembic current
```

```powershell
docker compose exec backend alembic heads
```

## Logs

```powershell
docker compose logs backend --tail=100
```

Debe aparecer:

```text
Application startup complete
```

## Pytest

```powershell
docker compose exec backend pytest
```

## Health

```powershell
Invoke-RestMethod http://localhost:8000/health
```

```powershell
Invoke-RestMethod http://localhost:8000/health/database
```

## Confirmar endpoint en OpenAPI

```powershell
Invoke-WebRequest http://localhost:8000/openapi.json -OutFile openapi.json
```

```powershell
Select-String -Path .\openapi.json -Pattern "/api/ai/enrich-task"
```

## Probar sin autenticación

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/ai/enrich-task -ContentType "application/json" -Body '{"title":"Corregir error de inventario","description":"El saldo no coincide con los movimientos"}'
```

Debe responder:

```text
401 Unauthorized
```

La prueba autenticada debe realizarse con el token que ya obtienes desde `/api/auth/login`.

---

# Archivos del Día 10

## Crear

```text
backend/app/modules/ai/__init__.py
backend/app/modules/ai/ai_routes.py
backend/app/modules/ai/schemas/__init__.py
backend/app/modules/ai/schemas/ai_schemas.py
backend/app/modules/ai/services/__init__.py
backend/app/modules/ai/services/ai_service.py
backend/app/modules/ai/prompts/enrich_task_system.txt
backend/tests/test_ai_enrichment.py
docs/agente.md
GODS_PLANS_DAY_10.md
```

## Modificar

```text
backend/app/core/config.py
backend/requirements.txt
.env.example
backend/app/main.py
README.md
```

## Eliminar

```text
Ningún archivo.
```

---

# Cierre Git del Día 10

## Verificación

```powershell
git status
```

```powershell
git diff --check
```

## Commit

```powershell
git add .
```

```powershell
git status
```

```powershell
git commit -m "feat(ai): add structured task enrichment and agent design"
```

## Push

```powershell
git push origin feature/day-10-openai-agent-foundation
```

## Pull Request

Origen:

```text
feature/day-10-openai-agent-foundation
```

Destino:

```text
development
```

Título:

```text
feature/day-10 feat(ai): add structured task enrichment and agent design
```

## Después del merge

```powershell
git checkout development
```

```powershell
git pull origin development
```

```powershell
git tag -a v0.10.0-ai-enrichment-foundation -m "Structured task enrichment and AI agent design"
```

```powershell
git push origin v0.10.0-ai-enrichment-foundation
```

## Integración final hacia `main`

Como esta es la última funcionalidad de la prueba:

```text
development
↓
main
```

Debe hacerse mediante un Pull Request final, no mediante merge local ni push directo. Después del merge, valida que `main`, el release y el README representen exactamente el estado entregado.
