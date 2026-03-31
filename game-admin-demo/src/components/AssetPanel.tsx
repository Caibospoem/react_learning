import type { TileAsset } from '../types/map'

interface AssetPanelProps {
  tileAssets: TileAsset[]
  selectedTileId: string
  onSelectTile: (tileId: string) => void
}

function AssetPanel({
  tileAssets,
  selectedTileId,
  onSelectTile,
}: AssetPanelProps) {
  return (
    <div
      style={{
        width: 220,
        borderRight: '1px solid #e5e7eb',
        background: '#fafafa',
        padding: 16,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: 18 }}>Asset Panel</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tileAssets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => onSelectTile(asset.id)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              border:
                selectedTileId === asset.id
                  ? '2px solid #1677ff'
                  : '1px solid #ccc',
              background:
                selectedTileId === asset.id ? '#e6f4ff' : '#fff',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {asset.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AssetPanel