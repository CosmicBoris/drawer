import IPoint from "./IPoint";

export default interface IDraggable {
	drag(point: IPoint): void
	release?(point: IPoint): void
}
