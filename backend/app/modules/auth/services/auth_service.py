from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.modules.auth.schemas.auth_schemas import TokenResponse
from app.modules.users.repositories.user_repository import get_user_by_email
from app.modules.users.user_model import User


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User:
    user = get_user_by_email(
        db=db,
        email=email.strip().lower(),
    )
    if (
        user is None
        or not user.is_active
        or not verify_password(password, user.password_hash)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def login(
    db: Session,
    email: str,
    password: str,
) -> TokenResponse:
    user = authenticate_user(
        db=db,
        email=email,
        password=password,
    )
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
    )