# Comandos de inicialización y datos de demostración

## 1. Detener los contenedores

```powershell
docker compose down
```

**Validar**

- Contenedores detenidos.
- Red eliminada correctamente.

---

## 2. Reconstruir el contenedor Backend

```powershell
docker compose build backend --no-cache
```

**Validar**

- Imagen del backend construida sin errores.

---

## 3. Levantar todos los servicios

```powershell
docker compose up -d
```

**Validar**

- SQL Server iniciado.
- Backend iniciado.
- Frontend iniciado.

---

## 4. Verificar el estado de los contenedores

```powershell
docker compose ps
```

**Validar**

- `marquillas_backend` → **Up**
- `marquillas_sqlserver` → **Up**
- `marquillas_frontend` → **Up**

---

## 5. Ejecutar las migraciones

```powershell
docker compose exec backend alembic upgrade head
```

**Validar**

- Migraciones ejecutadas correctamente.
- Base de datos actualizada a la última versión.

---

## 6. Crear el administrador inicial

```powershell
docker compose exec backend python -m app.commands.create_initial_admin
```

**Validar**

- Se crea el usuario administrador si no existe.
- Si ya existe, el comando finaliza sin duplicar información.

**Credenciales**

| Usuario        | Contraseña |
| -------------- | ----------- |
| admin@test.com | 12345678    |

---

## 7. Poblar la base de datos con datos de demostración

```powershell
docker compose exec backend python -m app.commands.seed_database
```

**Validar**

- Usuarios de demostración creados.
- Tareas de demostración creadas.
- Historial de tareas creado.
- Si la información ya existe, el proceso finaliza sin duplicar registros.

**Usuarios generados**

| Rol    | Correo          |
| ------ | --------------- |
| Admin  | admin@test.com  |
| Member | daniel@test.com |
| Member | maria@test.com  |
| Member | carlos@test.com |
| Member | laura@test.com  |

**Contraseña para todos los usuarios**

```text
12345678
```

---

## Flujo recomendado de ejecución

```text
docker compose down
        │
        ▼
docker compose build backend --no-cache
        │
        ▼
docker compose up -d
        │
        ▼
docker compose ps
        │
        ▼
docker compose exec backend alembic upgrade head
        │
        ▼
docker compose exec backend python -m app.commands.create_initial_admin
        │
        ▼
docker compose exec backend python -m app.commands.seed_database
```

---

## Resultado esperado

Al finalizar el proceso la aplicación dispone de:

- Base de datos actualizada.
- Usuario administrador inicial.
- Cinco usuarios de demostración.
- Veinte tareas de prueba.
- Historial inicial de eventos.
- Datos listos para evaluación funcional y pruebas manuales.
