import type { MapData } from '../types/map'

interface PropertyPanelProps {
  selectedTileId: string
  hoverCell: {
    row: number
    col: number
  } | null
  mapData: MapData
  isEraseMode: boolean
}

function PropertyPanel({
  selectedTileId,
  hoverCell,
  mapData,
  isEraseMode,
}: PropertyPanelProps) {
  return (
    <div
      style={{
        width: 260,
        borderLeft: '1px solid #e5e7eb',
        background: '#fafafa',
        padding: 16,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: 18 }}>Property Panel</h2>

      <div style={{ lineHeight: 1.9, fontSize: 14 }}>
        <div>
          当前模式：<strong>{isEraseMode ? '擦除模式' : '绘制模式'}</strong>
        </div>
        <div>
          当前选中素材：<strong>{selectedTileId}</strong>
        </div>
        <div>
          当前 hover 格子：
          <strong>
            {hoverCell
              ? ` 第 ${hoverCell.row + 1} 行，第 ${hoverCell.col + 1} 列`
              : ' 未选中'}
          </strong>
        </div>
        <hr />
        <div>地图行数：{mapData.rows}</div>
        <div>地图列数：{mapData.cols}</div>
        <div>格子大小：{mapData.tileSize}</div>
        <div>已放置 tile 数量：{Object.keys(mapData.cells).length}</div>
      </div>
    </div>
  )
}

export default PropertyPanel