from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.constants import PROJECT_STATUS_ALIASES, PROJECT_STATUS_IN_PROGRESS
from app.core.security import get_current_user
from app.db.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectResponse
from app.schemas.studio import (
    PipelineTaskResponse,
    StudioGenerateRequest,
    StudioVersionCreate,
    StudioProjectCloneRequest,
    StudioProjectCreate,
    StudioProjectStatusUpdate,
    StudioTaskCreate,
    StudioVersionResponse,
)
from app.services.pipeline_service import (
    enqueue_pipeline_task,
    get_pipeline_task_or_404,
    list_pipeline_tasks,
    serialize_pipeline_task,
)
from app.services.project_service import (
    clone_project,
    delete_project_with_dependencies,
    get_project_or_404,
    list_projects,
    update_project_status,
)
from app.services.studio_service import create_studio_version, list_studio_versions, serialize_studio_version

router = APIRouter(prefix="/studio", tags=["studio"], dependencies=[Depends(get_current_user)])


@router.get("/projects", response_model=list[ProjectResponse])
def get_studio_projects(db: Session = Depends(get_db)):
    return list_projects(db)


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def post_studio_project(data: StudioProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        name=data.name,
        description=data.description,
        owner=data.owner,
        status=PROJECT_STATUS_IN_PROGRESS,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.post("/projects/{project_id}/clone", response_model=ProjectResponse)
def post_clone_project(project_id: int, data: StudioProjectCloneRequest, db: Session = Depends(get_db)):
    return clone_project(db, project_id, name=data.name, owner=data.owner)


@router.patch("/projects/{project_id}/status", response_model=ProjectResponse)
def patch_project_status(project_id: int, data: StudioProjectStatusUpdate, db: Session = Depends(get_db)):
    status_value = PROJECT_STATUS_ALIASES[data.status]
    return update_project_status(db, project_id, status_value)


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_studio_project(project_id: int, db: Session = Depends(get_db)):
    delete_project_with_dependencies(db, project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/projects/{project_id}/versions", response_model=list[StudioVersionResponse])
def get_project_versions(project_id: int, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    versions = list_studio_versions(db, project_id)
    return [serialize_studio_version(version) for version in versions]


@router.post("/projects/{project_id}/versions", response_model=StudioVersionResponse, status_code=status.HTTP_201_CREATED)
def post_project_version(project_id: int, data: StudioVersionCreate, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    version = create_studio_version(db, project_id, data)
    return serialize_studio_version(version)


@router.post("/projects/{project_id}/generate", response_model=PipelineTaskResponse, status_code=status.HTTP_202_ACCEPTED)
def post_generate_task(project_id: int, data: StudioGenerateRequest, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    task = enqueue_pipeline_task(
        db=db,
        project_id=project_id,
        task_type="GENERATE_MAP",
        payload={"prompt": data.prompt},
    )
    return serialize_pipeline_task(task)


@router.post("/projects/{project_id}/tasks", response_model=PipelineTaskResponse, status_code=status.HTTP_202_ACCEPTED)
def post_project_task(project_id: int, data: StudioTaskCreate, db: Session = Depends(get_db)):
    get_project_or_404(db, project_id)
    payload = dict(data.payload)
    if data.prompt:
        payload["prompt"] = data.prompt
    task = enqueue_pipeline_task(
        db=db,
        project_id=project_id,
        task_type=data.task_type,
        payload=payload,
    )
    return serialize_pipeline_task(task)


@router.get("/tasks", response_model=list[PipelineTaskResponse])
def get_studio_tasks(project_id: int | None = None, db: Session = Depends(get_db)):
    tasks = list_pipeline_tasks(db, project_id=project_id)
    return [serialize_pipeline_task(task) for task in tasks]


@router.get("/tasks/{task_id}", response_model=PipelineTaskResponse)
def get_studio_task(task_id: int, db: Session = Depends(get_db)):
    task = get_pipeline_task_or_404(db, task_id)
    return serialize_pipeline_task(task)
