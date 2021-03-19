import IShape from "../interfaces/IShape";
import IDraggable from "../interfaces/IDraggable";
import IPoint from "../interfaces/IPoint";

export default class Circle implements IShape, IDraggable {
	readonly name: string = 'Circle';
	private location: IPoint;

	constructor(private radius: number = 1) {}

	addPoint(point: IPoint): void {
		this.location = point;
		this.radius = 1;
	}

	getArea(): number {
		return Math.PI * this.radius * this.radius;
	}

	getPerimeter(): number {
		return 2 * Math.PI * this.radius;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.arc(this.location.x, this.location.y, this.radius, 0, Math.PI * 2);
		ctx.stroke();
	}

	drag(point: IPoint): void {
		this.radius = Math.floor(Math.hypot(this.location.x - point.x, this.location.y - point.y));
	}
}
