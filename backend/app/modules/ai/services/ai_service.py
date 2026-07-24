from pathlib import Path

from sqlalchemy.orm import Session

from app.modules.ai.schemas.ai_schemas import (
    TaskEnrichmentRequest,
    TaskEnrichmentResponse,
)
from app.modules.users.user_model import User


class AIService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def enrich_task(
        self,
        payload: TaskEnrichmentRequest,
        current_user: User,
    ) -> TaskEnrichmentResponse:
        _ = current_user
        try:
            system_prompt = self._load_system_prompt()
            return self._generate_enrichment(
                payload=payload,
                system_prompt=system_prompt,
            )
        except Exception:
            return self._fallback()

    def _generate_enrichment(
        self,
        payload: TaskEnrichmentRequest,
        system_prompt: str,
    ) -> TaskEnrichmentResponse:
        raise NotImplementedError

    def _load_system_prompt(self) -> str:
        prompt_path = (
            Path(__file__).resolve().parent.parent
            / "prompts"
            / "enrich_task_system.txt"
        )
        return prompt_path.read_text(encoding="utf-8")

    def _fallback(self) -> TaskEnrichmentResponse:
        return TaskEnrichmentResponse(
            prioridad_sugerida="media",
            categoria_sugerida="general",
            resumen="No fue posible generar sugerencias automáticas.",
            confianza=0.0,
        )