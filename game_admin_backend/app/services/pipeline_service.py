import json
import random
import threading
import time
from datetime import datetime, timezone
from queue import Queue
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.constants import PROJECT_STATUS_PUBLISHED
from app.db.session import SessionLocal
from app.models.pipeline_task import PipelineTask
from app.models.project import Project
from app.models.studio_version import StudioVersion

_queue: Queue[int] = Queue()
_worker_lock = threading.Lock()
_worker_started = False


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _json_dumps(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False)


def _json_loads(data: str | None) -> dict[str, Any]:
    if not data:
        return {}
    try:
        parsed = json.loads(data)
    except json.JSONDecodeError:
        return {}
    if isinstance(parsed, dict):
        return parsed
    return {}


def _build_generated_map() -> dict[str, Any]:
    rows, cols = 12, 32
    tile_size = 24
    cells: dict[str, str] = {}
    for col in range(cols):
        cells[f"{rows - 1}-{col}"] = "ground"
    for col in range(4, cols - 2, 5):
        cells[f"{rows - 3}-{col}"] = "platform"
        cells[f"{rows - 4}-{col + 1}"] = "platform"
    for col in range(10, 15):
        cells[f"{rows - 1}-{col}"] = "water"
    for col in range(20, 24):
        cells[f"{rows - 1}-{col}"] = "spike"
    return {"rows": rows, "cols": cols, "tileSize": tile_size, "cells": cells}


def _create_version_from_generation(
    db: Session,
    task: PipelineTask,
    prompt: str,
    map_data: dict[str, Any],
) -> dict[str, Any]:
    difficulty = random.choice(["normal", "hard", "challenge"])
    summary = f"Generated side-scroller stage ({difficulty}) from prompt."
    assets = [
        {"name": "ground.png", "type": "image", "usage": "base terrain"},
        {"name": "water.png", "type": "image", "usage": "hazard zone"},
        {"name": "spike.png", "type": "image", "usage": "trap"},
        {"name": "bgm_loop.mp3", "type": "audio", "usage": "background music"},
        {"name": "enemy_ai.json", "type": "json", "usage": "enemy behavior config"},
    ]

    version = StudioVersion(
        project_id=task.project_id or 0,
        task_id=task.id,
        prompt=prompt,
        summary=summary,
        map_json=_json_dumps(map_data),
        asset_manifest_json=_json_dumps(assets),
    )
    db.add(version)
    db.flush()
    return {
        "version_id": version.id,
        "summary": summary,
        "map_data": map_data,
        "assets": assets,
    }


def _run_generate_map(db: Session, task: PipelineTask, payload: dict[str, Any]) -> dict[str, Any]:
    prompt = str(payload.get("prompt") or "Help me create a 2D side-scroller level")
    for progress in [15, 40, 65, 85]:
        time.sleep(0.8)
        task.progress = progress
        task.status = "RUNNING"
        task.updated_at = _utc_now()
        db.commit()
    map_data = _build_generated_map()
    result = _create_version_from_generation(db, task, prompt, map_data)
    result["message"] = "Map generation completed."
    return result


def _run_package_build(db: Session, task: PipelineTask, payload: dict[str, Any]) -> dict[str, Any]:
    for progress in [20, 50, 75, 95]:
        time.sleep(0.7)
        task.progress = progress
        task.status = "RUNNING"
        task.updated_at = _utc_now()
        db.commit()
    project_id = task.project_id or payload.get("project_id")
    return {
        "message": "Package build completed.",
        "artifact": f"builds/project-{project_id}-web.zip",
    }


def _run_publish_release(db: Session, task: PipelineTask, payload: dict[str, Any]) -> dict[str, Any]:
    for progress in [25, 55, 80, 95]:
        time.sleep(0.7)
        task.progress = progress
        task.status = "RUNNING"
        task.updated_at = _utc_now()
        db.commit()
    if task.project_id:
        project = db.query(Project).filter(Project.id == task.project_id).first()
        if project:
            project.status = PROJECT_STATUS_PUBLISHED
    return {
        "message": "Release published.",
        "channel": payload.get("channel", "web-demo"),
    }


def _run_task(task_id: int):
    db = SessionLocal()
    try:
        task = db.query(PipelineTask).filter(PipelineTask.id == task_id).first()
        if not task:
            return
        task.status = "RUNNING"
        task.progress = 5
        task.updated_at = _utc_now()
        db.commit()

        payload = _json_loads(task.payload_json)
        if task.task_type == "GENERATE_MAP":
            result = _run_generate_map(db, task, payload)
        elif task.task_type == "PACKAGE_BUILD":
            result = _run_package_build(db, task, payload)
        elif task.task_type == "PUBLISH_RELEASE":
            result = _run_publish_release(db, task, payload)
        else:
            raise RuntimeError(f"Unsupported task type: {task.task_type}")

        task.status = "SUCCESS"
        task.progress = 100
        task.result_json = _json_dumps(result)
        task.updated_at = _utc_now()
        db.commit()
    except Exception as exc:
        db.rollback()
        failed = db.query(PipelineTask).filter(PipelineTask.id == task_id).first()
        if failed:
            failed.status = "FAILED"
            failed.error = str(exc)
            failed.updated_at = _utc_now()
            db.commit()
    finally:
        db.close()


def _worker_loop():
    while True:
        task_id = _queue.get()
        try:
            _run_task(task_id)
        finally:
            _queue.task_done()


def start_pipeline_worker():
    global _worker_started
    with _worker_lock:
        if _worker_started:
            return
        thread = threading.Thread(target=_worker_loop, name="pipeline-worker", daemon=True)
        thread.start()
        _worker_started = True


def enqueue_pipeline_task(db: Session, project_id: int | None, task_type: str, payload: dict[str, Any] | None = None) -> PipelineTask:
    if task_type not in {"GENERATE_MAP", "PACKAGE_BUILD", "PUBLISH_RELEASE"}:
        raise HTTPException(status_code=400, detail="invalid task type")

    task = PipelineTask(
        project_id=project_id,
        task_type=task_type,
        status="QUEUED",
        progress=0,
        payload_json=_json_dumps(payload or {}),
        result_json=None,
        error=None,
        created_at=_utc_now(),
        updated_at=_utc_now(),
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    _queue.put(task.id)
    return task


def get_pipeline_task_or_404(db: Session, task_id: int) -> PipelineTask:
    task = db.query(PipelineTask).filter(PipelineTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="task not found")
    return task


def list_pipeline_tasks(db: Session, project_id: int | None = None) -> list[PipelineTask]:
    query = db.query(PipelineTask)
    if project_id is not None:
        query = query.filter(PipelineTask.project_id == project_id)
    return query.order_by(PipelineTask.id.desc()).all()


def serialize_pipeline_task(task: PipelineTask) -> dict[str, Any]:
    result = _json_loads(task.result_json)
    payload = _json_loads(task.payload_json)
    return {
        "id": task.id,
        "project_id": task.project_id,
        "task_type": task.task_type,
        "status": task.status,
        "progress": task.progress,
        "payload": payload,
        "result": result or None,
        "error": task.error,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }
