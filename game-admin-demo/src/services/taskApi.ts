import http from "./http";
import type { Task } from "../types";

export type CreateTaskRequest = {
  name: string;
};

export const getTasksApi = async () => {
  const res = await http.get<Task[]>("/tasks");
  return res.data;
};

export const getTaskDetailApi = async (taskId: number) => {
  const res = await http.get<Task>(`/tasks/${taskId}`);
  return res.data;
};

export const createTaskApi = async (data: CreateTaskRequest) => {
  const res = await http.post<Task>("/tasks", data);
  return res.data;
};