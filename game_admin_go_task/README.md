# game_admin_go_task

Minimal Go task service starter for your 10-week learning plan.

## What is included now
- `GET /health`
- `POST /tasks` (enqueue fake task)
- `GET /tasks`
- `GET /tasks/{id}`
- in-memory task store
- goroutine + channel worker

## Why this starter
- Matches your current project domain (task scheduling/status flow).
- Lets you practice core Go concurrency before introducing queue middleware.
- Can be integrated into `docker-compose.yml` in Week 7.

## Run (after Go is installed)
```bash
cd E:\project\re\game_admin_go_task
go run ./cmd/server
```

Service default:
- `http://127.0.0.1:8081`

## Suggested next steps
1. Replace in-memory store with DB + Redis in Week 3/5.
2. Add cancel/retry logic in Week 5.
3. Add tests and CI in Week 8/9.
