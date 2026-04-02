import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import Base, SessionLocal, engine
from app.models import User
from app.routers import assets, auth, projects, studio, system, tasks
from app.services.pipeline_service import start_pipeline_worker

Base.metadata.create_all(bind=engine)
os.makedirs(settings.upload_dir, exist_ok=True)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(projects.router, prefix=settings.api_prefix)
app.include_router(assets.router, prefix=settings.api_prefix)
app.include_router(tasks.router, prefix=settings.api_prefix)
app.include_router(studio.router, prefix=settings.api_prefix)
app.include_router(system.router, prefix=settings.api_prefix)


@app.on_event("startup")
def seed_default_user():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "bocai").first()
        if not user:
            db.add(User(username="bocai", password_hash=get_password_hash("123456")))
            db.commit()
    finally:
        db.close()

    start_pipeline_worker()


@app.get("/")
def root():
    return {"message": "Game Admin Backend Running"}
