import { DrawLine } from "../types/types";

function drawLine({
  prevPoint,
  currentPoint,
  ctx,
  lineColor,
  isPencil,
}: DrawLine) {
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
}

function drawSpray({
	prevPoint,
	currentPoint,
	ctx,
	lineColor,
  }: DrawLine) {
	const { x: currentX, y: currentY } = currentPoint;
	const lineWidth = 3;
	const sprayDensity = 100;
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
  isPencil,
}: DrawLine) => {
  if (isPencil) drawLine({ prevPoint, currentPoint, ctx, lineColor, isPencil });
  else drawSpray({ prevPoint, currentPoint, ctx, lineColor, isPencil });
};
