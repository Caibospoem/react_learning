import type { Project } from "../types";
import http from "./http";

export type CreateProjectRequest = {
  name: string;
  description: string;
  owner: string;
};

export type ProjectStatusAlias = "IN_PROGRESS" | "PUBLISHED" | "ARCHIVED";

export const getProjectsApi = async () => {
  const res = await http.get<Project[]>("/studio/projects");
  return res.data;
};

export const createProjectApi = async (data: CreateProjectRequest) => {
  const res = await http.post<Project>("/studio/projects", data);
  return res.data;
};

export const cloneProjectApi = async (projectId: number, name?: string) => {
  const res = await http.post<Project>(`/studio/projects/${projectId}/clone`, {
    name,
  });
  return res.data;
};

export const updateProjectStatusApi = async (
  projectId: number,
  status: ProjectStatusAlias,
) => {
  const res = await http.patch<Project>(`/studio/projects/${projectId}/status`, { status });
  return res.data;
};

export const deleteProjectApi = async (projectId: number) => {
  await http.delete(`/studio/projects/${projectId}`);
};
