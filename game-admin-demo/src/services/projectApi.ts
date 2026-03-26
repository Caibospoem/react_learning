import http from "./http";
import type { Project } from "../types";

export type CreateProjectRequest = {
  name: string;
  description: string;
  owner: string;
};

export const getProjectsApi = async () => {
  const res = await http.get<Project[]>("/projects");
  return res.data;
};

export const createProjectApi = async (data: CreateProjectRequest) => {
  const res = await http.post<Project>("/projects", data);
  return res.data;
};