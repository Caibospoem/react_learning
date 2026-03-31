interface ToolbarProps {
  isEraseMode: boolean
  onToggleEraseMode: () => void
  onClearMap: () => void
}

function Toolbar({
  isEraseMode,
  onToggleEraseMode,
  onClearMap,
}: ToolbarProps) {
  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '1px solid #e5e7eb',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18 }}>地图编辑器</div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onToggleEraseMode}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: isEraseMode ? '#fff1f0' : '#f6ffed',
            color: isEraseMode ? '#cf1322' : '#389e0d',
            cursor: 'pointer',
          }}
        >
          {isEraseMode ? '擦除模式✅' : '绘制模式'}
        </button>

        <button
          onClick={onClearMap}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          清空地图
        </button>
      </div>
    </div>
  )
}

export default Toolbar