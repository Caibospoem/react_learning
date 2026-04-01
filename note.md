26.3.30更新

优化格子高亮页：

​	现在可以实时反应鼠标选中的位置信息啦！

新增图形编辑页：

​	临时建立一个简单的数据模型，通过选择对象，点击地图放置对象。

26.3.31更新

优化地图数据格式：

​	新建地图数据type，使用MapData进行渲染地图。

添加新的功能：

​	现在可以选择绘制模式 or 清除模式来进行地图的绘制和清除。

​	就算在绘制模式的情况下也可以通过第二次点击来进行图形清除。

​	添加清空地图功能，点击清除地图就可以新建一张新的地图。

​	清空地图时同时清空hover并显示未选中。

目前进度：

​	已经做出了一个 2D 地图编辑器的雏形。它支持网格绘制、素材选择、点击摆放、擦除、hover 和选中格子显示。项目内部使用 MapData 作为地图数据模型，Canvas 根据 MapData 进行重绘，符合数据驱动渲染的编辑器思路。

26.3.31第二次更新

分离地图编辑器组件：

​	Tool bar（顶部工具栏）：切换编辑模式、清空地图

​	Asset Panel（左侧素材面板）：展示素材列表、切换当前选中素材

​	Scene Canvas（中间画布）：canvas 绘制、点击格子、hover 格子、更新地图数据

​	Property Panel（右侧属性面板）：显示当前素材、显示 hover 格子、显示地图信息

优化Asset Panel：

​	添加了描述信息，并且现在可以显示素材的预览图啦！

26.4.1 第一次更新

自定义地图大小：

​	新建地图前选择地图的大小

添加地图预览模式：

​	进入预览模式后目前不能进行任何操作

​	去除网格线

导出和导入地图数据：

​	点击导出JSON导出地图数据，下面可预览

​	可以将地图数据粘贴至恢复地图数据栏，点击恢复地图。如果是合法数据则恢复地图

优化用户体验：

​	选择是否显示网格

​	右键可以删除元素

​	新建和清空地图时弹出警告确认



26.4.1第二次更新

前后端已Docker化：

​	后端容器使用 uvicorn app.main:app --host 0.0.0.0 --port 8000

​	前端容器 pnpm build 后由 Nginx 托管静态资源

​	Nginx 已把 /api/* 反向代理到 http://backend:8000（为后续 docker-compose 服务名做准备）

补充前后端基建测试：

​	后端 pytest 基建与接口测试

​	前端 vitest 基建与首批用例

​	顺手修复了一个会阻断 lint 的错误

接上CI：

​	现在的 CI 会在 pull_request 和推送到 main/develop/feature/** 时运行 3 个 job：

1. Backend Test：安装 requirements-dev.txt 并执行 pytest
2. Frontend Lint Test Build：执行 pnpm lint、pnpm test、pnpm build
3. Docker Build Check：校验 docker-compose.yml 并构建前后端镜像
