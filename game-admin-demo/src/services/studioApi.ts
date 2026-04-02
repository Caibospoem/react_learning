import type { StudioVersion } from "../types";
import http from "./http";

export const getStudioVersionsApi = async (projectId: number) => {
  const res = await http.get<StudioVersion[]>(`/studio/projects/${projectId}/versions`);
  return res.data;
};

