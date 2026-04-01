# CI Guide

## Workflow File
- `.github/workflows/ci.yml`

## Trigger Rules
- Runs on every pull request.
- Runs on push to:
  - `main`
  - `develop`
  - `feature/**`

## Jobs
1. `Backend Test`
- Install backend dev dependencies from `requirements-dev.txt`.
- Run `python -m pytest -q`.

2. `Frontend Lint Test Build`
- Install frontend dependencies with pnpm.
- Run:
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`

3. `Docker Build Check`
- Validate `docker-compose.yml` via `docker compose config`.
- Build:
  - backend image from `game_admin_backend`
  - frontend image from `game-admin-demo`

## Suggested Branch Protection
Set these required checks for `develop` and `main`:
- `Backend Test`
- `Frontend Lint Test Build`
- `Docker Build Check`

## Local Pre-check (before pushing)
Backend:
```bash
cd E:\project\re\game_admin_backend
python -m pytest -q
```

Frontend:
```bash
cd E:\project\re\game-admin-demo
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```
