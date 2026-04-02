import { useEffect, useState } from "react";
import {
  deleteAssetApi,
  getAssetsApi,
  getAssetVersionsApi,
  updateAssetTagsApi,
  uploadAssetApi,
  uploadAssetVersionApi,
} from "../services/assetApi";
import type { Asset, AssetVersion } from "../types";
import { getActiveProjectId, PROJECT_CHANGED_EVENT } from "../utils/activeProject";

function AssetPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadTags, setUploadTags] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<number | null>(getActiveProjectId());
  const [tagEditor, setTagEditor] = useState<Record<number, string>>({});
  const [versionMap, setVersionMap] = useState<Record<number, AssetVersion[]>>({});

  const loadAssets = async () => {
    setLoading(true);
    try {
      const list = await getAssetsApi(activeProjectId ?? undefined);
      setAssets(list);
      const nextEditor: Record<number, string> = {};
      list.forEach((asset) => {
        nextEditor[asset.id] = asset.tags.join(", ");
      });
      setTagEditor(nextEditor);
    } catch (error) {
      console.error(error);
      alert("Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssets();
  }, [activeProjectId]);

  useEffect(() => {
    const onProjectChanged = () => setActiveProjectId(getActiveProjectId());
    window.addEventListener(PROJECT_CHANGED_EVENT, onProjectChanged as EventListener);
    return () =>
      window.removeEventListener(PROJECT_CHANGED_EVENT, onProjectChanged as EventListener);
  }, []);

  const toTags = (rawValue: string) =>
    rawValue
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      await uploadAssetApi({
        file,
        projectId: activeProjectId ?? undefined,
        tags: toTags(uploadTags),
      });
      event.target.value = "";
      await loadAssets();
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  const handleUpdateTags = async (assetId: number) => {
    try {
      const raw = tagEditor[assetId] ?? "";
      await updateAssetTagsApi(assetId, toTags(raw));
      await loadAssets();
    } catch (error) {
      console.error(error);
      alert("Update tags failed.");
    }
  };

  const handleDelete = async (assetId: number) => {
    if (!window.confirm("Delete this asset and all versions?")) {
      return;
    }
    try {
      await deleteAssetApi(assetId);
      await loadAssets();
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  };

  const handleShowVersions = async (assetId: number) => {
    try {
      const versions = await getAssetVersionsApi(assetId);
      setVersionMap((previous) => ({ ...previous, [assetId]: versions }));
    } catch (error) {
      console.error(error);
      alert("Load versions failed.");
    }
  };

  const handleUploadVersion = async (assetId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      await uploadAssetVersionApi(assetId, file);
      event.target.value = "";
      await Promise.all([loadAssets(), handleShowVersions(assetId)]);
    } catch (error) {
      console.error(error);
      alert("Upload version failed.");
    }
  };

  const renderPreview = (asset: Asset) => {
    if (!asset.preview_url) {
      return <span>-</span>;
    }
    if (asset.type === "image") {
      return <img src={asset.preview_url} alt={asset.name} className="asset-thumb" />;
    }
    if (asset.type === "audio") {
      return <audio controls src={asset.preview_url} className="audio-preview" />;
    }
    return (
      <a href={asset.preview_url} target="_blank" rel="noreferrer">
        Open
      </a>
    );
  };

  if (loading) {
    return <div>Loading assets...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>资源管理</h1>
        <label className="btn primary">
          Upload Asset
          <input type="file" hidden onChange={handleUpload} />
        </label>
      </div>
      <div className="toolbar">
        <input
          className="input"
          value={uploadTags}
          onChange={(event) => setUploadTags(event.target.value)}
          placeholder="Upload tags: ui, bgm, config"
        />
        <span className="muted">
          {activeProjectId ? `Current project: ${activeProjectId}` : "No project selected"}
        </span>
      </div>

      <div className="table">
        <div className="table-row table-head asset-row">
          <span>Name</span>
          <span>Type</span>
          <span>Preview</span>
          <span>Tags</span>
          <span>Versions</span>
          <span>Actions</span>
        </div>
        {assets.map((asset) => (
          <div key={asset.id} className="asset-block">
            <div className="table-row asset-row">
              <span>{asset.name}</span>
              <span>{asset.type}</span>
              <span>{renderPreview(asset)}</span>
              <span>
                <input
                  className="input"
                  value={tagEditor[asset.id] ?? ""}
                  onChange={(event) =>
                    setTagEditor((previous) => ({ ...previous, [asset.id]: event.target.value }))
                  }
                />
              </span>
              <span>
                v{asset.latest_version} / {asset.version_count}
              </span>
              <span className="table-actions">
                <button className="btn" onClick={() => handleUpdateTags(asset.id)}>
                  Save Tags
                </button>
                <button className="btn" onClick={() => void handleShowVersions(asset.id)}>
                  Versions
                </button>
                <label className="btn">
                  Upload Version
                  <input
                    type="file"
                    hidden
                    onChange={(event) => void handleUploadVersion(asset.id, event)}
                  />
                </label>
                <button className="btn danger" onClick={() => void handleDelete(asset.id)}>
                  Delete
                </button>
              </span>
            </div>
            {versionMap[asset.id] && versionMap[asset.id].length > 0 && (
              <div className="version-table">
                {versionMap[asset.id].map((version) => (
                  <div key={version.id} className="version-row">
                    <span>v{version.version_number}</span>
                    <span>{version.content_type ?? "-"}</span>
                    <span>{new Date(version.created_at).toLocaleString()}</span>
                    <a
                      href={`/api/assets/${asset.id}/versions/${version.id}/raw`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetPage;

