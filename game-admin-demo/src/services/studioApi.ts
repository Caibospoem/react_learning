import type { StudioVersion, StudioVersionSaveRequest } from "../types";
import http from "./http";

export const getStudioVersionsApi = async (projectId: number) => {
  const res = await http.get<StudioVersion[]>(`/studio/projects/${projectId}/versions`);
  return res.data;
};

export const saveStudioVersionApi = async (projectId: number, data: StudioVersionSaveRequest) => {
  const res = await http.post<StudioVersion>(`/studio/projects/${projectId}/versions`, data);
  return res.data;
};
