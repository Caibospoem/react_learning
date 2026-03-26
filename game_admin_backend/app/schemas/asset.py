from pydantic import BaseModel


class AssetResponse(BaseModel):
    id: int
    name: str
    file_path: str
    content_type: str | None = None
    size: int
    project_id: int | None = None

    class Config:
        from_attributes = True
