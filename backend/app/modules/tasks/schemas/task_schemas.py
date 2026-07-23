from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


TaskStatus = Literal["pending", "in_progress", "completed", "cancelled"]
TaskPriority = Literal["low", "medium", "high", "critical"]


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    priority: TaskPriority = "medium"
    assigned_user_id: int | None = Field(default=None, ge=1)
    due_date: datetime | None = None

    @field_validator("title", mode="before")
    @classmethod
    def normalize_title(cls, value: str) -> str:
        return str(value).strip()

    @field_validator("description", mode="before")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assigned_user_id: int | None = Field(default=None, ge=1)
    due_date: datetime | None = None

    @field_validator("title", mode="before")
    @classmethod
    def normalize_title(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return str(value).strip()

    @field_validator("description", mode="before")
    @classmethod
    def normalize_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    assigned_user_id: int | None
    assigned_user_name: str | None = None
    assigned_user_email: str | None = None
    due_date: datetime | None
    is_overdue: bool = Field(default=False)
    days_overdue: int = Field(default=0, ge=0)
    created_by: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskSummaryResponse(BaseModel):
    total: int = Field(default=0, ge=0)
    pending: int = Field(default=0, ge=0)
    in_progress: int = Field(default=0, ge=0)
    completed: int = Field(default=0, ge=0)
    low_priority: int = Field(default=0, ge=0)
    medium_priority: int = Field(default=0, ge=0)
    high_priority: int = Field(default=0, ge=0)

    model_config = ConfigDict(frozen=True)


class TaskHistoryResponse(BaseModel):
    id: int
    task_id: int
    action: str
    field_name: str | None = None
    previous_value: str | None = None
    new_value: str | None = None
    performed_by: int
    user_name: str | None = None
    user_email: str | None = None
    event_type: str | None = None
    event_metadata: dict[str, str | int | float | bool | None] | None = Field(
        default=None,
        serialization_alias="metadata",
    )
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TaskListResponse(BaseModel):
    items: list[TaskResponse]
    page: int
    page_size: int
    total: int
    total_pages: int
    has_next: bool
    has_previous: bool

    model_config = ConfigDict(frozen=True)


class TaskHistoryListResponse(BaseModel):
    items: list[TaskHistoryResponse]

    model_config = ConfigDict(frozen=True)


class TaskFilters(BaseModel):
    search: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assigned_user_id: int | None = Field(default=None, ge=1)

    @field_validator("search", mode="before")
    @classmethod
    def normalize_search(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None