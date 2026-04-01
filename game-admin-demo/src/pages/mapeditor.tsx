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