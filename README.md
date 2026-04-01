# AI Game Admin Demo

This repository is a game-creation platform demo with:
- React frontend (`game-admin-demo`)
- FastAPI backend (`game_admin_backend`)
- Go task service starter (`game_admin_go_task`)

## Project Structure
```text
.
├─ game-admin-demo/          # React + TypeScript + Vite
├─ game_admin_backend/       # FastAPI backend
├─ game_admin_go_task/       # Go task service (learning path module)
├─ docs/                     # runbook/testing/ci/deployment/interview docs
├─ .github/workflows/        # CI workflows
├─ docker-compose.yml        # frontend + backend + go-task + redis
└─ CONTRIBUTING.md
```

## Quick Start (Docker Compose)
```bash
cd E:\project\re
docker compose up --build -d
```

Endpoints:
- Frontend: `http://127.0.0.1:5173`
- FastAPI Swagger: `http://127.0.0.1:8000/docs`
- Go Task Service Health: `http://127.0.0.1:8081/health`

## Local Development
### FastAPI backend
```bash
cd E:\project\re\game_admin_backend
python -m pip install -r requirements.txt
python run.py
```

### React frontend
```bash
cd E:\project\re\game-admin-demo
corepack pnpm install
corepack pnpm dev
```

### Go task service (after Go install)
```bash
cd E:\project\re\game_admin_go_task
go run ./cmd/server
```

## Testing
### Backend
```bash
cd E:\project\re\game_admin_backend
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

### Frontend
```bash
cd E:\project\re\game-admin-demo
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

## Docs
- `docs/docker-compose.md`
- `docs/testing.md`
- `docs/ci.md`
- `docs/deployment.md`
- `docs/interview-talk-track.md`
- `docs/go-learning-execution.md`
