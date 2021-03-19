import IPoint from "./IPoint";

export default interface IShape {
	readonly name: string,
	addPoint(point: IPoint): void,
	getArea(): number,
	getPerimeter(): number,
	draw(ctx: CanvasRenderingContext2D) : void,
}
