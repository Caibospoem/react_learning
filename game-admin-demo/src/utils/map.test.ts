import { describe, expect, it } from "vitest";
import { createEmptyMapData, getCellKey, removeTileAtCell, setTileAtCell } from "./map";

describe("map utils", () => {
  it("creates empty map data", () => {
    const mapData = createEmptyMapData(10, 20, 32);

    expect(mapData.rows).toBe(10);
    expect(mapData.cols).toBe(20);
    expect(mapData.tileSize).toBe(32);
    expect(mapData.cells).toEqual({});
  });

  it("generates consistent cell key", () => {
    expect(getCellKey(3, 7)).toBe("3-7");
  });

  it("sets tile without mutating previous state", () => {
    const original = createEmptyMapData(4, 4, 16);
    const next = setTileAtCell(original, 1, 2, "grass");

    expect(next.cells["1-2"]).toBe("grass");
    expect(original.cells["1-2"]).toBeUndefined();
  });

  it("removes tile without mutating previous state", () => {
    const withTile = setTileAtCell(createEmptyMapData(4, 4, 16), 1, 2, "stone");
    const next = removeTileAtCell(withTile, 1, 2);

    expect(next.cells["1-2"]).toBeUndefined();
    expect(withTile.cells["1-2"]).toBe("stone");
  });
});
