import json
from typing import Any

from sqlalchemy.orm import Session

from app.models.studio_version import StudioVersion
from app.schemas.studio import StudioVersionCreate


def list_studio_versions(db: Session, project_id: int) -> list[StudioVersion]:
    return (
        db.query(StudioVersion)
        .filter(StudioVersion.project_id == project_id)
        .order_by(StudioVersion.id.desc())
        .all()
    )


def serialize_studio_version(version: StudioVersion) -> dict[str, Any]:
    try:
        map_data = json.loads(version.map_json)
    except json.JSONDecodeError:
        map_data = {}

    try:
        asset_manifest = json.loads(version.asset_manifest_json)
        if not isinstance(asset_manifest, list):
            asset_manifest = []
    except json.JSONDecodeError:
        asset_manifest = []

    return {
        "id": version.id,
        "project_id": version.project_id,
        "task_id": version.task_id,
        "prompt": version.prompt,
        "summary": version.summary,
        "map_data": map_data,
        "asset_manifest": asset_manifest,
        "created_at": version.created_at,
    }


def create_studio_version(db: Session, project_id: int, data: StudioVersionCreate) -> StudioVersion:
    version = StudioVersion(
        project_id=project_id,
        task_id=None,
        prompt=data.prompt,
        summary=data.summary,
        map_json=json.dumps(data.map_data.model_dump(), ensure_ascii=False),
        asset_manifest_json=json.dumps(data.asset_manifest, ensure_ascii=False),
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version
