from sqlalchemy import Column, Integer, String

from app.db.session import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    content_type = Column(String(100), nullable=True)
    size = Column(Integer, nullable=False, default=0)
    project_id = Column(Integer, nullable=True)
