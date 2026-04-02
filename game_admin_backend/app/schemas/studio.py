from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


TaskType = Literal["GENERATE_MAP", "PACKAGE_BUILD", "PUBLISH_RELEASE"]
TaskStatus = Literal["QUEUED", "RUNNING", "SUCCESS", "FAILED"]
StudioProjectStatus = Literal["IN_PROGRESS", "PUBLISHED", "ARCHIVED"]


class StudioProjectCreate(BaseModel):
    name: str
    description: str = ""
    owner: str = "bocai"


class StudioProjectCloneRequest(BaseModel):
    name: str | None = None
    owner: str | None = None


class StudioProjectStatusUpdate(BaseModel):
    status: StudioProjectStatus


class StudioGenerateRequest(BaseModel):
    prompt: str


class StudioTaskCreate(BaseModel):
    task_type: TaskType
    prompt: str | None = None
    payload: dict[str, Any] = Field(default_factory=dict)


class StudioMapData(BaseModel):
    rows: int
    cols: int
    tileSize: int
    cells: dict[str, str | int] = Field(default_factory=dict)


class StudioVersionCreate(BaseModel):
    prompt: str = "Edited in map editor"
    summary: str = "Manual map save"
    map_data: StudioMapData
    asset_manifest: list[dict[str, Any]] = Field(default_factory=list)


class PipelineTaskResponse(BaseModel):
    id: int
    project_id: int | None = None
    task_type: TaskType
    status: TaskStatus
    progress: int
    payload: dict[str, Any] = Field(default_factory=dict)
    result: dict[str, Any] | None = None
    error: str | None = None
    created_at: datetime
    updated_at: datetime


class StudioVersionResponse(BaseModel):
    id: int
    project_id: int
    task_id: int | None = None
    prompt: str
    summary: str
    map_data: dict[str, Any]
    asset_manifest: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime
