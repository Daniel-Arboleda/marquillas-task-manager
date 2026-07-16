"""Initial schema

Revision ID: 001_initial_schema
Revises:
Create Date: 2026-07-16

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "001_initial_schema"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("SYSUTCDATETIME()")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("SYSUTCDATETIME()")),
        sa.CheckConstraint("role IN ('admin', 'member')", name="ck_users_role"),
    )
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default=sa.text("'pending'")),
        sa.Column("priority", sa.String(length=20), nullable=False, server_default=sa.text("'medium'")),
        sa.Column("assigned_user_id", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("SYSUTCDATETIME()")),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("SYSUTCDATETIME()")),
        sa.CheckConstraint("status IN ('pending','in_progress','completed','cancelled')", name="ck_tasks_status"),
        sa.CheckConstraint("priority IN ('low','medium','high','critical')", name="ck_tasks_priority"),
        sa.ForeignKeyConstraint(["assigned_user_id"], ["users.id"]),
    )
    op.create_table(
        "task_history",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("task_id", sa.Integer(), nullable=False),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("performed_by", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("SYSUTCDATETIME()")),
        sa.ForeignKeyConstraint(["task_id"], ["tasks.id"]),
        sa.ForeignKeyConstraint(["performed_by"], ["users.id"]),
    )


def downgrade() -> None:
    op.drop_table("task_history")
    op.drop_table("tasks")
    op.drop_table("users")