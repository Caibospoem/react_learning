import { useEffect, useMemo, useRef } from 'react'
import type { MapData, TileAsset } from '../types/map'
import { removeTileAtCell, setTileAtCell } from '../utils/map'

interface SceneCanvasProps {
  mapData: MapData
  setMapData: React.Dispatch<React.SetStateAction<MapData>>
  selectedTileId: string
  hoverCell: { row: number; col: number } | null
  setHoverCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>
  selectedCell: { row: number; col: number } | null
  setSelectedCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>
  isEraseMode: boolean
  tileAssets: TileAsset[]
  mode: 'edit' | 'preview'
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

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#d9d9d9'
    ctx.lineWidth = 1

    for (let col = 0; col <= mapData.cols; col++) {
      const x = col * mapData.tileSize
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, mapData.rows * mapData.tileSize)
      ctx.stroke()
    }

    for (let row = 0; row <= mapData.rows; row++) {
      const y = row * mapData.tileSize
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(mapData.cols * mapData.tileSize, y)
      ctx.stroke()
    }
  }

  const drawSelectedCell = (
    ctx: CanvasRenderingContext2D,
    row: number,
    col: number
    ) => {
    const x = col * mapData.tileSize
    const y = row * mapData.tileSize

    ctx.strokeStyle = '#ff4d4f'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, mapData.tileSize, mapData.tileSize)
    }

  const drawHoverCell = (
    ctx: CanvasRenderingContext2D,
    row: number,
    col: number
  ) => {
    const x = col * mapData.tileSize
    const y = row * mapData.tileSize

    ctx.strokeStyle = '#1890ff'
    ctx.strokeRect(x, y, mapData.tileSize, mapData.tileSize)
  }

  const drawTiles = (ctx: CanvasRenderingContext2D) => {
    Object.entries(mapData.cells).forEach(([key, tileId]) => {
      const [rowStr, colStr] = key.split('-')
      const row = Number(rowStr)
      const col = Number(colStr)

      const x = col * mapData.tileSize
      const y = row * mapData.tileSize

      const img = imageMap[String(tileId)]
      if (img && img.complete) {
        ctx.drawImage(img, x, y, mapData.tileSize, mapData.tileSize)
      } else {
        ctx.fillStyle = '#eee'
        ctx.fillRect(x, y, mapData.tileSize, mapData.tileSize)

        ctx.fillStyle = '#333'
        ctx.font = '10px sans-serif'
        ctx.fillText(String(tileId), x + 2, y + 16)
      }
    })
  }

  const redraw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawTiles(ctx)
    if (mode === 'edit') {
      drawGrid(ctx)
    }

    if (mode === 'edit' && hoverCell) {
      drawHoverCell(ctx, hoverCell.row, hoverCell.col)
    }

    if (mode === 'edit' && selectedCell) {
      drawSelectedCell(ctx, selectedCell.row, selectedCell.col)
    }
  }

  useEffect(() => {
    redraw()
  }, [mapData, imageMap, hoverCell, selectedCell])

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


  const getCellFromMouseEvent = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
    const cell = getCellFromMouseEvent(event)
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

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = getCellFromMouseEvent(event)
    setHoverCell(cell)
  }

  return (
    <canvas
      ref={canvasRef}
      width={mapData.cols * mapData.tileSize}
      height={mapData.rows * mapData.tileSize}
      onClick={handleCanvasClick}
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