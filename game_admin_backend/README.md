# Game Admin Backend Demo

第二阶段后端 Demo，包含：
- JWT 登录
- 项目 CRUD
- 资源上传
- 任务创建与状态查询
- SQLite 持久化
- Redis 状态存储（不可用时自动回退到内存）

## 目录结构

```text
app/
  core/       配置与安全
  db/         数据库连接
  models/     SQLAlchemy 模型
  schemas/    请求/响应模型
  routers/    路由层
  services/   业务逻辑层
  storage/    上传文件目录
```

## 启动

```bash
pip install -r requirements.txt
python run.py
```

打开：
- http://127.0.0.1:8000/docs

## 默认账号
- 用户名：bocai
- 密码：123456

## 推荐测试顺序
1. `POST /api/auth/login`
2. 复制 `access_token`
3. 在 Swagger 右上角点 `Authorize`
4. 输入：`Bearer 你的token`
5. 调用受保护接口：
   - `GET /api/projects`
   - `POST /api/projects`
   - `POST /api/assets/upload`
   - `POST /api/tasks`
   - `GET /api/tasks/{id}`

## 示例请求体

### 创建项目
```json
{
  "name": "AI 横版冒险项目",
  "description": "用于生成 2D 关卡和角色配置",
  "status": "进行中",
  "owner": "bocai"
}
```

### 创建任务
```json
{
  "name": "打包 Web 试玩版"
}
```
