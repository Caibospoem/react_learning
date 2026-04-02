import type { MapData } from '../types/map'

export const getCellKey = (row: number, col: number) => `${row}-${col}`

export const createEmptyMapData = (
  rows: number,
  cols: number,
  tileSize: number
): MapData => ({
  rows,
  cols,
  tileSize,
  cells: {},
})

export const setTileAtCell = (
  mapData: MapData,
  row: number,
  col: number,
  tileId: string | number
): MapData => {
  const key = getCellKey(row, col)

  return {
    ...mapData,
    cells: {
      ...mapData.cells,
      [key]: tileId,
    },
  }
}

export const removeTileAtCell = (
  mapData: MapData,
  row: number,
  col: number
): MapData => {
  const key = getCellKey(row, col)
  const nextCells = { ...mapData.cells }

  delete nextCells[key]

  return {
    ...mapData,
    cells: nextCells,
  }
}

export const isMapData = (data: unknown): data is MapData => {
  if (!data || typeof data !== 'object') return false
  const value = data as Record<string, unknown>
  if (typeof value.rows !== 'number') return false
  if (typeof value.cols !== 'number') return false
  if (typeof value.tileSize !== 'number') return false
  if (!value.cells || typeof value.cells !== 'object') return false
  return true
}
