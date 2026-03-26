from typing import Literal

from pydantic import BaseModel

TaskStatus = Literal["排队中", "进行中", "成功", "失败"]


class TaskCreate(BaseModel):
    name: str


class TaskResponse(BaseModel):
    id: int
    name: str
    status: TaskStatus
    result: str | None = None

    class Config:
        from_attributes = True
