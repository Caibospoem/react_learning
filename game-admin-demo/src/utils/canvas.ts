import type { MapData } from "../types/map";

export const drawGrid = (
    ctx: CanvasRenderingContext2D,  
    mapData: MapData
) => {
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

export const drawSelectedCell = (
    ctx: CanvasRenderingContext2D,
    mapData: MapData,
    row: number,
    col: number
    ) => {
    const x = col * mapData.tileSize
    const y = row * mapData.tileSize

    ctx.strokeStyle = '#ff4d4f'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, mapData.tileSize, mapData.tileSize)
    }

export const drawHoverCell = (
    ctx: CanvasRenderingContext2D,
    mapData: MapData,
    row: number,
    col: number
  ) => {
    const x = col * mapData.tileSize
    const y = row * mapData.tileSize

    ctx.strokeStyle = '#1890ff'
    ctx.strokeRect(x, y, mapData.tileSize, mapData.tileSize)
  }

export const drawTiles = (
    ctx: CanvasRenderingContext2D,
    mapData: MapData,
    imageMap: Record<string, HTMLImageElement>
) => {
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