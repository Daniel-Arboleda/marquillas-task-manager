from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.auth_dependencies import get_current_user
from app.modules.tasks.schemas.task_schemas import TaskCreate, TaskResponse, TaskUpdate
from app.modules.tasks.services.task_service import TaskService
from app.modules.users.user_model import User

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskResponse:
    service = TaskService(db)
    return service.create(
        payload=payload,
        current_user_id=current_user.id,
        is_admin=current_user.role == "admin",
    )


@router.get("", response_model=list[TaskResponse])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[TaskResponse]:
    service = TaskService(db)
    return service.list(
        current_user_id=current_user.id,
        is_admin=current_user.role == "admin",
    )


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskResponse:
    service = TaskService(db)
    return service.get(task_id)


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskResponse:
    service = TaskService(db)
    return service.update(
        task_id=task_id,
        payload=payload,
        current_user_id=current_user.id,
        is_admin=current_user.role == "admin",
    )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    service = TaskService(db)
    service.delete(
        task_id=task_id,
        current_user_id=current_user.id,
        is_admin=current_user.role == "admin",
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)