# Deployment Notes

## Deployment Topology
- frontend (Nginx static site)
- backend (FastAPI + Uvicorn)
- go-task (Go task scheduler starter)
- redis (task state cache)

## Deploy Command
```bash
cd E:\project\re
docker compose up --build -d
```

## Verify
```bash
docker compose ps
```

Check URLs:
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8081/health`

## Production Suggestions
1. Replace SQLite with PostgreSQL.
2. Add service-to-service auth between backend and go-task.
3. Add healthcheck/restart policies and monitoring.
4. Move secrets to external secret manager.
