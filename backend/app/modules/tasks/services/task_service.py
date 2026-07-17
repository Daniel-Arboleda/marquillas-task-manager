from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.tasks.repositories.task_repository import TaskRepository
from app.modules.tasks.schemas.task_schemas import TaskCreate, TaskUpdate
from app.modules.tasks.task_history_model import TaskHistory
from app.modules.tasks.task_model import Task
from app.modules.users.repositories.user_repository import get_user_by_id


class TaskService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = TaskRepository(db)

    def create(self, payload: TaskCreate, current_user_id: int, is_admin: bool) -> Task:
        self._validate_due_date(payload.due_date)
        self._validate_assigned_user(payload.assigned_user_id)
        if not is_admin and payload.assigned_user_id not in (None, current_user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can assign tasks to another user",
            )
        task = Task(
            title=payload.title,
            description=payload.description,
            priority=payload.priority,
            assigned_user_id=payload.assigned_user_id,
            due_date=payload.due_date,
            created_by=current_user_id,
        )
        try:
            self.repository.create(task)
            self._register_history(task.id, "created", current_user_id)
            self.db.commit()
            self.db.refresh(task)
            return task
        except Exception:
            self.db.rollback()
            raise

    def get(self, task_id: int) -> Task:
        task = self.repository.get(task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )
        return task

    def list(self, current_user_id: int, is_admin: bool) -> list[Task]:
        if is_admin:
            return self.repository.list_tasks()
        return self.repository.list_by_user(current_user_id)

    def update(
        self,
        task_id: int,
        payload: TaskUpdate,
        current_user_id: int,
        is_admin: bool,
    ) -> Task:
        task = self.get(task_id)
        self._validate_task_access(task, current_user_id, is_admin)
        changes = payload.model_dump(exclude_unset=True)
        if "due_date" in changes:
            self._validate_due_date(payload.due_date)
        if "assigned_user_id" in changes:
            if not is_admin and payload.assigned_user_id != task.assigned_user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only administrators can reassign tasks",
                )
            self._validate_assigned_user(payload.assigned_user_id)
        for field, value in changes.items():
            setattr(task, field, value)
        try:
            self.repository.update(task)
            self._register_history(task.id, "updated", current_user_id)
            self.db.commit()
            self.db.refresh(task)
            return task
        except Exception:
            self.db.rollback()
            raise

    def delete(self, task_id: int, current_user_id: int, is_admin: bool) -> None:
        task = self.get(task_id)
        self._validate_task_access(task, current_user_id, is_admin)
        if task.status == "cancelled":
            return
        task.status = "cancelled"
        try:
            self.repository.update(task)
            self._register_history(task.id, "deleted", current_user_id)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise

    def _register_history(self, task_id: int, action: str, user_id: int) -> None:
        self.repository.history(
            TaskHistory(
                task_id=task_id,
                action=action,
                performed_by=user_id,
            )
        )

    def _validate_task_access(
        self,
        task: Task,
        current_user_id: int,
        is_admin: bool,
    ) -> None:
        if is_admin:
            return
        if task.created_by != current_user_id and task.assigned_user_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

    def _validate_due_date(self, due_date: datetime | None) -> None:
        if due_date is None:
            return
        current_time = datetime.now(UTC) if due_date.tzinfo else datetime.now()
        if due_date <= current_time:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Due date must be in the future",
            )

    def _validate_assigned_user(self, user_id: int | None) -> None:
        if user_id is None:
            return
        user = get_user_by_id(self.db, user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned user not found",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Assigned user is inactive",
            )