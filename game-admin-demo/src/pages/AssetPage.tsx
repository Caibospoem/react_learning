import { useEffect, useState } from "react";
import { getAssetsApi, uploadAssetApi } from "../services/assetApi";
import type { Asset } from "../types";

function AssetPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      const data = await getAssetsApi();
      setAssets(data);
    } catch (error) {
      console.error(error);
      alert("获取资源列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadAssetApi(file);
      alert("上传成功");
      fetchAssets();
    } catch (error) {
      console.error(error);
      alert("上传失败");
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>资源管理</h1>
        <label className="btn primary">
          上传资源
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </label>
      </div>

      <div className="table">
        <div className="table-row table-head">
          <span>资源名</span>
          <span>类型</span>
          <span>大小</span>
          <span>所属项目</span>
          <span>操作</span>
        </div>

        {assets.map((asset) => (
          <div key={asset.id} className="table-row">
            <span>{asset.name}</span>
            <span>{asset.type ?? "-"}</span>
            <span>{asset.size ?? "-"}</span>
            <span>{asset.projectName ?? "-"}</span>
            <span>-</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetPage;