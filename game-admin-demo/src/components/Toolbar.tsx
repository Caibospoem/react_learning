interface ToolbarProps {
  isEraseMode: boolean
  draftRows: number
  draftCols: number
  onDraftRowsChange: (value: number) => void
  onDraftColsChange: (value: number) => void
  onToggleEraseMode: () => void
  onClearMap: () => void
  onCreateNewMap: () => void
  onExportJson: () => void
  mode: 'edit' | 'preview'
  onToggleMode: () => void
  showGrid: boolean
  setShowGrid: (value: boolean) => void
}

function Toolbar({
  isEraseMode,
  draftRows,
  draftCols,
  onDraftRowsChange,
  onDraftColsChange,
  onToggleEraseMode,
  onClearMap,
  onCreateNewMap,
  onExportJson,
  mode,
  onToggleMode,
  showGrid,
  setShowGrid,

}: ToolbarProps) {
  return (
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
      <div style={{ fontWeight: 700, fontSize: 18 }}>地图编辑器</div>

      <button
        onClick={onExportJson}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        导出 JSON
      </button>
      <button 
        onClick={onToggleMode}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: mode === 'preview' ? '#fff1f0' : '#f6ffed',
          color: mode === 'preview' ? '#cf1322' : '#389e0d',
          cursor: 'pointer',
        }}
      >
        {mode === 'edit' ? '进入预览模式' : '返回编辑模式'}
      </button>
      <button 
        onClick={() => setShowGrid(!showGrid)}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: !showGrid ? '#fff1f0' : '#f6ffed',
          color: !showGrid ? '#cf1322' : '#389e0d',
          cursor: 'pointer',
        }}
      >
        {showGrid ? '隐藏网格' : '显示网格'}
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 14 }}>
          行数：
          <input
            type="number"
            min={1}
            value={draftRows}
            onChange={(e) => onDraftRowsChange(Number(e.target.value))}
            style={{ marginLeft: 6, width: 70 }}
          />
        </label>

        <label style={{ fontSize: 14 }}>
          列数：
          <input
            type="number"
            min={1}
            value={draftCols}
            onChange={(e) => onDraftColsChange(Number(e.target.value))}
            style={{ marginLeft: 6, width: 70 }}
          />
        </label>

        <button
          onClick={onCreateNewMap}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          新建地图
        </button>

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