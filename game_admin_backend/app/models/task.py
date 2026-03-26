from sqlalchemy import Column, Integer, String

from app.db.session import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    status = Column(String(20), nullable=False, default="排队中")
    result = Column(String(255), nullable=True)
