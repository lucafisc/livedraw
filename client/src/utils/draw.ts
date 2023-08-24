import { DrawLine, Tools } from "../types/types";
import { config } from "@/utils/config";

function drawLine({ prevPoint, currentPoint, ctx, lineColor }: DrawLine) {
  const { x: currentX, y: currentY } = currentPoint;

  let startPoint = prevPoint ?? currentPoint;
  ctx.beginPath();
  ctx.lineWidth = config.pencilWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.fill();
}

function drawBrush({ prevPoint, currentPoint, ctx, lineColor }: DrawLine) {
	const { x: currentX, y: currentY } = currentPoint;
  
	let startPoint = prevPoint ?? currentPoint;
	ctx.beginPath();
	ctx.lineWidth = config.brushWidth;
	ctx.strokeStyle = lineColor;
	ctx.moveTo(startPoint.x, startPoint.y);
	ctx.lineTo(currentX, currentY);
	ctx.stroke();
	ctx.fillStyle = lineColor;
	ctx.beginPath();
	ctx.fill();
  }

function drawSpray({ prevPoint, currentPoint, ctx, lineColor }: DrawLine) {
  const lineWidth = config.sprayWidth;
  const sprayDensity = config.sprayDensity;
  let startPoint = prevPoint ?? currentPoint;

  ctx.fillStyle = lineColor;
  for (let i = 0; i < sprayDensity; i++) {
    const offsetX = (Math.random() - 0.5) * lineWidth * 10;
    const offsetY = (Math.random() - 0.5) * lineWidth * 10;
    const sprayX = startPoint.x + offsetX;
    const sprayY = startPoint.y + offsetY;

    ctx.beginPath();
    ctx.arc(sprayX, sprayY, 1, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export const draw = ({
  prevPoint,
  currentPoint,
  ctx,
  lineColor,
  tool,
}: DrawLine) => {
  switch (tool) {
    case Tools.PENCIL:
      drawLine({ prevPoint, currentPoint, ctx, lineColor, tool });
      break;
    case Tools.SPRAY:
      drawSpray({ prevPoint, currentPoint, ctx, lineColor, tool });
      break;
    case Tools.BRUSH:
      drawBrush({ prevPoint, currentPoint, ctx, lineColor, tool });
      break;
  }
};
