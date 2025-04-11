import React, { useEffect, useRef } from "react";

interface GridLineBackgroundProps {
  children: React.ReactNode;
}

const GridLineBackground: React.FC<GridLineBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridSize = 30; // Size of grid cells in pixels

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Animation variables
    let frameId: number;

    // Draw only the grid
    const drawScene = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      frameId = requestAnimationFrame(drawScene);
    };

    // Handle resizing
    window.addEventListener("resize", resizeCanvas);

    // Start
    resizeCanvas();
    frameId = requestAnimationFrame(drawScene);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
        style={{ imageRendering: "pixelated" }} 
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GridLineBackground;
