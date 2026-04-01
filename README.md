# AI Game Admin Demo

一个前后端分离的游戏创作平台 Demo，当前已完成阶段四工程化建设：
- 前后端容器化（Docker）
- 一键编排（Docker Compose）
- 自动化测试（pytest + vitest）
- CI 流水线（GitHub Actions）

## 项目结构
```text
.
├─ game-admin-demo/         # React + TypeScript + Vite 前端
├─ game_admin_backend/      # FastAPI 后端
├─ .github/workflows/       # CI 配置
├─ docs/
│  ├─ docker-compose.md     # 容器运行说明
│  ├─ testing.md            # 测试说明
│  ├─ ci.md                 # CI 说明
│  └─ review-checklist.md   # 代码评审清单
├─ docker-compose.yml       # 一键启动 frontend + backend + redis
└─ CONTRIBUTING.md          # 分支与协作规范
```

## 功能概览
- 登录认证（JWT）
- 项目管理（CRUD）
- 资源上传
- 异步任务状态流转（排队中 -> 进行中 -> 成功）
- 地图编辑器（网格绘制、预览、导入导出 JSON）

## 本地开发启动
### 后端
```bash
cd E:\project\re\game_admin_backend
python -m pip install -r requirements.txt
python run.py
```

### 前端
```bash
cd E:\project\re\game-admin-demo
corepack pnpm install
corepack pnpm dev
```

默认访问：
- 前端：`http://127.0.0.1:5173`
- 后端 Swagger：`http://127.0.0.1:8000/docs`

默认账号：
- 用户名：`bocai`
- 密码：`123456`

## Docker 一键启动
```bash
cd E:\project\re
docker compose up --build -d
```

查看状态：
```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

停止：
```bash
docker compose down
```

完整说明见：
- [docs/docker-compose.md](docs/docker-compose.md)
- [docs/deployment.md](docs/deployment.md)

## 测试与质量
### 后端测试
```bash
cd E:\project\re\game_admin_backend
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

### 前端测试与构建
```bash
cd E:\project\re\game-admin-demo
corepack pnpm lint
corepack pnpm test
corepack pnpm build
```

说明：
- 当前 ESLint 有 3 条 `react-hooks/exhaustive-deps` 警告，不阻断构建。

## CI
工作流文件：
- `.github/workflows/ci.yml`

包含检查：
- Backend Test
- Frontend Lint Test Build
- Docker Build Check

详细见：
- [docs/ci.md](docs/ci.md)

## 面试讲解提纲
- [docs/interview-talk-track.md](docs/interview-talk-track.md)

## 协作规范
- 分支与提交流程见 [CONTRIBUTING.md](CONTRIBUTING.md)
- 评审清单见 [docs/review-checklist.md](docs/review-checklist.md)
