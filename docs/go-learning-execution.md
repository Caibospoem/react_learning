# Go Learning Execution Plan (Based on Your 10-Week Plan)

## Current Status
- FastAPI: usable
- Go: not installed yet on current machine
- Next focus: start Week 1 immediately after Go install

## Repo Mapping
- Existing frontend: `game-admin-demo`
- Existing Python backend: `game_admin_backend`
- New Go service: `game_admin_go_task`

## Week 1 (Execution Version)
1. Day 1: install Go, verify `go version`, run `go run` on starter service.
2. Day 2: finish language basics practice (slice/map/function/error).
3. Day 3: struct/method/interface/error mini exercises.
4. Day 4: package split (`internal/model`, `internal/service`, `internal/store`).
5. Day 5: write unit tests (`go test ./...`).
6. Day 6: build CLI practice from JSON input.
7. Day 7: write weekly retrospective note.

## Week 2 (Execution Version)
1. Introduce Gin and move from stdlib demo to framework version.
2. Build minimal API with `/health`, `/tasks`, `/tasks/:id`.
3. Split `handler/service/repository`.
4. Add unified response envelope.
5. Connect frontend to one API path.
6. Update README and architecture diagram.

## Daily Checklist Template
Use this format each day:
1. Learning (30 min): what doc/tutorial completed.
2. Coding (60-120 min): what code was added.
3. Verification (20 min): tests, run output, screenshots.
4. Retrospective (10 min): one pitfall + one takeaway.

## Hard Acceptance Rules
1. Every week must produce code (not only notes).
2. Every week must have at least one test.
3. Every week must have one short document.
4. Every week must prepare at least three interview Q&A points.
