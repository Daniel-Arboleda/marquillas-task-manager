from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.ai.api.ai_routes import router as ai_router
from app.modules.auth.api.auth_routes import router as auth_router
from app.modules.health.health_routes import router as health_router
from app.modules.tasks.api.task_routes import router as task_router
from app.modules.users.api.user_routes import router as user_router

app = FastAPI(
    title="Marquillas Task Manager API",
    description="Technical Assessment Backend",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(task_router)
app.include_router(ai_router)