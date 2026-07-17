from sqlalchemy import or_, select
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

    def list_tasks(self) -> list[Task]:
        return list(self.db.scalars(select(Task).order_by(Task.id.desc())).all())

    def list_by_user(self, user_id: int) -> list[Task]:
        return list(
            self.db.scalars(
                select(Task)
                .where(
                    or_(
                        Task.created_by == user_id,
                        Task.assigned_user_id == user_id,
                    )
                )
                .order_by(Task.id.desc())
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