# Docker Compose Runbook

## Prerequisites
- Docker Desktop is running.
- Working directory is project root: `E:\project\re`.

## Start All Services
```bash
docker compose up --build -d
```

Service endpoints:
- Frontend: `http://127.0.0.1:5173`
- Backend Swagger: `http://127.0.0.1:8000/docs`
- Redis: internal container network only

## Check Running Status
```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

## Smoke Test
1. Open frontend and log in:
   - username: `bocai`
   - password: `123456`
2. Create a project.
3. Create a task and confirm status transition:
   - `排队中`
   - `进行中`
   - `成功`

## Stop Services
```bash
docker compose down
```

## Stop and Remove Data Volumes
```bash
docker compose down -v
```

This also removes SQLite data and uploaded files in `backend_data`.
