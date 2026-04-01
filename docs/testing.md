# Testing Guide

## Backend Tests (`pytest`)
Working directory:
`E:\project\re\game_admin_backend`

Install test dependencies:
```bash
python -m pip install -r requirements-dev.txt
```

Run tests:
```bash
python -m pytest -q
```

Covered in current suite:
- Auth login success/failure
- Project API auth gate and CRUD flow
- Task status transition (`排队中 -> 进行中 -> 成功`)

## Frontend Tests (`vitest`)
Working directory:
`E:\project\re\game-admin-demo`

Install dependencies:
```bash
pnpm install
```

Run tests:
```bash
pnpm test
```

Run watch mode:
```bash
pnpm test:watch
```

Covered in current suite:
- Map utility functions (`create/set/remove/getKey`)
