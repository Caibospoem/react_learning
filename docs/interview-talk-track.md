# Interview Talk Track (Phase 4)

## 1) 代码如何组织
- 前端和后端分目录独立维护，职责清晰。
- 后端按 `routers/services/models/schemas` 分层，便于扩展和测试。
- 工程规范集中在 `CONTRIBUTING.md` 与评审清单中，减少协作摩擦。

## 2) 如何自动化构建
- GitHub Actions 在 PR 自动执行三类检查：
  - Backend Test
  - Frontend Lint Test Build
  - Docker Build Check
- 所有改动在合并前必须通过流水线，降低回归风险。

## 3) 如何保证质量
- 后端使用 `pytest` 覆盖认证、项目 CRUD、任务状态流转。
- 前端使用 `vitest` 覆盖地图核心工具函数。
- Lint + Test + Build 都在 CI 里执行，形成基础质量门禁。

## 4) 如何部署
- 使用 `docker-compose.yml` 一键拉起 `frontend + backend + redis`。
- 数据通过 Docker volume 持久化。
- 文档化了运行、验证、停止、清理流程，便于交接。

## 5) 你可以强调的工程亮点
- 从“能跑”升级到“可重复构建、可验证、可协作”。
- 同时覆盖了本地开发、容器化、测试、CI、文档。
- 分支保护把工程化能力落到流程，而不是停留在口头规范。
