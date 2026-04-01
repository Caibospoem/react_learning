export interface MapData {
    rows: number
    cols: number
    tileSize: number
    cells: Record<string, string | number> // key: "row-col", value: tileId
}

export interface TileAsset {
    id: string
    name: string
    src: string
    description?: string
}

export interface GridCell {
  row: number
  col: number
}