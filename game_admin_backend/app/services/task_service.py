import threading
import time

import redis
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.task import Task
from app.schemas.task import TaskCreate


class TaskStateStore:
    def __init__(self):
        self._memory: dict[str, str] = {}
        self._client = None
        try:
            self._client = redis.Redis.from_url(settings.redis_url, decode_responses=True)
            self._client.ping()
        except Exception:
            self._client = None

    def set(self, key: str, value: str):
        if self._client is not None:
            self._client.set(key, value)
        else:
            self._memory[key] = value

    def get(self, key: str) -> str | None:
        if self._client is not None:
            return self._client.get(key)
        return self._memory.get(key)


store = TaskStateStore()


def _run_task(task_id: int):
    store.set(f"task:{task_id}", "进行中")
    time.sleep(3)
    store.set(f"task:{task_id}", "成功")



def create_task(db: Session, data: TaskCreate) -> Task:
    task = Task(name=data.name, status="排队中", result=None)
    db.add(task)
    db.commit()
    db.refresh(task)
    store.set(f"task:{task.id}", "排队中")
    threading.Thread(target=_run_task, args=(task.id,), daemon=True).start()
    return task


def list_tasks(db: Session):
    tasks = db.query(Task).order_by(Task.id.desc()).all()
    for task in tasks:
        current_status = store.get(f"task:{task.id}")
        if current_status and current_status != task.status:
            task.status = current_status
    db.commit()
    return tasks


def get_task(db: Session, task_id: int) -> Task | None:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    current_status = store.get(f"task:{task.id}")
    if current_status and current_status != task.status:
        task.status = current_status
        if current_status == "成功" and not task.result:
            task.result = "任务执行完成"
        db.commit()
        db.refresh(task)
    return task
