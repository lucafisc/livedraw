import { DrawLine } from "../types/types";

export const drawLine = ({ prevPoint, currentPoint, ctx, lineColor }: DrawLine ) => {
    const { x: currentX, y: currentY } = currentPoint;
    const lineWidth = 3;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  };