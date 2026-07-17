from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.users.user_model import User


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.execute(
        select(User).where(User.email == email.strip().lower()),
    ).scalar_one_or_none()


def create_user(db: Session, user: User) -> User:
    db.add(user)
    db.flush()
    return user