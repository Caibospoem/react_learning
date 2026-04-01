# Deployment Notes

## Current Deployment Mode
This project is currently deployed as a single-node Docker Compose stack:
- `frontend` (Nginx serving built static assets)
- `backend` (FastAPI + Uvicorn)
- `redis` (task state cache)

## One-Command Deployment
```bash
cd E:\project\re
docker compose up --build -d
```

## Environment Variables (Backend)
Defined in `docker-compose.yml`:
- `DATABASE_URL=sqlite:////app/data/game_admin.db`
- `REDIS_URL=redis://redis:6379/0`
- `SECRET_KEY=dev_secret_key_change_me`
- `ACCESS_TOKEN_EXPIRE_MINUTES=120`
- `UPLOAD_DIR=/app/data/uploads`

## Persistent Data
- `backend_data` volume stores:
  - SQLite database
  - uploaded files
- `redis_data` volume stores Redis data.

## Health and Verification
After deployment:
```bash
docker compose ps
```

Manual checks:
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8000/docs`
- login API and create task flow

## Production Hardening Suggestions
- Replace SQLite with PostgreSQL.
- Restrict CORS to trusted origins.
- Move secrets to environment/secret manager.
- Add HTTPS and reverse proxy with domain.
- Add container health checks and monitoring.
