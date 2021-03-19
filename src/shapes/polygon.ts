import IShape from "../interfaces/IShape";
import IPoint from "../interfaces/IPoint";
import IDraggable from "../interfaces/IDraggable";

export default class Polygon implements IShape, IDraggable {
	readonly name: string = 'Polygon';
	private points: IPoint[];
	private polyClosed: boolean;
	private selectedPoint: number;

	constructor() {
		this.points = [];
		this.polyClosed = false;
		this.selectedPoint = -1;
	}

	addPoint(point: IPoint): void {
		if(!this.polyClosed) {
			this.points.push(point);
		}
		for(let i = 0; i < this.points.length; i++) {
			if(Polygon.isPointsNear(point, this.points[i])) {
				this.selectedPoint = i;
				break;
			}
		}
	}

	getArea(): number {
		if(!this.polyClosed) return 0;

		let area: number = 0;
		let j, i: number;

		j = this.points.length - 1;
		for(i = 0; i < this.points.length; i++) {
			const {x: ax, y: ay}  = this.points[i];
			const {x: bx, y: by}  = this.points[j];
			const crossProduct = ax * by - ay * bx;
			area += crossProduct;
			j = i;
		}
		area = Math.abs(area / 2);

		return area;
	}

	getPerimeter(): number {
		if(this.points.length < 2 ) return 0;

		let sum: number = 0;
		for(let i = 0, j = 1; j < this.points.length; i++, j++) {
			let {x: x1, y: y1} = this.points[i];
			let {x: x2, y: y2} = this.points[j];
			sum += Math.floor(Math.hypot(x1 - x2, y1 - y2));
		}

		if(this.polyClosed) {
			let {x: x1, y: y1} = this.points[0];
			let {x: x2, y: y2} = this.points[this.points.length - 1];
			sum += Math.floor(Math.hypot(x1 - x2, y1 - y2));
		}

		return sum;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		const ps = this.points;
		Polygon.drawDot(ctx, ps[0]);
		ctx.beginPath();
		ctx.moveTo(ps[0].x, ps[0].y);
		for(let i = 1; i < ps.length; i++) {
			Polygon.drawDot(ctx, ps[i]);
			ctx.lineTo(ps[i].x, ps[i].y);
		}
		if(this.polyClosed) ctx.closePath();
		ctx.stroke();
	}

	drag(point: IPoint): void {
		if(this.points.length < 2 || this.selectedPoint === -1) return;
		this.points[this.selectedPoint] = point;
	}

	release(point: IPoint) {
		this.selectedPoint = - 1;
		if(this.points.length < 2 || this.polyClosed) return;
		if((this.polyClosed = this.closeToStart(point))) {
			this.points.splice(-1,1);
		}
	}

	private closeToStart(point: IPoint): boolean {
		return this.points.length > 2 && !this.polyClosed && Polygon.isPointsNear(point, this.points[0]);
	}

	private static isPointsNear(pA: IPoint, pB: IPoint): boolean {
		return Math.abs(pA.x - pB.x) < 10 && Math.abs(pA.y - pB.y) < 10;
	}

	private static drawDot(ctx: CanvasRenderingContext2D, point: IPoint): void {
		ctx.fillRect(point.x - 4, point.y - 4, 8, 8);
	}
}
