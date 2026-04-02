import type { Asset, AssetVersion } from "../types";
import http from "./http";

export const getAssetsApi = async (projectId?: number) => {
  const res = await http.get<Asset[]>("/assets", {
    params: projectId ? { project_id: projectId } : undefined,
  });
  return res.data;
};

export const uploadAssetApi = async (params: {
  file: File;
  projectId?: number;
  tags?: string[];
}) => {
  const formData = new FormData();
  formData.append("file", params.file);
  if (params.projectId) {
    formData.append("project_id", String(params.projectId));
  }
  if (params.tags && params.tags.length > 0) {
    formData.append("tags", JSON.stringify(params.tags));
  }
  const res = await http.post<Asset>("/assets/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateAssetTagsApi = async (assetId: number, tags: string[]) => {
  const res = await http.patch<Asset>(`/assets/${assetId}/tags`, { tags });
  return res.data;
};

export const deleteAssetApi = async (assetId: number) => {
  await http.delete(`/assets/${assetId}`);
};

export const getAssetVersionsApi = async (assetId: number) => {
  const res = await http.get<AssetVersion[]>(`/assets/${assetId}/versions`);
  return res.data;
};

export const uploadAssetVersionApi = async (assetId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await http.post<AssetVersion>(`/assets/${assetId}/versions`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

