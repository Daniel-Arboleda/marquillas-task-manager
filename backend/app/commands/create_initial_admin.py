from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.modules.users.user_model import User


ADMIN_NAME = "Administrator"
ADMIN_EMAIL = "admin@test.com"
ADMIN_PASSWORD = "12345678"
ADMIN_ROLE = "admin"


def main() -> None:
    db = SessionLocal()
    try:
        admin = db.execute(
            select(User).where(User.email == ADMIN_EMAIL),
        ).scalar_one_or_none()
        if admin is not None:
            print("Initial administrator already exists.")
            return
        admin = User(
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            role=ADMIN_ROLE,
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print("Initial administrator created successfully.")
        print(f"Email: {ADMIN_EMAIL}")
        print(f"Password: {ADMIN_PASSWORD}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()