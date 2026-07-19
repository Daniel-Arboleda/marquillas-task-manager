import os
from collections.abc import Generator
from datetime import UTC, datetime, timedelta
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

os.environ.setdefault("DATABASE_PASSWORD", "TestPassword123!")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-that-is-not-used-in-production")

from app.core.database import get_db
from app.core.security import create_access_token, hash_password
from app.main import app
from app.models.base import Base
from app.modules.tasks.task_history_model import TaskHistory
from app.modules.tasks.task_model import Task
from app.modules.users.user_model import User


@pytest.fixture
def test_engine() -> Generator[Engine, None, None]:
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )

    @event.listens_for(engine, "connect")
    def configure_sqlite(dbapi_connection: Any, _: Any) -> None:
        dbapi_connection.create_function(
            "sysutcdatetime",
            0,
            lambda: datetime.now(UTC).replace(tzinfo=None).isoformat(" "),
        )
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    try:
        yield engine
    finally:
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def test_session_factory(
    test_engine: Engine,
) -> sessionmaker[Session]:
    return sessionmaker(
        bind=test_engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
        future=True,
    )


@pytest.fixture
def db_session(
    test_session_factory: sessionmaker[Session],
) -> Generator[Session, None, None]:
    session = test_session_factory()
    try:
        yield session
    finally:
        session.rollback()
        session.close()


@pytest.fixture
def client(
    test_session_factory: sessionmaker[Session],
) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        session = test_session_factory()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def create_test_user(
    db_session: Session,
    name: str,
    email: str,
    role: str,
) -> User:
    user = User(
        name=name,
        email=email,
        password_hash=hash_password("Password123!"),
        role=role,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def admin_user(db_session: Session) -> User:
    return create_test_user(
        db_session=db_session,
        name="Test Admin",
        email="admin@example.com",
        role="admin",
    )


@pytest.fixture
def member_user(db_session: Session) -> User:
    return create_test_user(
        db_session=db_session,
        name="Test Member",
        email="member@example.com",
        role="member",
    )


@pytest.fixture
def other_member_user(db_session: Session) -> User:
    return create_test_user(
        db_session=db_session,
        name="Other Member",
        email="other.member@example.com",
        role="member",
    )


@pytest.fixture
def admin_token(admin_user: User) -> str:
    return create_access_token(str(admin_user.id))


@pytest.fixture
def member_token(member_user: User) -> str:
    return create_access_token(str(member_user.id))


@pytest.fixture
def other_member_token(other_member_user: User) -> str:
    return create_access_token(str(other_member_user.id))


@pytest.fixture
def auth_headers():
    def build(token: str) -> dict[str, str]:
        return {"Authorization": f"Bearer {token}"}

    return build


@pytest.fixture
def task_factory(db_session: Session):
    def create(
        *,
        title: str,
        created_by: int,
        assigned_user_id: int | None = None,
        status: str = "pending",
        priority: str = "medium",
        description: str | None = None,
        due_date: datetime | None = None,
    ) -> Task:
        task = Task(
            title=title,
            description=description,
            status=status,
            priority=priority,
            assigned_user_id=assigned_user_id,
            due_date=due_date or datetime.now(UTC).replace(tzinfo=None) + timedelta(days=1),
            created_by=created_by,
        )
        db_session.add(task)
        db_session.commit()
        db_session.refresh(task)
        return task

    return create