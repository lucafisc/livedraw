// types.ts
export type Draw = {
	ctx: CanvasRenderingContext2D;
	currentPoint: Point;
	prevPoint: Point | null;
};
  
export type DrawLine = Draw & {
	lineColor: string
  }
  
  export type Point = {
	x: number;
	y: number;
  };
  