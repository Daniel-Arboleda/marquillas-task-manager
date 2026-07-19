from sqlalchemy.orm import Session

from app.modules.tasks.repositories.task_repository import TaskRepository
from app.modules.tasks.schemas.task_schemas import TaskCreate, TaskHistoryListResponse, TaskListResponse, TaskUpdate
from app.modules.tasks.services.task_command_service import TaskCommandService
from app.modules.tasks.services.task_query_service import TaskQueryService
from app.modules.tasks.services.task_validation_service import TaskValidationService
from app.modules.tasks.task_model import Task


class TaskService:
    def __init__(self, db: Session) -> None:
        repository = TaskRepository(db)
        validation = TaskValidationService(db)
        self.query = TaskQueryService(repository)
        self.command = TaskCommandService(
            db=db,
            repository=repository,
            validation=validation,
        )
        self.validation = validation

    def create(self, payload: TaskCreate, current_user_id: int, is_admin: bool) -> Task:
        return self.command.create(payload, current_user_id, is_admin)

    def get(
        self,
        task_id: int,
        current_user_id: int,
        is_admin: bool,
    ) -> Task:
        task = self.query.get(task_id)
        self.validation.validate_task_access(
            task=task,
            current_user_id=current_user_id,
            is_admin=is_admin,
        )
        return task

    def history(
        self,
        task_id: int,
        current_user_id: int,
        is_admin: bool,
    ) -> TaskHistoryListResponse:
        task = self.query.get(task_id)
        self.validation.validate_task_access(
            task=task,
            current_user_id=current_user_id,
            is_admin=is_admin,
        )
        return self.query.history(task_id)

    def list(
        self,
        current_user_id: int,
        is_admin: bool,
        status: str | None = None,
        priority: str | None = None,
        assigned_user_id: int | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> TaskListResponse:
        assigned_user_id, search = self.validation.validate_query(
            current_user_id=current_user_id,
            is_admin=is_admin,
            assigned_user_id=assigned_user_id,
            search=search,
            page=page,
            page_size=page_size,
        )
        return self.query.list(
            current_user_id=current_user_id,
            is_admin=is_admin,
            status=status,
            priority=priority,
            assigned_user_id=assigned_user_id,
            search=search,
            page=page,
            page_size=page_size,
        )

    def update(
        self,
        task_id: int,
        payload: TaskUpdate,
        current_user_id: int,
        is_admin: bool,
    ) -> Task:
        return self.command.update(
            task=self.query.get(task_id),
            payload=payload,
            current_user_id=current_user_id,
            is_admin=is_admin,
        )

    def delete(self, task_id: int, current_user_id: int, is_admin: bool) -> None:
        self.command.delete(
            task=self.query.get(task_id),
            current_user_id=current_user_id,
            is_admin=is_admin,
        )