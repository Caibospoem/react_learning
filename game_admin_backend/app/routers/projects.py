from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.project_service import create_project, delete_project, get_project_or_404, list_projects, update_project

router = APIRouter(prefix="/projects", tags=["projects"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return list_projects(db)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    return get_project_or_404(db, project_id)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def post_project(data: ProjectCreate, db: Session = Depends(get_db)):
    return create_project(db, data)


@router.put("/{project_id}", response_model=ProjectResponse)
def put_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db)):
    return update_project(db, project_id, data)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_project(project_id: int, db: Session = Depends(get_db)):
    delete_project(db, project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
