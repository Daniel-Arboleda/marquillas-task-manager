from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.users.user_model import User


class UserQueryRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list_active_users(self) -> list[User]:
        return list(
            self.db.scalars(
                select(User)
                .where(User.is_active == True)
                .order_by(User.name.asc(), User.id.asc())
            ).all()
        )