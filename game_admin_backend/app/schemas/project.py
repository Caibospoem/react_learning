from typing import Literal

from pydantic import BaseModel

ProjectStatus = Literal["进行中", "已发布", "已归档"]


class ProjectCreate(BaseModel):
    name: str
    description: str
    status: ProjectStatus = "进行中"
    owner: str


class ProjectUpdate(BaseModel):
    name: str
    description: str
    status: ProjectStatus
    owner: str


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str
    status: ProjectStatus
    owner: str

    class Config:
        from_attributes = True

