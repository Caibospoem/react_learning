import http from "./http";

export type RuntimeInfo = {
  app_name: string;
  api_prefix: string;
  ai_mode: string;
  ai_provider: string;
  ai_model: string;
};

export const getRuntimeApi = async () => {
  const res = await http.get<RuntimeInfo>("/system/runtime");
  return res.data;
};

