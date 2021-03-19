import IShape from "../interfaces/IShape";
import IPoint from "../interfaces/IPoint";
import IDraggable from "../interfaces/IDraggable";

export default class Rectangle implements IShape, IDraggable {
	readonly name: string = 'Rectangle';
	private location: IPoint;

	constructor(protected width: number = 0, protected height: number = 0) {}

	addPoint(point: IPoint): void {
		this.location = point;
		this.width = 0;
		this.height = 0;
	}

	getArea(): number {
		return this.width * this.height;
	}

	getPerimeter(): number {
		return (this.width * 2) + (this.height * 2);
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.strokeRect(this.location.x, this.location.y, this.width, this.height);
	}

	drag(point: IPoint): void {
		const {x: x1, y: y1} = this.location;
		let {x: x2, y: y2} = point;

		if(x2 < x1) {
			x2 = x1;
			this.location.x = point.x;
		}
		if(y2 < y1) {
			y2 = y1;
			this.location.y = point.y;
		}
		this.width = x2 - this.location.x;
		this.height = y2 - this.location.y;
	}
}
