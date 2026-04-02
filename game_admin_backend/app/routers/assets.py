import json

from fastapi import APIRouter, Depends, File, Form, Response, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.schemas.asset import AssetResponse, AssetTagUpdate, AssetVersionResponse
from app.services.asset_service import (
    add_asset_version,
    delete_asset,
    get_asset_file_path,
    get_asset_version_file_path,
    list_asset_versions,
    list_assets,
    save_upload_file,
    update_asset_tags,
)

router = APIRouter(prefix="/assets", tags=["assets"], dependencies=[Depends(get_current_user)])


def _parse_tags(raw_tags: str | None) -> list[str]:
    if not raw_tags:
        return []
    try:
        parsed = json.loads(raw_tags)
    except json.JSONDecodeError:
        return [part.strip() for part in raw_tags.split(",") if part.strip()]
    if isinstance(parsed, list):
        return [str(item).strip() for item in parsed if str(item).strip()]
    return []


@router.get("", response_model=list[AssetResponse])
def get_assets(project_id: int | None = None, db: Session = Depends(get_db)):
    return list_assets(db, project_id=project_id)


@router.post("/upload", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def upload_asset(
    file: UploadFile = File(...),
    project_id: int | None = Form(default=None),
    tags: str | None = Form(default=None),
    db: Session = Depends(get_db),
):
    return save_upload_file(db, file, project_id, tags=_parse_tags(tags))


@router.patch("/{asset_id}/tags", response_model=AssetResponse)
def patch_asset_tags(asset_id: int, data: AssetTagUpdate, db: Session = Depends(get_db)):
    return update_asset_tags(db, asset_id, data.tags)


@router.post("/{asset_id}/versions", response_model=AssetVersionResponse, status_code=status.HTTP_201_CREATED)
def post_asset_version(asset_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    return add_asset_version(db, asset_id, file)


@router.get("/{asset_id}/versions", response_model=list[AssetVersionResponse])
def get_versions(asset_id: int, db: Session = Depends(get_db)):
    return list_asset_versions(db, asset_id)


@router.get("/{asset_id}/raw")
def get_asset_raw(asset_id: int, db: Session = Depends(get_db)):
    return FileResponse(get_asset_file_path(db, asset_id))


@router.get("/{asset_id}/versions/{version_id}/raw")
def get_asset_version_raw(asset_id: int, version_id: int, db: Session = Depends(get_db)):
    return FileResponse(get_asset_version_file_path(db, asset_id, version_id))


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_asset(asset_id: int, db: Session = Depends(get_db)):
    delete_asset(db, asset_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

