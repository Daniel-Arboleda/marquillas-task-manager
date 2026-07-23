from sqlalchemy.orm import Session

from app.modules.tasks.repositories.task_repository import TaskRepository
from app.modules.tasks.schemas.task_schemas import TaskCreate, TaskStatus, TaskUpdate
from app.modules.tasks.services.task_validation_service import TaskValidationService
from app.modules.tasks.task_history_model import TaskHistory
from app.modules.tasks.task_model import Task


class TaskCommandService:
    def __init__(
        self,
        db: Session,
        repository: TaskRepository,
        validation: TaskValidationService,
    ) -> None:
        self.db = db
        self.repository = repository
        self.validation = validation

    def create(
        self,
        payload: TaskCreate,
        current_user_id: int,
        is_admin: bool,
    ) -> Task:
        self.validation.validate_due_date(payload.due_date)
        self.validation.validate_assigned_user(payload.assigned_user_id)
        self.validation.validate_assignment_permission(
            assigned_user_id=payload.assigned_user_id,
            current_user_id=current_user_id,
            is_admin=is_admin,
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

    def update(
        self,
        task: Task,
        payload: TaskUpdate,
        current_user_id: int,
        is_admin: bool,
    ) -> Task:
        self.validation.validate_task_access(
            task=task,
            current_user_id=current_user_id,
            is_admin=is_admin,
        )
        changes = {
            field: value
            for field, value in payload.model_dump(exclude_unset=True).items()
            if getattr(task, field) != value
        }
        if not changes:
            return task
        if "status" in changes:
            self.validation.validate_status_transition(
                current_status=task.status,
                requested_status=payload.status,
            )
        if "due_date" in changes:
            self.validation.validate_due_date(payload.due_date)
        if "assigned_user_id" in changes:
            self.validation.validate_reassignment_permission(
                assigned_user_id=payload.assigned_user_id,
                current_assigned_user_id=task.assigned_user_id,
                is_admin=is_admin,
            )
            self.validation.validate_assigned_user(payload.assigned_user_id)
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

    def update_status(
        self,
        task: Task,
        status: TaskStatus,
        current_user_id: int,
        is_admin: bool,
    ) -> Task:
        self.validation.validate_task_access(
            task=task,
            current_user_id=current_user_id,
            is_admin=is_admin,
        )
        self.validation.validate_status_transition(
            current_status=task.status,
            requested_status=status,
        )
        if task.status == status:
            return task
        task.status = status
        try:
            self.repository.update(task)
            self._register_history(task.id, "status_updated", current_user_id)
            self.db.commit()
            self.db.refresh(task)
            return task
        except Exception:
            self.db.rollback()
            raise

    def delete(
        self,
        task: Task,
        current_user_id: int,
        is_admin: bool,
    ) -> None:
        self.validation.validate_task_access(
            task=task,
            current_user_id=current_user_id,
            is_admin=is_admin,
        )
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

    def _register_history(
        self,
        task_id: int,
        action: str,
        user_id: int,
    ) -> None:
        self.repository.history(
            TaskHistory(
                task_id=task_id,
                action=action,
                performed_by=user_id,
            )
        )