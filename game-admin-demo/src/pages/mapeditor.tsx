import { useState } from 'react'
import type { MapData, TileAsset } from '../types/map'
import { createEmptyMapData } from '../utils/map'
import Toolbar from '../components/Toolbar'
import AssetPanel from '../components/AssetPanel'
import PropertyPanel from '../components/PropertyPanel'
import SceneCanvas from '../components/SceneCanvas'

const TILE_SIZE = 32
const COLS = 20
const ROWS = 15

const tileAssets: TileAsset[] = [
  { id: 'grass', name: '草地', src: '/tiles/grass.png', description: '基础地表' },
  { id: 'water', name: '水面', src: '/tiles/water.png', description: '不可通行区域' },
  { id: 'wall', name: '墙体', src: '/tiles/wall.png', description: '阻挡物' },
]

function MapEditor() {
  const [selectedTileId, setSelectedTileId] = useState<string>('water')
  const [selectedCell, setSelectedCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [hoverCell, setHoverCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [mapData, setMapData] = useState<MapData>(
    createEmptyMapData(ROWS, COLS, TILE_SIZE)
  )
  const [isEraseMode, setIsEraseMode] = useState(false)
  const [draftRows, setDraftRows] = useState(ROWS)
  const [draftCols, setDraftCols] = useState(COLS)

  const [exportedJson, setExportedJson] = useState('')
  const handleExportJson = () => {
    const json = JSON.stringify(mapData, null, 2)
    setExportedJson(json)
  }
  const handleCopyJson = async () => {
    if (!exportedJson) return
    await navigator.clipboard.writeText(exportedJson)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        isEraseMode={isEraseMode}
        draftRows={draftRows}
        draftCols={draftCols}
        onDraftRowsChange={setDraftRows}
        onDraftColsChange={setDraftCols}
        onToggleEraseMode={() => setIsEraseMode((v) => !v)}
        onClearMap={() => {
          setMapData(createEmptyMapData(mapData.rows, mapData.cols, mapData.tileSize))
          setHoverCell(null)
          setSelectedCell(null)
        }}
        onCreateNewMap={() => {
          const nextRows = Math.max(1, draftRows)
          const nextCols = Math.max(1, draftCols)

          setMapData(createEmptyMapData(nextRows, nextCols, mapData.tileSize))
          setHoverCell(null)
          setSelectedCell(null)

          setDraftRows(nextRows)
          setDraftCols(nextCols)
        }}
        onExportJson={handleExportJson}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <AssetPanel
          tileAssets={tileAssets}
          selectedTileId={selectedTileId}
          isEraseMode={isEraseMode}
          onSelectTile={(tileId) => {
            setSelectedTileId(tileId)
            setIsEraseMode(false)
          }}
        />

        <div
          style={{
            flex: 1,
            padding: 24,
            overflow: 'auto',
            background: '#f5f5f5',
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
          />
          {exportedJson && (
            <div
              style={{
                marginTop: 16,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  height: 72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  borderBottom: '1px solid #e5e7eb',
                  background: '#fff',
                  flexShrink: 0,
                  gap: 16,
                }}
              >
                <h3 style={{ marginTop: 0 }}>导出结果</h3>
                <button
                  onClick={handleCopyJson}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                  >复制 JSON</button>
              </div>
              <textarea
                value={exportedJson}
                readOnly
                style={{
                  width: '100%',
                  minHeight: 240,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
              />
            </div>
          )}
        </div>

        <PropertyPanel
          selectedTileId={selectedTileId}
          hoverCell={hoverCell}
          selectedCell={selectedCell}
          mapData={mapData}
          isEraseMode={isEraseMode}
        />
      </div>
    </div>
  )
}

export default MapEditor