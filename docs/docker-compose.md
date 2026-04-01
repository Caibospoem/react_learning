# Docker Compose Runbook

## Start
```bash
cd E:\project\re
docker compose up --build -d
```

## Services
- Frontend: `http://127.0.0.1:5173`
- FastAPI backend: `http://127.0.0.1:8000`
- Go task service: `http://127.0.0.1:8081`
- Redis: internal only

## Check
```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f go-task
docker compose logs -f frontend
```

## Stop
```bash
docker compose down
```

## Clean Volumes
```bash
docker compose down -v
```
