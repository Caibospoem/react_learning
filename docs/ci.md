# CI Guide

## Workflow
- `.github/workflows/ci.yml`

## Trigger
- pull request
- push to `main`, `develop`, `feature/**`

## Jobs
1. `Backend Test`: install backend dev deps + `pytest`.
2. `Frontend Lint Test Build`: `pnpm lint/test/build`.
3. `Go Task Build`: `gofmt` check + `go build`.
4. `Docker Build Check`: compose validation + image builds.

## Suggested Required Checks
Set these checks as required on protected branches:
- `Backend Test`
- `Frontend Lint Test Build`
- `Go Task Build`
- `Docker Build Check`
