from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.auth_dependencies import get_current_user
from app.modules.auth.schemas.auth_schemas import LoginRequest, TokenResponse
from app.modules.auth.services.auth_service import login
from app.modules.users.schemas.user_schemas import UserResponse
from app.modules.users.user_model import User


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login_endpoint(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    return login(
        db=db,
        email=payload.email,
        password=payload.password,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def current_user_endpoint(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    return UserResponse.model_validate(current_user)