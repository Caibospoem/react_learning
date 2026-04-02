import json
import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset
from app.models.asset_tag import AssetTag
from app.models.asset_version import AssetVersion


def _detect_asset_type(content_type: str | None, filename: str) -> str:
    content = (content_type or "").lower()
    suffix = Path(filename).suffix.lower()

    if content.startswith("image/") or suffix in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
        return "image"
    if content.startswith("audio/") or suffix in {".mp3", ".wav", ".ogg", ".m4a"}:
        return "audio"
    if content in {"application/json", "text/json"} or suffix == ".json":
        return "json"
    return "config"


def _serialize_asset(asset: Asset, tags: list[str], version_count: int, latest_version: int) -> dict:
    return {
        "id": asset.id,
        "name": asset.name,
        "file_path": asset.file_path,
        "content_type": asset.content_type,
        "size": asset.size,
        "project_id": asset.project_id,
        "type": _detect_asset_type(asset.content_type, asset.name),
        "tags": tags,
        "version_count": version_count,
        "latest_version": latest_version,
        "preview_url": f"/api/assets/{asset.id}/raw",
    }


def _save_binary_file(file: UploadFile) -> tuple[str, int]:
    os.makedirs(settings.upload_dir, exist_ok=True)
    extension = os.path.splitext(file.filename or "")[1]
    unique_name = f"{uuid.uuid4().hex}{extension}"
    disk_path = os.path.join(settings.upload_dir, unique_name)

    content = file.file.read()
    with open(disk_path, "wb") as handle:
        handle.write(content)
    return disk_path, len(content)


def _get_tags(db: Session, asset_id: int) -> list[str]:
    meta = db.query(AssetTag).filter(AssetTag.asset_id == asset_id).first()
    if not meta:
        return []
    try:
        data = json.loads(meta.tags_json)
        if isinstance(data, list):
            return [str(item) for item in data]
    except json.JSONDecodeError:
        return []
    return []


def _build_asset_response(db: Session, asset: Asset) -> dict:
    versions = db.query(AssetVersion).filter(AssetVersion.asset_id == asset.id).all()
    version_count = len(versions) if versions else 1
    latest_version = max((item.version_number for item in versions), default=1)
    tags = _get_tags(db, asset.id)
    return _serialize_asset(asset, tags, version_count, latest_version)


def get_asset_or_404(db: Session, asset_id: int) -> Asset:
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="asset not found")
    return asset


def save_upload_file(
    db: Session,
    file: UploadFile,
    project_id: int | None = None,
    tags: list[str] | None = None,
) -> dict:
    disk_path, size = _save_binary_file(file)

    asset = Asset(
        name=file.filename or Path(disk_path).name,
        file_path=disk_path,
        content_type=file.content_type,
        size=size,
        project_id=project_id,
    )
    db.add(asset)
    db.flush()

    version = AssetVersion(
        asset_id=asset.id,
        version_number=1,
        file_path=disk_path,
        content_type=file.content_type,
        size=size,
    )
    db.add(version)

    db.add(AssetTag(asset_id=asset.id, tags_json=json.dumps(tags or [], ensure_ascii=False)))
    db.commit()
    db.refresh(asset)
    return _build_asset_response(db, asset)


def add_asset_version(db: Session, asset_id: int, file: UploadFile) -> AssetVersion:
    asset = get_asset_or_404(db, asset_id)
    disk_path, size = _save_binary_file(file)

    latest = (
        db.query(AssetVersion)
        .filter(AssetVersion.asset_id == asset_id)
        .order_by(AssetVersion.version_number.desc())
        .first()
    )
    next_version = (latest.version_number if latest else 0) + 1

    version = AssetVersion(
        asset_id=asset_id,
        version_number=next_version,
        file_path=disk_path,
        content_type=file.content_type,
        size=size,
    )
    db.add(version)

    asset.name = file.filename or asset.name
    asset.file_path = disk_path
    asset.content_type = file.content_type
    asset.size = size
    db.commit()
    db.refresh(version)
    return version


def update_asset_tags(db: Session, asset_id: int, tags: list[str]) -> dict:
    asset = get_asset_or_404(db, asset_id)
    meta = db.query(AssetTag).filter(AssetTag.asset_id == asset_id).first()
    if not meta:
        meta = AssetTag(asset_id=asset_id, tags_json="[]")
        db.add(meta)
    meta.tags_json = json.dumps(tags, ensure_ascii=False)
    db.commit()
    return _build_asset_response(db, asset)


def _safe_remove_file(path: str):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        return


def delete_asset(db: Session, asset_id: int) -> None:
    asset = get_asset_or_404(db, asset_id)
    versions = db.query(AssetVersion).filter(AssetVersion.asset_id == asset_id).all()
    for version in versions:
        _safe_remove_file(version.file_path)
        db.delete(version)

    _safe_remove_file(asset.file_path)
    meta = db.query(AssetTag).filter(AssetTag.asset_id == asset_id).first()
    if meta:
        db.delete(meta)
    db.delete(asset)
    db.commit()


def get_asset_file_path(db: Session, asset_id: int) -> str:
    asset = get_asset_or_404(db, asset_id)
    return asset.file_path


def get_asset_version_file_path(db: Session, asset_id: int, version_id: int) -> str:
    get_asset_or_404(db, asset_id)
    version = (
        db.query(AssetVersion)
        .filter(AssetVersion.id == version_id, AssetVersion.asset_id == asset_id)
        .first()
    )
    if not version:
        raise HTTPException(status_code=404, detail="asset version not found")
    return version.file_path


def list_asset_versions(db: Session, asset_id: int):
    get_asset_or_404(db, asset_id)
    return (
        db.query(AssetVersion)
        .filter(AssetVersion.asset_id == asset_id)
        .order_by(AssetVersion.version_number.desc())
        .all()
    )


def list_assets(db: Session, project_id: int | None = None):
    query = db.query(Asset)
    if project_id is not None:
        query = query.filter(Asset.project_id == project_id)
    assets = query.order_by(Asset.id.desc()).all()
    return [_build_asset_response(db, asset) for asset in assets]

