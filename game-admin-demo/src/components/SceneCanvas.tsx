import { useEffect, useMemo, useRef } from 'react'
import type { MapData, TileAsset, GridCell } from '../types/map'
import { removeTileAtCell, setTileAtCell } from '../utils/map'
import { drawGrid, drawHoverCell, drawSelectedCell, drawTiles } from '../utils/canvas'

interface SceneCanvasProps {
  mapData: MapData
  setMapData: React.Dispatch<React.SetStateAction<MapData>>
  selectedTileId: string
  hoverCell: GridCell | null
  setHoverCell: React.Dispatch<React.SetStateAction<GridCell | null>>
  selectedCell: GridCell | null
  setSelectedCell: React.Dispatch<React.SetStateAction<GridCell | null>>
  isEraseMode: boolean
  tileAssets: TileAsset[]
  mode: 'edit' | 'preview'
  showGrid: boolean
}

function SceneCanvas({
  mapData,
  setMapData,
  selectedTileId,
  hoverCell,
  setHoverCell,
  selectedCell,
  setSelectedCell,
  isEraseMode,
  tileAssets,
  mode,
  showGrid,
}: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const imageMap = useMemo(() => {
    const map: Record<string, HTMLImageElement> = {}

    tileAssets.forEach((asset) => {
      const img = new Image()
      img.src = asset.src
      map[asset.id] = img
    })

    return map
  }, [tileAssets])

  const redraw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawTiles(ctx, mapData, imageMap)
    if (showGrid && mode === 'edit') {
      drawGrid(ctx, mapData)
    }

    if (mode === 'edit' && hoverCell) {
      drawHoverCell(ctx, mapData, hoverCell.row, hoverCell.col)
    }

    if (mode === 'edit' && selectedCell) {
      drawSelectedCell(ctx, mapData, selectedCell.row, selectedCell.col)
    }
  }

  useEffect(() => {
    redraw()
  }, [mapData, imageMap, hoverCell, selectedCell, mode, showGrid])

  useEffect(() => {
    const images = Object.values(imageMap)

    let loadedCount = 0

    images.forEach((img) => {
      if (img.complete) {
        loadedCount += 1
      } else {
        img.onload = () => {
          loadedCount += 1
          if (loadedCount <= images.length) {
            redraw()
          }
        }
      }
    })

    redraw()
  }, [imageMap])


  const getGridCellFromMouseEvent = (event: React.MouseEvent<HTMLCanvasElement>): GridCell | null => {
        const canvas = canvasRef.current
        if (!canvas) return null

        const rect = canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const col = Math.floor(mouseX / mapData.tileSize)
        const row = Math.floor(mouseY / mapData.tileSize)

        if (col < 0 || col >= mapData.cols || row < 0 || row >= mapData.rows) {
            return null
        }

        return { row, col }
    }
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getGridCellFromMouseEvent(event)
    if (!cell) return

    setSelectedCell(cell)

    const key = `${cell.row}-${cell.col}`
    const currentTile = mapData.cells[key]

    if (mode === 'edit') {
      if (isEraseMode || currentTile === selectedTileId) {
        setMapData((prev) => removeTileAtCell(prev, cell.row, cell.col))
      } else {
        setMapData((prev) => setTileAtCell(prev, cell.row, cell.col, selectedTileId))
      }
    }
  }
  const handleCanvasRightClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault()  // 阻止默认的右键菜单弹出

    const cell = getGridCellFromMouseEvent(event)
    if (!cell) return

    setSelectedCell(cell)
    setMapData((prev) => removeTileAtCell(prev, cell.row, cell.col))
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getGridCellFromMouseEvent(event)
    setHoverCell(cell)
  }

  return (
    <canvas
      ref={canvasRef}
      width={mapData.cols * mapData.tileSize}
      height={mapData.rows * mapData.tileSize}
      onClick={handleCanvasClick}
      onContextMenu={handleCanvasRightClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverCell(null)}
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        cursor: 'pointer',
        background: '#fff',
      }}
    />
  )
}

export default SceneCanvas
