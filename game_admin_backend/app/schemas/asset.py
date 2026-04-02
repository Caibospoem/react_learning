from datetime import datetime

from pydantic import BaseModel, Field


class AssetResponse(BaseModel):
    id: int
    name: str
    file_path: str
    content_type: str | None = None
    size: int
    project_id: int | None = None
    type: str | None = None
    tags: list[str] = Field(default_factory=list)
    version_count: int = 1
    latest_version: int = 1
    preview_url: str | None = None

    class Config:
        from_attributes = True


class AssetTagUpdate(BaseModel):
    tags: list[str] = Field(default_factory=list)


class AssetVersionResponse(BaseModel):
    id: int
    asset_id: int
    version_number: int
    file_path: str
    content_type: str | None = None
    size: int
    created_at: datetime

    class Config:
        from_attributes = True
