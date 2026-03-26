import os
import uuid

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.asset import Asset


def save_upload_file(db: Session, file: UploadFile, project_id: int | None = None) -> Asset:
    os.makedirs(settings.upload_dir, exist_ok=True)
    extension = os.path.splitext(file.filename or "")[1]
    unique_name = f"{uuid.uuid4().hex}{extension}"
    disk_path = os.path.join(settings.upload_dir, unique_name)

    content = file.file.read()
    with open(disk_path, "wb") as f:
        f.write(content)

    asset = Asset(
        name=file.filename or unique_name,
        file_path=disk_path,
        content_type=file.content_type,
        size=len(content),
        project_id=project_id,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


def list_assets(db: Session):
    return db.query(Asset).order_by(Asset.id.desc()).all()
