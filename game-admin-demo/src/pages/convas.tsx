import { useRef } from 'react'

function ConvasPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const drawBlocks = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = '#f5f5f5'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#1677ff'
        ctx.fillRect(50, 50, 60, 60)

        ctx.fillStyle = '#52c41a'
        ctx.fillRect(130, 50, 60, 60)

        ctx.fillStyle = '#faad14'
        ctx.fillRect(210, 50, 60, 60)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const drawline = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.beginPath()
        ctx.moveTo(50, 150)
        ctx.lineTo(200, 150)
        ctx.moveTo(50, 170)
        ctx.lineTo(200, 170)
        ctx.strokeStyle = '#13c2c2'
        ctx.lineWidth = 5
        ctx.stroke()
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>交互练习</h1>
            <p className="muted">这是一个 Canvas 编辑页面的占位符</p>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
                <button onClick={drawBlocks}>画方块</button>
                <button onClick={drawline}>画线</button>
                <button onClick={clearCanvas}>清空</button>

            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                style={{ border: '1px solid #d9d9d9', borderRadius: 8 }}
            />
        </div>
    )
}

export default ConvasPage