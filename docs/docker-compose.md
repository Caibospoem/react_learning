# Docker Compose Runbook

## Prerequisites
- Docker Desktop is running.
- You are in project root: `E:\project\re`.

## Start All Services
```bash
docker compose up --build -d
```

Services:
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
1. Open frontend and log in with:
   - username: `bocai`
   - password: `123456`
2. Create one project in UI.
3. Create one task and confirm status changes from `排队中` to `进行中` to `成功`.

## Stop Services
```bash
docker compose down
```

## Stop and Remove Data Volumes
```bash
docker compose down -v
```

This will remove SQLite and uploaded files in `backend_data` volume.
