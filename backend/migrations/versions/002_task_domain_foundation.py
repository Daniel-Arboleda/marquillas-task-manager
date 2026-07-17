"""Complete task domain foundation

Revision ID: 002_task_domain_foundation
Revises: 001_initial_schema
Create Date: 2026-07-17

"""
from typing import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "002_task_domain_foundation"
down_revision: str | None = "001_initial_schema"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("tasks", sa.Column("due_date", sa.DateTime(), nullable=True))
    op.add_column("tasks", sa.Column("created_by", sa.Integer(), nullable=True))
    op.create_foreign_key("fk_tasks_created_by_users", "tasks", "users", ["created_by"], ["id"])
    op.create_index("ix_tasks_status", "tasks", ["status"])
    op.create_index("ix_tasks_priority", "tasks", ["priority"])
    op.create_index("ix_tasks_assigned_user_id", "tasks", ["assigned_user_id"])
    op.create_index("ix_tasks_due_date", "tasks", ["due_date"])
    op.create_index("ix_task_history_task_id", "task_history", ["task_id"])
    op.create_index("ix_task_history_performed_by", "task_history", ["performed_by"])


def downgrade() -> None:
    op.drop_index("ix_task_history_performed_by", table_name="task_history")
    op.drop_index("ix_task_history_task_id", table_name="task_history")
    op.drop_index("ix_tasks_due_date", table_name="tasks")
    op.drop_index("ix_tasks_assigned_user_id", table_name="tasks")
    op.drop_index("ix_tasks_priority", table_name="tasks")
    op.drop_index("ix_tasks_status", table_name="tasks")
    op.drop_constraint("fk_tasks_created_by_users", "tasks", type_="foreignkey")
    op.drop_column("tasks", "created_by")
    op.drop_column("tasks", "due_date")