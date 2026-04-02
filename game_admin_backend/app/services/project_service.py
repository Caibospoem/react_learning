import os

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.asset_tag import AssetTag
from app.models.asset_version import AssetVersion
from app.models.pipeline_task import PipelineTask
from app.models.project import Project
from app.models.studio_version import StudioVersion
from app.schemas.project import ProjectCreate, ProjectUpdate


def list_projects(db: Session):
    return db.query(Project).order_by(Project.id.desc()).all()


def get_project_or_404(db: Session, project_id: int) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="项目不存在")
    return project


def create_project(db: Session, data: ProjectCreate) -> Project:
    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project_id: int, data: ProjectUpdate) -> Project:
    project = get_project_or_404(db, project_id)
    for field, value in data.model_dump().items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: int) -> None:
    project = get_project_or_404(db, project_id)
    db.delete(project)
    db.commit()


def clone_project(db: Session, project_id: int, name: str | None = None, owner: str | None = None) -> Project:
    source = get_project_or_404(db, project_id)
    cloned_project = Project(
        name=name or f"{source.name} (Clone)",
        description=source.description,
        status=source.status,
        owner=owner or source.owner,
    )
    db.add(cloned_project)
    db.commit()
    db.refresh(cloned_project)
    return cloned_project


def update_project_status(db: Session, project_id: int, status_value: str) -> Project:
    project = get_project_or_404(db, project_id)
    project.status = status_value
    db.commit()
    db.refresh(project)
    return project


def _safe_remove_file(path: str):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        return


def delete_project_with_dependencies(db: Session, project_id: int) -> None:
    project = get_project_or_404(db, project_id)

    assets = db.query(Asset).filter(Asset.project_id == project_id).all()
    for asset in assets:
        versions = db.query(AssetVersion).filter(AssetVersion.asset_id == asset.id).all()
        for version in versions:
            _safe_remove_file(version.file_path)
            db.delete(version)
        tags = db.query(AssetTag).filter(AssetTag.asset_id == asset.id).first()
        if tags:
            db.delete(tags)
        _safe_remove_file(asset.file_path)
        db.delete(asset)

    db.query(PipelineTask).filter(PipelineTask.project_id == project_id).delete(synchronize_session=False)
    db.query(StudioVersion).filter(StudioVersion.project_id == project_id).delete(synchronize_session=False)

    db.delete(project)
    db.commit()
