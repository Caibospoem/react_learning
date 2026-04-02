from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.db.session import Base


class StudioVersion(Base):
    __tablename__ = "studio_versions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True, nullable=False)
    task_id = Column(Integer, index=True, nullable=True)
    prompt = Column(Text, nullable=False)
    summary = Column(String(255), nullable=False)
    map_json = Column(Text, nullable=False)
    asset_manifest_json = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

