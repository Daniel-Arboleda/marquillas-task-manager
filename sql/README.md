
# SQL - Consultas, Procedimientos y Validaciones

Este directorio contiene la solución SQL de la prueba técnica, incluyendo las consultas solicitadas, el procedimiento almacenado y los scripts de validación utilizados para comprobar el comportamiento esperado sobre la base de datos.

## Contenido

| Archivo                   | Descripción                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `consultas.sql`         | Contiene la Consulta 1, Consulta 2 y el procedimiento almacenado`sp_reasignar_tarea`. |
| `validar_consulta1.sql` | Valida el resultado de la Consulta 1.                                                   |
| `validar_consulta2.sql` | Valida el resultado de la Consulta 2.                                                   |
| `validar_consulta3.sql` | Valida la ejecución completa del procedimiento almacenado.                             |

---

# Ejecución

Todos los scripts fueron diseñados para ejecutarse desde PowerShell utilizando `sqlcmd` dentro del contenedor SQL Server.

## Ejecutar consultas.sql

```powershell
Get-Content -Raw .\sql\consultas.sql | docker compose exec -T sqlserver bash -lc '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d marquillas_tasks'
```

## Validar Consulta 1

```powershell
Get-Content -Raw .\sql\validar_consulta1.sql | docker compose exec -T sqlserver bash -lc '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d marquillas_tasks'
```

Resultado esperado:

```text
VALIDACION CONSULTA 1

PASS
```

---

## Validar Consulta 2

```powershell
Get-Content -Raw .\sql\validar_consulta2.sql | docker compose exec -T sqlserver bash -lc '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d marquillas_tasks'
```

Resultado esperado:

```text
VALIDACION CONSULTA 2

PASS
```

---

## Validar Consulta 3

```powershell
Get-Content -Raw .\sql\validar_consulta3.sql | docker compose exec -T sqlserver bash -lc '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d marquillas_tasks'
```

Resultado esperado:

```text
VALIDACION CONSULTA 3

PASS
```

---

# Verificación rápida del procedimiento almacenado

Durante la sustentación técnica resulta útil demostrar el funcionamiento del procedimiento almacenado sin ejecutar todo el script de validación. Para ello se utilizan tres comandos independientes.

## 1. Ejecutar el procedimiento

```powershell
echo "EXEC sp_reasignar_tarea @tarea_id=1,@nuevo_asignado=2,@admin_id=1;" | docker compose exec -T sqlserver bash -lc '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d marquillas_tasks'
```

Objetivo:

- Ejecutar la reasignación de una tarea.
- Validar permisos.
- Actualizar la tarea.
- Registrar el historial.

---

## 2. Verificar la actualización de la tarea

```powershell
echo "SELECT id,assigned_user_id FROM tasks WHERE id=1;" | docker compose exec -T sqlserver bash -lc '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d marquillas_tasks'
```

Objetivo:

Confirmar que el campo `assigned_user_id` fue actualizado correctamente.

---

## 3. Verificar el historial

```powershell
echo "SELECT TOP(5) task_id,action,performed_by,created_at FROM task_history ORDER BY created_at DESC;" | docker compose exec -T sqlserver bash -lc '/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -C -d marquillas_tasks'
```

Objetivo:

Comprobar que el procedimiento registró correctamente la auditoría de la operación.

Estos tres comandos permiten demostrar en pocos segundos que el procedimiento realiza correctamente las operaciones de actualización y trazabilidad.

---

# Diseño de la solución

La solución fue estructurada para separar claramente la lógica de negocio de la lógica de validación.

## consultas.sql

Agrupa exclusivamente los entregables solicitados:

- Consulta 1.
- Consulta 2.
- Procedimiento almacenado.

No contiene scripts de prueba ni validaciones.

---

## Scripts de validación

Cada consulta posee un archivo independiente de validación.

Esta separación permite:

- reutilizar las consultas sin modificar su implementación;
- validar automáticamente los resultados;
- facilitar la revisión durante la sustentación;
- ejecutar pruebas repetibles sobre la misma base de datos.

---

## Consulta 1

La validación comprueba:

- total de registros;
- resultado de la consulta;
- suma de porcentajes.

El criterio de aprobación es:

```text
PASS
```

cuando el porcentaje total corresponde al conjunto completo de tareas.

---

## Consulta 2

La validación comprueba:

- total de usuarios;
- tareas asignadas;
- tareas completadas;
- consistencia del ranking.

El criterio de aprobación es:

```text
PASS
```

cuando el ranking generado coincide con los datos existentes.

---

## Consulta 3

La validación fue diseñada para comprobar el flujo completo del procedimiento almacenado.

Incluye cuatro etapas:

1. Estado inicial.
2. Ejecución del procedimiento.
3. Estado posterior.
4. Validación automática.

La validación verifica:

- existencia de un administrador válido;
- existencia de la tarea;
- actualización de la asignación;
- registro del historial.

El resultado esperado es:

```text
PASS
```

cuando todas las comprobaciones son satisfactorias.

---

# Criterios de diseño

Durante la implementación se priorizaron los siguientes principios:

- separación entre implementación y validación;
- scripts idempotentes;
- validaciones reproducibles;
- ejecución mediante `sqlcmd`;
- compatibilidad con Docker Compose;
- consultas de verificación simples y legibles;
- validaciones automáticas mediante indicadores `PASS` y `FAIL`;
- trazabilidad de la operación mediante `task_history`.

Esta organización permite revisar cada entregable de forma independiente, simplifica la depuración y facilita la demostración funcional durante la sustentación de la prueba técnica.
