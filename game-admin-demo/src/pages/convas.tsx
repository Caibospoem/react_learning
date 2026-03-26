import { useEffect, useRef } from "react";

function ConvasPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1677ff";
    ctx.fillRect(40, 80, 180, 120);

    ctx.fillStyle = "#333";
    ctx.font = "24px sans-serif";
    ctx.fillText("Canvas Demo", 20, 40);

    ctx.font = "16px sans-serif";
    ctx.fillText("2D editor prototype initialized.", 40, 230);
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>Canvas 2D Demo</h1>
      <p>This page is mounted at /convas and should render the canvas normally.</p>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginTop: "16px",
          background: "#fff",
        }}
      />
    </div>
  );
}

export default ConvasPage;
