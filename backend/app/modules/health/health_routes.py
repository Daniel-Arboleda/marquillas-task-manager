from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db


router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "marquillas-task-manager-api",
        "version": "0.1.0",
    }


@router.get("/database")
def database_health(
    db: Session = Depends(get_db),
) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "database": "connected",
    }