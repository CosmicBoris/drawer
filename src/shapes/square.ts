import Rectangle from "./rectangle";
import IPoint from "../interfaces/IPoint";

export default class Square extends Rectangle {
	readonly name: string = 'Square';

	constructor(private side: number = 0) {
		super(side, side);
	}

	drag(point: IPoint) {
		super.drag(point);
		this.width = this.height = Math.min(this.width, this.height);
	}
}
