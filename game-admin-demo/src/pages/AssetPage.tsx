import { useState } from "react";
import { mockAssets } from "../mock/data";

function AssetPage() {
  const [assets, setAssets] = useState(mockAssets);

  const handleDelete = (id: number) => {
    const nextList = assets.filter((item) => item.id !== id);
    setAssets(nextList);
  };

  return (
    <div>
      <div className="page-header">
        <h1>资源管理</h1>
        <button className="btn primary">上传资源</button>
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
            <span>{asset.type}</span>
            <span>{asset.size}</span>
            <span>{asset.projectName}</span>
            <span>
              <button className="btn danger" onClick={() => handleDelete(asset.id)}>
                删除
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetPage;