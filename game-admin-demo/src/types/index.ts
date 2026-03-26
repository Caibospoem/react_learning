export type ProjectStatus = "进行中" | "已发布" | "已归档";

export type TaskStatus = "排队中" | "进行中" | "成功" | "失败";

export type AssetType = "图片" | "音频" | "脚本" | "配置";

export type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  owner: string;
};

export type Asset = {
  id: number;
  name: string;
  type: AssetType;
  size: string;
  projectName: string;
};

export type Task = {
  id: number;
  name: string;
  status: TaskStatus;
  createdAt: string;
};