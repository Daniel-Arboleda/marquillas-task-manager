from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.auth_dependencies import get_current_user, require_admin
from app.modules.users.repositories.user_query_repository import UserQueryRepository
from app.modules.users.schemas.user_schemas import UserCreate, UserListResponse, UserResponse
from app.modules.users.services.user_query_service import UserQueryService
from app.modules.users.services.user_service import create_user_service
from app.modules.users.user_model import User


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


@router.get(
    "",
    response_model=UserListResponse,
)
def list_users_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserListResponse:
    service = UserQueryService(
        UserQueryRepository(db),
    )
    return UserListResponse(
        items=service.list_assignable_users(current_user),
    )


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user_endpoint(
    payload: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> UserResponse:
    return create_user_service(
        db=db,
        payload=payload,
    )