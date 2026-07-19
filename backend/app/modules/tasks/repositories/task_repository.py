from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

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
        return self.db.get(Task, task_id)

    def list(
        self,
        user_id: int | None = None,
        status: str | None = None,
        priority: str | None = None,
        assigned_user_id: int | None = None,
        search: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Task], int]:
        query = select(Task)
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