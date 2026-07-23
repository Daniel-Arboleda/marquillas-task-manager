from typing import List

from sqlalchemy import case, func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.modules.tasks.task_history_model import TaskHistory
from app.modules.tasks.task_model import Task


class TaskRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, task: Task) -> Task:
        self.db.add(task)
        self.db.flush()
        self.db.refresh(task)
        return task

    def get(self, task_id: int) -> Task | None:
        return self.db.scalar(
            select(Task)
            .options(
                joinedload(Task.assigned_user),
            )
            .where(Task.id == task_id)
        )

    def list(
        self,
        user_id: int | None = None,
        status: str | None = None,
        priority: str | None = None,
        assigned_user_id: int | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[Task], int]:
        query = select(Task).options(
            joinedload(Task.assigned_user),
        )
        if user_id is not None:
            query = query.where(
                or_(
                    Task.created_by == user_id,
                    Task.assigned_user_id == user_id,
                )
            )
        if status is not None:
            query = query.where(Task.status == status)
        if priority is not None:
            query = query.where(Task.priority == priority)
        if assigned_user_id is not None:
            query = query.where(Task.assigned_user_id == assigned_user_id)
        if search:
            search = search.strip()
            if search:
                pattern = f"%{search}%"
                query = query.where(
                    or_(
                        Task.title.ilike(pattern),
                        Task.description.ilike(pattern),
                    )
                )
        total = self.db.scalar(
            select(func.count()).select_from(query.subquery())
        ) or 0
        tasks = list(
            self.db.scalars(
                query.order_by(Task.id.desc()).offset((page - 1) * page_size).limit(page_size)
            ).all()
        )
        return tasks, total

    def get_summary(
        self,
        user_id: int | None = None,
        assigned_user_id: int | None = None,
        search: str | None = None,
    ) -> dict[str, int]:
        query = select(
            func.count(Task.id).label("total"),
            func.sum(case((Task.status == "pending", 1), else_=0)).label("pending"),
            func.sum(case((Task.status == "in_progress", 1), else_=0)).label("in_progress"),
            func.sum(case((Task.status == "completed", 1), else_=0)).label("completed"),
            func.sum(case((Task.priority == "low", 1), else_=0)).label("low_priority"),
            func.sum(case((Task.priority == "medium", 1), else_=0)).label("medium_priority"),
            func.sum(case((Task.priority == "high", 1), else_=0)).label("high_priority"),
        )
        if user_id is not None:
            query = query.where(
                or_(
                    Task.created_by == user_id,
                    Task.assigned_user_id == user_id,
                )
            )
        if assigned_user_id is not None:
            query = query.where(Task.assigned_user_id == assigned_user_id)
        if search:
            search = search.strip()
            if search:
                pattern = f"%{search}%"
                query = query.where(
                    or_(
                        Task.title.ilike(pattern),
                        Task.description.ilike(pattern),
                    )
                )
        row = self.db.execute(query).mappings().one()
        return {
            "total": row["total"] or 0,
            "pending": row["pending"] or 0,
            "in_progress": row["in_progress"] or 0,
            "completed": row["completed"] or 0,
            "low_priority": row["low_priority"] or 0,
            "medium_priority": row["medium_priority"] or 0,
            "high_priority": row["high_priority"] or 0,
        }

    def list_history(self, task_id: int) -> List[TaskHistory]:
        return list(
            self.db.scalars(
                select(TaskHistory)
                .where(TaskHistory.task_id == task_id)
                .order_by(TaskHistory.created_at.desc(), TaskHistory.id.desc())
            ).all()
        )

    def update(self, task: Task) -> Task:
        self.db.flush()
        self.db.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        self.db.delete(task)

    def history(self, history: TaskHistory) -> TaskHistory:
        self.db.add(history)
        self.db.flush()
        self.db.refresh(history)
        return history