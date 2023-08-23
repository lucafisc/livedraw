import { useEffect, useRef, useState } from "react";
import { Draw, Point } from "../types/types";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPointRef = useRef<null | Point>(null); //uses useRef to avoi re-renders

  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasRef.current?.getContext("2d");
	  if (!canvas) return;
	  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const mouseDownHandler = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currentPoint = computePointInCanvas(e);
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;
      onDraw({ ctx, currentPoint, prevPoint: prevPointRef.current });
      prevPointRef.current = currentPoint;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPointRef.current = null;
    };

    canvasRef.current?.addEventListener("mousemove", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    return () => {
      canvasRef.current?.removeEventListener("mousemove", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear };
};
