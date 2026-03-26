import http from "./http";
import type { Asset } from "../types";

export const getAssetsApi = async () => {
  const res = await http.get<Asset[]>("/assets");
  return res.data;
};

export const uploadAssetApi = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await http.post("/assets/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

