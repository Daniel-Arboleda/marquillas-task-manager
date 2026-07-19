from math import ceil

from fastapi import HTTPException, status

from app.modules.tasks.repositories.task_repository import TaskRepository
from app.modules.tasks.schemas.task_schemas import TaskListResponse
from app.modules.tasks.task_model import Task


class TaskQueryService:
    def __init__(self, repository: TaskRepository) -> None:
        self.repository = repository

    def get(self, task_id: int) -> Task:
        task = self.repository.get(task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found",
            )
        return task

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
            items=tasks,
            page=page,
            page_size=page_size,
            total=total,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1,
        )