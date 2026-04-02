import { useEffect, useState } from "react";
import AssetPanel from "../components/AssetPanel";
import PropertyPanel from "../components/PropertyPanel";
import SceneCanvas from "../components/SceneCanvas";
import Toolbar from "../components/Toolbar";
import { getStudioVersionsApi, saveStudioVersionApi } from "../services/studioApi";
import type { GeneratedMap, StudioVersion } from "../types";
import type { GridCell, MapData, TileAsset } from "../types/map";
import { getActiveProjectId } from "../utils/activeProject";
import { consumeMapEditorImportPayload } from "../utils/mapEditorBridge";
import { createEmptyMapData, isMapData } from "../utils/map";

const TILE_SIZE = 32;
const DEFAULT_COLS = 20;
const DEFAULT_ROWS = 15;

const tileAssets: TileAsset[] = [
  { id: "grass", name: "Grass", src: "/tiles/grass.png", description: "Basic ground." },
  { id: "water", name: "Water", src: "/tiles/water.png", description: "Water or hazard." },
  { id: "wall", name: "Wall", src: "/tiles/wall.png", description: "Solid obstacle." },
  { id: "ground", name: "Ground (AI)", src: "/tiles/grass.png", description: "AI generated terrain." },
  { id: "platform", name: "Platform (AI)", src: "/tiles/wall.png", description: "AI generated platform." },
  { id: "spike", name: "Spike (AI)", src: "/tiles/wall.png", description: "AI generated trap." },
];

const toEditorMapData = (map: GeneratedMap): MapData => ({
  rows: map.rows,
  cols: map.cols,
  tileSize: map.tileSize,
  cells: map.cells,
});

function MapEditor() {
  const [selectedTileId, setSelectedTileId] = useState<string>("ground");
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [hoverCell, setHoverCell] = useState<GridCell | null>(null);
  const [mapData, setMapData] = useState<MapData>(createEmptyMapData(DEFAULT_ROWS, DEFAULT_COLS, TILE_SIZE));
  const [isEraseMode, setIsEraseMode] = useState(false);
  const [draftRows, setDraftRows] = useState(DEFAULT_ROWS);
  const [draftCols, setDraftCols] = useState(DEFAULT_COLS);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [showGrid, setShowGrid] = useState(true);
  const [exportedJson, setExportedJson] = useState("");
  const [importJson, setImportJson] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importError, setImportError] = useState("");
  const [sourceLabel, setSourceLabel] = useState("Manual map");
  const [sourcePrompt, setSourcePrompt] = useState("Edited in map editor");
  const [loadingGenerated, setLoadingGenerated] = useState(false);
  const [savingVersion, setSavingVersion] = useState(false);

  const applyMapData = (nextMap: MapData, source: string, prompt = "Edited in map editor") => {
    setMapData(nextMap);
    setDraftRows(nextMap.rows);
    setDraftCols(nextMap.cols);
    setHoverCell(null);
    setSelectedCell(null);
    setImportError("");
    setImportSuccess(`Map loaded from ${source}.`);
    setSourceLabel(source);
    setSourcePrompt(prompt);
  };

  useEffect(() => {
    const payload = consumeMapEditorImportPayload();
    if (!payload) {
      return;
    }
    const versionText = payload.source?.versionId ? `Studio version #${payload.source.versionId}` : "Studio payload";
    applyMapData(payload.mapData, versionText, payload.source?.prompt ?? "Edited in map editor");
  }, []);

  const handleLoadLatestGenerated = async () => {
    const projectId = getActiveProjectId();
    if (!projectId) {
      alert("Please select an active project first.");
      return;
    }
    setLoadingGenerated(true);
    try {
      const versions = await getStudioVersionsApi(projectId);
      if (versions.length === 0) {
        alert("No generated version found for this project.");
        return;
      }
      const latest: StudioVersion = versions[0];
      const loadedMap = toEditorMapData(latest.map_data);
      if (!isMapData(loadedMap)) {
        alert("Generated map format is invalid.");
        return;
      }
      applyMapData(loadedMap, `Studio version #${latest.id}`, latest.prompt);
    } catch (error) {
      console.error(error);
      alert("Failed to load generated map.");
    } finally {
      setLoadingGenerated(false);
    }
  };

  const handleSaveVersion = async () => {
    const projectId = getActiveProjectId();
    if (!projectId) {
      alert("Please select an active project first.");
      return;
    }
    setSavingVersion(true);
    try {
      const saved = await saveStudioVersionApi(projectId, {
        prompt: sourcePrompt,
        summary: `Saved from map editor (${mapData.rows}x${mapData.cols})`,
        map_data: {
          rows: mapData.rows,
          cols: mapData.cols,
          tileSize: mapData.tileSize,
          cells: mapData.cells,
        },
        asset_manifest: [],
      });
      setImportSuccess(`Map saved as version #${saved.id}.`);
      setSourceLabel(`Studio version #${saved.id}`);
    } catch (error) {
      console.error(error);
      setImportError("Failed to save map version.");
    } finally {
      setSavingVersion(false);
    }
  };

  const handleExportJson = () => {
    setExportedJson(JSON.stringify(mapData, null, 2));
  };

  const handleCopyJson = async () => {
    if (!exportedJson) {
      return;
    }
    await navigator.clipboard.writeText(exportedJson);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (!isMapData(parsed)) {
        setImportError("JSON structure is invalid for MapData.");
        return;
      }
      applyMapData(parsed, "custom JSON");
    } catch {
      setImportError("JSON parse failed. Please check format.");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Toolbar
        isEraseMode={isEraseMode}
        draftRows={draftRows}
        draftCols={draftCols}
        onDraftRowsChange={setDraftRows}
        onDraftColsChange={setDraftCols}
        onToggleEraseMode={() => setIsEraseMode((value) => !value)}
        onClearMap={() => {
          const shouldClear = window.confirm("Clear all tiles in current map?");
          if (!shouldClear) {
            return;
          }
          setMapData(createEmptyMapData(mapData.rows, mapData.cols, mapData.tileSize));
          setHoverCell(null);
          setSelectedCell(null);
          setSourceLabel("Manual map");
          setSourcePrompt("Edited in map editor");
        }}
        onCreateNewMap={() => {
          const shouldCreate = window.confirm("Create a new empty map? Unsaved edits will be lost.");
          if (!shouldCreate) {
            return;
          }
          const rows = Math.max(1, draftRows);
          const cols = Math.max(1, draftCols);
          applyMapData(createEmptyMapData(rows, cols, mapData.tileSize), "new blank map");
        }}
        onExportJson={handleExportJson}
        mode={mode}
        onToggleMode={() => setMode((value) => (value === "edit" ? "preview" : "edit"))}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
      />

      <div
        style={{
          padding: "8px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 13, color: "#666" }}>Current source: {sourceLabel}</span>
        <button className="btn" onClick={() => void handleLoadLatestGenerated()} disabled={loadingGenerated}>
          {loadingGenerated ? "Loading..." : "Load Latest Generated Map"}
        </button>
        <button className="btn primary" onClick={() => void handleSaveVersion()} disabled={savingVersion}>
          {savingVersion ? "Saving..." : "Save Map Version"}
        </button>
      </div>

      {mode === "edit" ? (
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <AssetPanel
            tileAssets={tileAssets}
            selectedTileId={selectedTileId}
            isEraseMode={isEraseMode}
            onSelectTile={(tileId) => {
              setSelectedTileId(tileId);
              setIsEraseMode(false);
            }}
          />

          <div
            style={{
              flex: 1,
              padding: 24,
              overflow: "auto",
              background: "#f5f5f5",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Scene Canvas</h2>
            <SceneCanvas
              mapData={mapData}
              setMapData={setMapData}
              selectedTileId={selectedTileId}
              hoverCell={hoverCell}
              setHoverCell={setHoverCell}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              isEraseMode={isEraseMode}
              tileAssets={tileAssets}
              mode={mode}
              showGrid={showGrid}
            />

            {exportedJson && (
              <div
                style={{
                  marginTop: 16,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <h3 style={{ margin: 0 }}>Export JSON</h3>
                  <button className="btn" onClick={() => void handleCopyJson()}>
                    Copy JSON
                  </button>
                </div>
                <textarea
                  value={exportedJson}
                  readOnly
                  style={{
                    width: "100%",
                    minHeight: 220,
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 1.5,
                    resize: "vertical",
                  }}
                />
              </div>
            )}

            <div
              style={{
                marginTop: 16,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <h3 style={{ marginTop: 0 }}>Import JSON</h3>
              <textarea
                value={importJson}
                onChange={(event) => setImportJson(event.target.value)}
                placeholder="Paste map JSON here"
                style={{
                  width: "100%",
                  minHeight: 220,
                  fontFamily: "monospace",
                  fontSize: 13,
                  lineHeight: 1.5,
                  resize: "vertical",
                }}
              />
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn" onClick={handleImportJson}>
                  Import Map
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setImportJson(exportedJson);
                    setImportError("");
                    setImportSuccess("");
                  }}
                >
                  Fill with Exported JSON
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setImportJson("");
                    setImportError("");
                    setImportSuccess("");
                  }}
                >
                  Clear Input
                </button>
              </div>
              {importSuccess && <p style={{ marginTop: 12, color: "#389e0d", fontSize: 14 }}>{importSuccess}</p>}
              {importError && <p style={{ marginTop: 12, color: "#cf1322", fontSize: 14 }}>{importError}</p>}
            </div>
          </div>

          <PropertyPanel
            selectedTileId={selectedTileId}
            hoverCell={hoverCell}
            selectedCell={selectedCell}
            mapData={mapData}
            isEraseMode={isEraseMode}
          />
        </div>
      ) : (
        <div style={{ flex: 1, padding: 24, background: "#f5f5f5" }}>
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <SceneCanvas
              mapData={mapData}
              setMapData={setMapData}
              selectedTileId={selectedTileId}
              hoverCell={hoverCell}
              setHoverCell={setHoverCell}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              isEraseMode={isEraseMode}
              tileAssets={tileAssets}
              mode={mode}
              showGrid={showGrid}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MapEditor;
