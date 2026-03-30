import { useEffect, useMemo, useRef, useState } from 'react'

const TILE_SIZE = 32
const COLS = 20
const ROWS = 15

const tileAssets = [
    { id: 'grass', name: '草地', src: '/tiles/grass.png' },
    { id: 'water', name: '水面', src: '/tiles/water.png' },
    { id: 'wall', name: '墙体', src: '/tiles/wall.png' },
]

    function tilesput() {
        const canvasRef = useRef<HTMLCanvasElement | null>(null)

        const [selectedTileId, setSelectedTileId] = useState<string>('water')
        const [hoverCell, setHoverCell] = useState<{
            row: number
            col: number
        } | null>(null)
        const [placedTiles, setPlacedTiles] = useState<Record<string, string>>({})

        const imageMap = useMemo(() => {
            const map: Record<string, HTMLImageElement> = {}

            tileAssets.forEach((asset) => {
                const img = new Image()
                img.src = asset.src
                map[asset.id] = img
            })

            return map
    }, [])

    const drawGrid = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = '#d9d9d9'
        ctx.lineWidth = 1

        for (let col = 0; col <= COLS; col++) {
            const x = col * TILE_SIZE
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, ROWS * TILE_SIZE)
            ctx.stroke()
        }

        for (let row = 0; row <= ROWS; row++) {
            const y = row * TILE_SIZE
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(COLS * TILE_SIZE, y)
            ctx.stroke()
        }
    }

    const drawHoverCell = (
        ctx: CanvasRenderingContext2D,
        row: number,
        col: number
    ) => {
        const x = col * TILE_SIZE
        const y = row * TILE_SIZE

        ctx.strokeStyle = '#1890ff'
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE)
    }


    const drawTiles = (ctx: CanvasRenderingContext2D) => {
        Object.entries(placedTiles).forEach(([key, tileId]) => {
            const [rowStr, colStr] = key.split('-')
            const row = Number(rowStr)
            const col = Number(colStr)

            const x = col * TILE_SIZE
            const y = row * TILE_SIZE

            const img = imageMap[tileId]
            if (img && img.complete) {
                ctx.drawImage(img, x, y, TILE_SIZE, TILE_SIZE)
            } else {
                // 图片还没加载完时，先用颜色块占位
                ctx.fillStyle = '#eee'
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)

                ctx.fillStyle = '#333'
                ctx.font = '10px sans-serif'
                ctx.fillText(tileId, x + 2, y + 16)
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
        drawGrid(ctx)

        if (hoverCell) {
            drawHoverCell(ctx, hoverCell.row, hoverCell.col)
        }
    }

    useEffect(() => {
        redraw()
    }, [placedTiles, imageMap, hoverCell])

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

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const col = Math.floor(mouseX / TILE_SIZE)
        const row = Math.floor(mouseY / TILE_SIZE)

        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return

        const key = `${row}-${col}`

        setPlacedTiles((prev) => ({
            ...prev,
            [key]: selectedTileId,
        }))
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        const col = Math.floor(mouseX / TILE_SIZE)
        const row = Math.floor(mouseY / TILE_SIZE)

        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
            setHoverCell(null)
            return
        }

        setHoverCell({ row, col })
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>Day 4 - Tile 图片摆放</h1>

            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
                {tileAssets.map((asset) => (
                    <button
                        key={asset.id}
                        onClick={() => setSelectedTileId(asset.id)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: selectedTileId === asset.id ? '2px solid #1677ff' : '1px solid #ccc',
                            background: selectedTileId === asset.id ? '#e6f4ff' : '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        {asset.name}
                    </button>
                ))}
            </div>

            <p style={{ marginBottom: 12 }}>
                当前选中素材：<strong>{selectedTileId}</strong>
            </p>
            <p>
                当前选中格子：
                {hoverCell
                    ? `第 ${hoverCell.row + 1} 行，第 ${hoverCell.col + 1} 列`
                    : '未选中'}
            </p>

            <canvas
                ref={canvasRef}
                width={COLS * TILE_SIZE}
                height={ROWS * TILE_SIZE}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: 8,
                    cursor: 'pointer',
                }}
            />
        </div>
    )
}

export default tilesput