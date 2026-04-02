import type { MapData } from "../types/map";
import { isMapData } from "./map";

const MAP_EDITOR_IMPORT_KEY = "mapEditorImportPayload";

type MapEditorImportPayload = {
  mapData: MapData;
  source?: {
    projectId?: number;
    versionId?: number;
    prompt?: string;
  };
};

export const setMapEditorImportPayload = (payload: MapEditorImportPayload) => {
  localStorage.setItem(MAP_EDITOR_IMPORT_KEY, JSON.stringify(payload));
};

export const consumeMapEditorImportPayload = (): MapEditorImportPayload | null => {
  const rawValue = localStorage.getItem(MAP_EDITOR_IMPORT_KEY);
  if (!rawValue) {
    return null;
  }
  localStorage.removeItem(MAP_EDITOR_IMPORT_KEY);
  try {
    const parsed = JSON.parse(rawValue) as MapEditorImportPayload;
    if (!parsed || !isMapData(parsed.mapData)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

