import type { Asset, Project, Task } from "../types";

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "AI 横版冒险项目",
    description: "用于生成 2D 横版关卡和角色配置的创作项目",
    status: "进行中",
    owner: "bocai",
  },
  {
    id: 2,
    name: "像素 RPG 地图编辑器",
    description: "支持地图资源上传、配置和预览",
    status: "已发布",
    owner: "admin",
  },
  {
    id: 3,
    name: "卡牌战斗原型",
    description: "面向独立开发者的战斗 Demo 项目",
    status: "已归档",
    owner: "test_user",
  },
];

export const mockAssets: Asset[] = [
  {
    id: 1,
    name: "hero_idle.png",
    type: "图片",
    size: "256KB",
    projectName: "AI 横版冒险项目",
  },
  {
    id: 2,
    name: "battle_bgm.mp3",
    type: "音频",
    size: "3.2MB",
    projectName: "卡牌战斗原型",
  },
  {
    id: 3,
    name: "map_config.json",
    type: "配置",
    size: "18KB",
    projectName: "像素 RPG 地图编辑器",
  },
  {
    id: 4,
    name: "enemy_ai.ts",
    type: "脚本",
    size: "12KB",
    projectName: "AI 横版冒险项目",
  },
];

export const mockTasks: Task[] = [
  {
    id: 1,
    name: "打包 Web 试玩版",
    status: "进行中",
    createdAt: "2026-03-25 10:20",
  },
  {
    id: 2,
    name: "生成关卡资源",
    status: "排队中",
    createdAt: "2026-03-25 10:25",
  },
  {
    id: 3,
    name: "发布到社区",
    status: "成功",
    createdAt: "2026-03-25 09:50",
  },
  {
    id: 4,
    name: "构建 Android 包",
    status: "失败",
    createdAt: "2026-03-25 09:10",
  },
];