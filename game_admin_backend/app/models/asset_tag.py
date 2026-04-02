from sqlalchemy import Column, DateTime, Integer, Text
from sqlalchemy.sql import func

from app.db.session import Base


class AssetTag(Base):
    __tablename__ = "asset_tags"

    asset_id = Column(Integer, primary_key=True, index=True)
    tags_json = Column(Text, nullable=False, default="[]")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

