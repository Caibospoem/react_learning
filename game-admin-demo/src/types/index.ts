export type ProjectStatus = string;
export type TaskStatus = string;
export type AssetType = "image" | "audio" | "json" | "config" | string;

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
  size: number;
  project_id: number | null;
  file_path: string;
  content_type: string | null;
  tags: string[];
  version_count: number;
  latest_version: number;
  preview_url: string | null;
};

export type AssetVersion = {
  id: number;
  asset_id: number;
  version_number: number;
  file_path: string;
  content_type: string | null;
  size: number;
  created_at: string;
};

export type Task = {
  id: number;
  name: string;
  status: TaskStatus;
  createdAt: string;
};

export type StudioTaskType = "GENERATE_MAP" | "PACKAGE_BUILD" | "PUBLISH_RELEASE";
export type StudioTaskStatus = "QUEUED" | "RUNNING" | "SUCCESS" | "FAILED";

export type StudioTask = {
  id: number;
  project_id: number | null;
  task_type: StudioTaskType;
  status: StudioTaskStatus;
  progress: number;
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  error: string | null;
  created_at: string;
  updated_at: string;
};

export type GeneratedMap = {
  rows: number;
  cols: number;
  tileSize: number;
  cells: Record<string, string>;
};

export type StudioVersion = {
  id: number;
  project_id: number;
  task_id: number | null;
  prompt: string;
  summary: string;
  map_data: GeneratedMap;
  asset_manifest: Array<{
    name: string;
    type: string;
    usage: string;
  }>;
  created_at: string;
};

