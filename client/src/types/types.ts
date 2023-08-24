// types.ts
export type Draw = {
	ctx: CanvasRenderingContext2D;
	currentPoint: Point;
	prevPoint: Point | null;
};
  
export enum Tools {
  PENCIL = 'pencil',
  SPRAY = 'spray',
  BRUSH = 'brush',
}
export type DrawLine = Draw & {
	lineColor: string;
	tool: Tools;
  }
  
  export type Point = {
	x: number;
	y: number;
  };
  