import { useEffect, useRef } from "react";
import type { GeneratedMap } from "../types";

type MapPreviewCanvasProps = {
  mapData: GeneratedMap | null;
  maxWidth?: number;
};

const TILE_COLORS: Record<string, string> = {
  ground: "#7c5c3b",
  platform: "#b8894f",
  water: "#2d88ff",
  spike: "#f5222d",
};

function MapPreviewCanvas({ mapData, maxWidth = 760 }: MapPreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapData) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const scale = Math.max(1, Math.floor(maxWidth / (mapData.cols * mapData.tileSize)));
    const tileSize = mapData.tileSize * scale;
    canvas.width = mapData.cols * tileSize;
    canvas.height = mapData.rows * tileSize;

    ctx.fillStyle = "#f0f4ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Object.entries(mapData.cells).forEach(([key, tileId]) => {
      const [rowStr, colStr] = key.split("-");
      const row = Number(rowStr);
      const col = Number(colStr);
      if (!Number.isFinite(row) || !Number.isFinite(col)) {
        return;
      }
      ctx.fillStyle = TILE_COLORS[tileId] ?? "#94a3b8";
      ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
    });

    ctx.strokeStyle = "rgba(15, 23, 42, 0.12)";
    for (let col = 0; col <= mapData.cols; col += 1) {
      const x = col * tileSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let row = 0; row <= mapData.rows; row += 1) {
      const y = row * tileSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [mapData, maxWidth]);

  if (!mapData) {
    return <div className="empty">No map generated yet.</div>;
  }

  return (
    <div className="map-preview-shell">
      <canvas ref={canvasRef} className="map-preview-canvas" />
    </div>
  );
}

export default MapPreviewCanvas;

