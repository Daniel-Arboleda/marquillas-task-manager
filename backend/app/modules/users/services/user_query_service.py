from fastapi import HTTPException, status

from app.modules.users.repositories.user_query_repository import UserQueryRepository
from app.modules.users.schemas.user_schemas import UserResponse


class UserQueryService:
    def __init__(self, repository: UserQueryRepository) -> None:
        self.repository = repository

    def list_assignable_users(
        self,
        current_user,
    ) -> list[UserResponse]:
        if not current_user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user.",
            )
        if current_user.role != "admin":
            return [UserResponse.model_validate(current_user)]
        return [
            UserResponse.model_validate(user)
            for user in self.repository.list_active_users()
        ]