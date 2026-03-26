from sqlalchemy import Column, Integer, String, Text

from app.db.session import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="进行中")
    owner = Column(String(50), nullable=False)
