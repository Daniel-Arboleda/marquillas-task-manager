from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


TaskSuggestedPriority = Literal["baja", "media", "alta"]


class TaskEnrichmentRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=5000)

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


class TaskEnrichmentResponse(BaseModel):
    prioridad_sugerida: TaskSuggestedPriority
    categoria_sugerida: str = Field(min_length=1, max_length=100)
    resumen: str = Field(min_length=1, max_length=500)
    confianza: float = Field(ge=0.0, le=1.0)

    @field_validator("categoria_sugerida", mode="before")
    @classmethod
    def normalize_categoria(cls, value: str) -> str:
        return str(value).strip()

    @field_validator("resumen", mode="before")
    @classmethod
    def normalize_resumen(cls, value: str) -> str:
        return str(value).strip()

    model_config = ConfigDict(
        frozen=True,
    )