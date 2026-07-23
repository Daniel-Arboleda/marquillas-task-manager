from datetime import datetime
from math import ceil

from fastapi import HTTPException, status

from app.modules.tasks.repositories.task_repository import TaskRepository
from app.modules.tasks.schemas.task_schemas import TaskHistoryListResponse, TaskHistoryResponse, TaskListResponse, TaskResponse, TaskSummaryResponse
from app.modules.tasks.task_model import Task


class TaskQueryService:
    def __init__(self, repository: TaskRepository) -> None:
        self.repository = repository

    def get_entity(self, task_id: int) -> Task:
        task = self.repository.get(task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )
        return task

    def get(self, task_id: int) -> TaskResponse:
        return self._to_response(self.get_entity(task_id))

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
        tasks, total = self.repository.list(
            user_id=None if is_admin else current_user_id,
            status=status,
            priority=priority,
            assigned_user_id=assigned_user_id,
            search=search,
            page=page,
            page_size=page_size,
        )
        total_pages = max(1, ceil(total / page_size)) if page_size else 1
        return TaskListResponse(
            items=[self._to_response(task) for task in tasks],
            page=page,
            page_size=page_size,
            total=total,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1,
        )

    def get_task_summary(
        self,
        current_user_id: int,
        is_admin: bool,
        assigned_user_id: int | None = None,
        search: str | None = None,
    ) -> TaskSummaryResponse:
        return TaskSummaryResponse.model_validate(
            self.repository.get_summary(
                user_id=None if is_admin else current_user_id,
                assigned_user_id=assigned_user_id,
                search=search,
            )
        )

    def history(self, task_id: int) -> TaskHistoryListResponse:
        self.get_entity(task_id)
        return TaskHistoryListResponse(
            items=[
                TaskHistoryResponse.model_validate(history)
                for history in self.repository.list_history(task_id)
            ],
        )

    def _get_due_status(self, task: Task) -> tuple[bool, int]:
        if (
            task.due_date is None
            or task.status in {"completed", "cancelled"}
        ):
            return False, 0
        now = datetime.now(task.due_date.tzinfo) if task.due_date.tzinfo else datetime.now()
        overdue_days = (now.date() - task.due_date.date()).days
        if overdue_days <= 0:
            return False, 0
        return True, overdue_days

    def _to_response(self, task: Task) -> TaskResponse:
        assigned_user = task.assigned_user
        is_overdue, days_overdue = self._get_due_status(task)
        return TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            assigned_user_id=task.assigned_user_id,
            assigned_user_name=assigned_user.name if assigned_user else None,
            assigned_user_email=assigned_user.email if assigned_user else None,
            due_date=task.due_date,
            is_overdue=is_overdue,
            days_overdue=days_overdue,
            created_by=task.created_by,
            created_at=task.created_at,
            updated_at=task.updated_at,
        )