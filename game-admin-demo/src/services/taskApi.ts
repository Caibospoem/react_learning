import type { StudioTask, StudioTaskType } from "../types";
import http from "./http";

export const getStudioTasksApi = async (projectId?: number) => {
  const res = await http.get<StudioTask[]>("/studio/tasks", {
    params: projectId ? { project_id: projectId } : undefined,
  });
  return res.data;
};

export const getStudioTaskDetailApi = async (taskId: number) => {
  const res = await http.get<StudioTask>(`/studio/tasks/${taskId}`);
  return res.data;
};

export const createStudioTaskApi = async (params: {
  projectId: number;
  taskType: StudioTaskType;
  prompt?: string;
  payload?: Record<string, unknown>;
}) => {
  const res = await http.post<StudioTask>(`/studio/projects/${params.projectId}/tasks`, {
    task_type: params.taskType,
    prompt: params.prompt,
    payload: params.payload ?? {},
  });
  return res.data;
};

export const createGenerateTaskApi = async (projectId: number, prompt: string) => {
  const res = await http.post<StudioTask>(`/studio/projects/${projectId}/generate`, {
    prompt,
  });
  return res.data;
};

