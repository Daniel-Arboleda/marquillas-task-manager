from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.modules.tasks.task_history_model import TaskHistory
from app.modules.tasks.task_model import Task
from app.modules.users.user_model import User


SEED_PASSWORD = "12345678"
SEED_USERS = (
    ("Administrator", "admin@test.com", "admin"),
    ("Daniel", "daniel@test.com", "member"),
    ("Maria", "maria@test.com", "member"),
    ("Carlos", "carlos@test.com", "member"),
    ("Laura", "laura@test.com", "member"),
)
SEED_TASKS = (
    ("Configurar entorno de desarrollo", "Preparar las variables de entorno y validar la conexión con SQL Server.", "completed", "high", "daniel@test.com", 2),
    ("Revisar documentación técnica", "Validar que el README incluya instalación, arquitectura y decisiones de diseño.", "in_progress", "medium", "maria@test.com", 3),
    ("Implementar filtros de tareas", "Verificar los filtros por estado, prioridad y usuario asignado.", "completed", "high", "carlos@test.com", 4),
    ("Diseñar formulario de tareas", "Ajustar el formulario responsive para creación y edición.", "in_progress", "medium", "laura@test.com", 5),
    ("Crear pruebas de autenticación", "Agregar pruebas para credenciales inválidas y rutas protegidas.", "pending", "high", "daniel@test.com", 6),
    ("Optimizar consulta paginada", "Revisar el rendimiento del listado de tareas con filtros combinados.", "pending", "medium", "maria@test.com", 7),
    ("Validar permisos administrativos", "Confirmar que solo los administradores puedan crear usuarios.", "completed", "critical", "carlos@test.com", 8),
    ("Corregir estados de interfaz", "Validar estados de carga, error y resultados vacíos.", "in_progress", "high", "laura@test.com", 9),
    ("Preparar consultas T-SQL", "Crear las consultas de reportes y ranking requeridas por la prueba.", "pending", "critical", "daniel@test.com", 10),
    ("Crear procedimiento de reasignación", "Implementar el procedimiento almacenado transaccional para reasignar tareas.", "pending", "critical", "maria@test.com", 11),
    ("Documentar modelo de datos", "Mantener actualizado el diagrama entidad-relación y las restricciones.", "completed", "medium", "carlos@test.com", 12),
    ("Revisar diseño responsive", "Probar las vistas principales en resoluciones móviles y de escritorio.", "cancelled", "low", "laura@test.com", 13),
    ("Implementar enriquecimiento con IA", "Crear el endpoint de sugerencias estructuradas para tareas nuevas.", "pending", "high", "daniel@test.com", 14),
    ("Versionar system prompt", "Guardar el prompt del modelo en un archivo independiente.", "pending", "medium", "maria@test.com", 15),
    ("Manejar errores del proveedor LLM", "Agregar timeout, fallback y control de respuestas inválidas.", "in_progress", "critical", "carlos@test.com", 16),
    ("Documentar agente de IA", "Crear el documento de diseño del agente con tools y política de parada.", "pending", "medium", "laura@test.com", 17),
    ("Revisar archivo env de ejemplo", "Confirmar que todas las variables requeridas estén documentadas.", "completed", "low", None, 18),
    ("Preparar demostración funcional", "Definir el flujo principal que se presentará durante la evaluación.", "pending", "high", None, 19),
    ("Validar migraciones Alembic", "Ejecutar las migraciones desde una base de datos limpia.", "in_progress", "medium", "daniel@test.com", 20),
    ("Realizar revisión final del repositorio", "Verificar estructura, commits, pull requests y documentación de entrega.", "pending", "critical", None, 21),
)


def get_or_create_users(db) -> tuple[dict[str, User], int]:
    users_by_email: dict[str, User] = {}
    created_count = 0
    for name, email, role in SEED_USERS:
        user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
        if user is None:
            user = User(
                name=name,
                email=email,
                password_hash=hash_password(SEED_PASSWORD),
                role=role,
                is_active=True,
            )
            db.add(user)
            db.flush()
            created_count += 1
        users_by_email[email] = user
    return users_by_email, created_count


def create_task_history(db, task: Task, performed_by: int) -> int:
    actions = ["Task created"]
    if task.assigned_user_id is not None:
        actions.append("Task assigned")
    if task.status != "pending":
        actions.append(f"Status changed to {task.status}")
    if task.status == "completed":
        actions.append("Task completed")
    db.add_all(
        TaskHistory(
            task_id=task.id,
            action=action,
            performed_by=performed_by,
        )
        for action in actions
    )
    return len(actions)


def create_tasks(db, users_by_email: dict[str, User]) -> tuple[int, int]:
    existing_titles = set(
        db.execute(
            select(Task.title).where(Task.title.in_([task[0] for task in SEED_TASKS])),
        ).scalars()
    )
    admin_id = users_by_email["admin@test.com"].id
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)
    task_count = 0
    history_count = 0
    for title, description, status, priority, assigned_email, days_until_due in SEED_TASKS:
        if title in existing_titles:
            continue
        assigned_user = users_by_email.get(assigned_email) if assigned_email else None
        task = Task(
            title=title,
            description=description,
            status=status,
            priority=priority,
            assigned_user_id=assigned_user.id if assigned_user else None,
            due_date=current_time + timedelta(days=days_until_due),
            created_by=admin_id,
        )
        db.add(task)
        db.flush()
        history_count += create_task_history(db, task, admin_id)
        task_count += 1
    return task_count, history_count


def main() -> None:
    db = SessionLocal()
    try:
        users_by_email, user_count = get_or_create_users(db)
        task_count, history_count = create_tasks(db, users_by_email)
        db.commit()
        if user_count == 0 and task_count == 0:
            print("Demo database seed already exists. No changes were made.")
            return
        print("Demo database seeded successfully.")
        print(f"Users created: {user_count}")
        print(f"Tasks created: {task_count}")
        print(f"History records created: {history_count}")
        print(f"Default password: {SEED_PASSWORD}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()