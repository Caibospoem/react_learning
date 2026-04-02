from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.db.session import Base


class AssetVersion(Base):
    __tablename__ = "asset_versions"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, index=True, nullable=False)
    version_number = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    content_type = Column(String(100), nullable=True)
    size = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

