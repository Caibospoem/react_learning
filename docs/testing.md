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

Current backend coverage:
- Auth login success/failure
- Project API auth gate + CRUD flow
- Task status transition (`排队中 -> 进行中 -> 成功`)

## Frontend Tests (`vitest`)
Working directory:
`E:\project\re\game-admin-demo`

Install dependencies:
```bash
corepack pnpm install
```

Run tests:
```bash
corepack pnpm test
```

Run watch mode:
```bash
corepack pnpm test:watch
```

Current frontend coverage:
- Map utility functions (`create/set/remove/getCellKey`)
