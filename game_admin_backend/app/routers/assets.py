from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.schemas.asset import AssetResponse
from app.services.asset_service import list_assets, save_upload_file

router = APIRouter(prefix="/assets", tags=["assets"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=list[AssetResponse])
def get_assets(db: Session = Depends(get_db)):
    return list_assets(db)


@router.post("/upload", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def upload_asset(
    file: UploadFile = File(...),
    project_id: int | None = Form(default=None),
    db: Session = Depends(get_db),
):
    return save_upload_file(db, file, project_id)
