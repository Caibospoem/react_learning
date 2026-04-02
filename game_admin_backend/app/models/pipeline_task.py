from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.db.session import Base


class PipelineTask(Base):
    __tablename__ = "pipeline_tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, index=True, nullable=True)
    task_type = Column(String(40), nullable=False)
    status = Column(String(20), nullable=False, default="QUEUED")
    progress = Column(Integer, nullable=False, default=0)
    payload_json = Column(Text, nullable=True)
    result_json = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

