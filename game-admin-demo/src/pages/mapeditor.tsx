import { useState } from 'react'
import type { MapData, TileAsset, GridCell } from '../types/map'
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
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null)
  const [hoverCell, setHoverCell] = useState<GridCell | null>(null)
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
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [importJson, setImportJson] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const [importError, setImportError] = useState('')

  const [showGrid, setShowGrid] = useState(true)

  const isValidMapData = (data: unknown): data is MapData => {
    if (!data || typeof data !== 'object') return false

    const value = data as Record<string, unknown>

    if (typeof value.rows !== 'number') return false
    if (typeof value.cols !== 'number') return false
    if (typeof value.tileSize !== 'number') return false
    if (!value.cells || typeof value.cells !== 'object') return false

    return true
  }

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson)

      if (!isValidMapData(parsed)) {
        setImportError('JSON 结构不符合 MapData 要求')
        return
      }

      setMapData(parsed)
      setDraftRows(parsed.rows)
      setDraftCols(parsed.cols)
      setHoverCell(null)
      setSelectedCell(null)
      setImportError('')
      setImportSuccess('地图恢复成功')
    } catch {
      setImportError('JSON 解析失败，请检查格式是否正确')
    }
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
          const comfirmClear = window.confirm('确定要清空地图吗？此操作不可撤销')
          if (!comfirmClear) return
          setMapData(createEmptyMapData(mapData.rows, mapData.cols, mapData.tileSize))
          setHoverCell(null)
          setSelectedCell(null)
        }}
        onCreateNewMap={() => {
          const comfirmCreate = window.confirm('确定要创建新地图吗？此操作会丢失当前未保存的编辑内容')
          if (!comfirmCreate) return
          const nextRows = Math.max(1, draftRows)
          const nextCols = Math.max(1, draftCols)

          setMapData(createEmptyMapData(nextRows, nextCols, mapData.tileSize))
          setHoverCell(null)
          setSelectedCell(null)

          setDraftRows(nextRows)
          setDraftCols(nextCols)
        }}
        onExportJson={handleExportJson}
        mode={mode}
        onToggleMode={() => setMode((m) => (m === 'edit' ? 'preview' : 'edit'))}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
      />
      {
        mode === 'edit' ? (
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
                mode={mode}
                showGrid={showGrid}
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
              <div
                style={{
                  marginTop: 16,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <h3 style={{ marginTop: 0 }}>从 JSON 恢复地图</h3>

                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="把导出的地图 JSON 粘贴到这里"
                  style={{
                    width: '100%',
                    minHeight: 220,
                    fontFamily: 'monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    resize: 'vertical',
                  }}
                />

                <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                  <button
                    onClick={handleImportJson}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    恢复地图
                  </button>

                  <button
                    onClick={() => {
                      setImportJson(exportedJson)
                      setImportError('')
                      setImportSuccess('')
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    填入当前导出结果
                  </button>

                  <button 
                    onClick={() => {
                      setImportJson('')
                      setImportError('')
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    清空输入
                  </button>
                </div>
                {importSuccess && (
                  <p style={{ marginTop: 12, color: '#389e0d', fontSize: 14 }}>
                    {importSuccess}
                  </p>
                )}
                {importError && (
                  <p style={{ marginTop: 12, color: '#cf1322', fontSize: 14 }}>
                    {importError}
                  </p>
                )}

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
          <div style={{ flex: 1, padding: 24, background: '#f5f5f5' }}>
            <div
              style={{
                display: 'inline-block',
                background: '#fff',
                padding: 16,
                borderRadius: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
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
        )
      }
    </div>
  )
}

export default MapEditor
