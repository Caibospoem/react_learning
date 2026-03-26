import { useEffect, useRef, useState } from 'react'

const TILE_SIZE = 32
const COLS = 20
const ROWS = 15

function GridHighlight() {
    const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [selectedCell, setSelectedCell] = useState<{
        row: number
        col: number
    } | null>(null)

    const drawGrid = (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => {
        ctx.strokeStyle = '#d9d9d9'
        ctx.lineWidth = 1

        for (let col = 0; col <= COLS; col++) {
            const x = col * TILE_SIZE
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, height)
            ctx.stroke()
        }

        for (let row = 0; row <= ROWS; row++) {
            const y = row * TILE_SIZE
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(width, y)
            ctx.stroke()
        }
    }
    
    const drawSelectedCell = (
        ctx: CanvasRenderingContext2D,
        row: number,
        col: number
    ) => {
        const x = col * TILE_SIZE
        const y = row * TILE_SIZE


        ctx.fillStyle = 'rgba(24, 144, 255, 0.3)'
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)

        ctx.strokeStyle = '#1890ff'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE)
    }

    const drawHoverCell = (
        ctx: CanvasRenderingContext2D,
        row: number,
        col: number
    ) => {
        const x = col * TILE_SIZE
        const y = row * TILE_SIZE

        ctx.fillStyle = 'rgba(24, 144, 255, 0.1)'
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE)
    }

    const redraw = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        drawGrid(ctx, canvas.width, canvas.height)

        if (hoverCell) {
            drawHoverCell(ctx, hoverCell.row, hoverCell.col)
        }

        if (selectedCell) {
            drawSelectedCell(ctx, selectedCell.row, selectedCell.col)
        }


    }

    useEffect(() => {
        redraw()
    }, [selectedCell, hoverCell])




    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()

        // 计算鼠标点击位置相对于 canvas 的坐标
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top

        // 像素坐标转化成网格坐标，向下取整
        const col = Math.floor(mouseX / TILE_SIZE)
        const row = Math.floor(mouseY / TILE_SIZE)

        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
            return
        }

        setSelectedCell({ row, col })
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
            <h1>Day 3 - 网格系统与坐标映射</h1>
            <p>
                当前选中：
                {selectedCell
                    ? `第 ${selectedCell.row} 行，第 ${selectedCell.col} 列`
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
                    cursor: 'pointer'
                }}
            />
        </div>
    )
}

export default GridHighlight