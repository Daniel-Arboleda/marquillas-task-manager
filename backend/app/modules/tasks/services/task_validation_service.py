from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.tasks.task_model import Task
from app.modules.users.repositories.user_repository import get_user_by_id


class TaskValidationService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def validate_due_date(self, due_date: datetime | None) -> None:
        if due_date is None:
            return
        current_time = datetime.now(UTC) if due_date.tzinfo else datetime.now()
        if due_date <= current_time:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Due date must be in the future",
            )

    def validate_assigned_user(self, user_id: int | None) -> None:
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

    def validate_task_access(
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

    def validate_assignment_permission(
        self,
        assigned_user_id: int | None,
        current_user_id: int,
        is_admin: bool,
    ) -> None:
        if is_admin:
            return
        if assigned_user_id not in (None, current_user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can assign tasks to another user",
            )

    def validate_reassignment_permission(
        self,
        assigned_user_id: int | None,
        current_assigned_user_id: int | None,
        is_admin: bool,
    ) -> None:
        if is_admin:
            return
        if assigned_user_id != current_assigned_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can reassign tasks",
            )

    def validate_status_transition(
        self,
        current_status: str,
        requested_status: str | None,
    ) -> None:
        if requested_status is None or requested_status == current_status:
            return
        allowed_transitions = {
            "pending": {"in_progress", "completed", "cancelled"},
            "in_progress": {"pending", "completed", "cancelled"},
            "completed": {"in_progress"},
            "cancelled": set(),
        }
        if requested_status not in allowed_transitions.get(current_status, set()):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid task status transition",
            )

    def validate_query(
        self,
        current_user_id: int,
        is_admin: bool,
        assigned_user_id: int | None,
        search: str | None,
        page: int,
        page_size: int,
    ) -> tuple[int | None, str | None]:
        if page < 1:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Page must be greater than zero",
            )
        if page_size < 1 or page_size > 100:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Page size must be between 1 and 100",
            )
        if not is_admin and assigned_user_id is not None and assigned_user_id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        if search is not None:
            search = search.strip() or None
        return assigned_user_id, search