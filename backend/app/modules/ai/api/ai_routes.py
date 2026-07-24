from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.ai.schemas.ai_schemas import TaskEnrichmentRequest, TaskEnrichmentResponse
from app.modules.ai.services.ai_service import AIService
from app.modules.auth.auth_dependencies import get_current_user
from app.modules.users.user_model import User


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


@router.post(
    "/enrich-task",
    response_model=TaskEnrichmentResponse,
)
def enrich_task(
    payload: TaskEnrichmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskEnrichmentResponse:
    service = AIService(db)
    return service.enrich_task(
        payload=payload,
        current_user=current_user,
    )