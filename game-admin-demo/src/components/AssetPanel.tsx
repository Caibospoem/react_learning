import type { TileAsset } from '../types/map'

interface AssetPanelProps {
  tileAssets: TileAsset[]
  selectedTileId: string
  isEraseMode: boolean
  onSelectTile: (tileId: string) => void
}

function AssetPanel({
  tileAssets,
  selectedTileId,
  isEraseMode,
  onSelectTile,
}: AssetPanelProps) {
  return (
    <div
      style={{
        width: 240,
        borderRight: '1px solid #e5e7eb',
        background: '#fafafa',
        padding: 16,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: 18 }}>Asset Panel</h2>

      <div style={{ marginBottom: 12, fontSize: 14, color: '#666' }}>
        当前模式：{isEraseMode ? '擦除模式' : '绘制模式'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tileAssets.map((asset) => {
          const isSelected = !isEraseMode && selectedTileId === asset.id

          return (
            <div
              key={asset.id}
              onClick={() => onSelectTile(asset.id)}
              style={{
                display: 'flex',
                gap: 12,
                padding: 12,
                borderRadius: 10,
                border: isSelected ? '2px solid #1677ff' : '1px solid #d9d9d9',
                background: isSelected ? '#e6f4ff' : '#fff',
                cursor: 'pointer',
                alignItems: 'center',
              }}
            >
              <img
                src={asset.src}
                alt={asset.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  objectFit: 'cover',
                  border: '1px solid #eee',
                  background: '#fff',
                  flexShrink: 0,
                }}
              />

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{asset.name}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  {asset.description ?? '暂无描述'}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AssetPanel