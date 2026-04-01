# Contributing Guide

## Purpose
This repository contains a frontend (`game-admin-demo`) and backend (`game_admin_backend`) for the Game Admin Demo project.
Use this guide to keep collaboration predictable and reviewable.

## Branch Strategy
- `main`: release-ready code only.
- `develop`: integration branch for validated feature work.
- `feature/*`: feature development branches from `develop`.

Recommended branch naming:
- `feature/<scope>-<short-name>`
- Example: `feature/phase4-engineering`

## Development Workflow
1. Sync local `develop` from remote.
2. Create your feature branch from `develop`.
3. Implement and keep commits focused.
4. Run local quality checks.
5. Open a PR to `develop` using the PR template.
6. Merge after review approval and green checks.

## Commit Convention
Use Conventional Commits:
- `feat: ...`
- `fix: ...`
- `docs: ...`
- `refactor: ...`
- `test: ...`
- `chore: ...`

Examples:
- `feat(frontend): add map import validation`
- `fix(backend): handle empty task result safely`

## Local Checks Before PR
Run checks only for the part you changed, plus integration sanity checks when needed.

Frontend (`game-admin-demo`):
```bash
pnpm lint
pnpm build
```

Backend (`game_admin_backend`):
```bash
python -m pip install -r requirements.txt
python run.py
```

When tests are added in phase 4, this section should be extended with test commands.

## Pull Request Rules
- One PR should solve one focused problem.
- Include context, scope, test evidence, and rollback notes.
- Keep refactors separate from feature behavior changes unless unavoidable.
- Do not merge with unresolved review comments.

## Review Standard
Use checklist at `docs/review-checklist.md` for every PR review.
