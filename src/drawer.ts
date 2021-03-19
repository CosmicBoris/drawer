import IShape from "./interfaces/IShape";
import Rectangle from "./shapes/rectangle";
import IDraggable from "./interfaces/IDraggable";
import Square from "./shapes/square";
import Circle from "./shapes/circle";
import Polygon from "./shapes/polygon";

const shapesFactory = (() => {
	const types = {
		Square: () => new Square(),
		Circle: () => new Circle(),
		Polygon: () => new Polygon(),
		Rectangle: () => new Rectangle(),
	}

	return (type: string): IShape => types[type]();
})();

export default class Drawer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private cursorInfo: HTMLElement;
	private shapeInfo: HTMLElement;
	private inpColor: HTMLInputElement;
	private dragging: boolean = false;
	private shape: IShape;
	private shapeType: string = 'Polygon';
	private updateLoop = () => {
		if (this.dragging) {
			this.updateCanvas();
			requestAnimationFrame(this.updateLoop);
		}
	}

    constructor(private container: HTMLElement) {}

    public init(): void {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.resizeCanvas();
		this.container.appendChild(this.canvas);
		this.cursorInfo = document.querySelector('.pointer-info');
		this.shapeInfo = document.querySelector('.shape-info');
		this.inpColor = document.getElementById('inp-color') as HTMLInputElement;
		this.setShapeType();
		this.setShapeColor();

		this.initEvents();
    }

    private initEvents(): void {
		window.addEventListener('resize', this.onResize.bind(this));
		document.querySelector('[data-action="clear"]').addEventListener('click', this.reset.bind(this));
		this.inpColor.addEventListener('change', this.setShapeColor.bind(this));
		this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
		this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
		this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));

		const boundFn = this.onShapeSelected.bind(this);
		document.querySelectorAll('button[data-type]').forEach((btn: Element) => {
			btn.addEventListener('click', boundFn);
		});
	}

	private onResize(e: UIEvent): void {
		this.resizeCanvas();
	}

	private onPointerDown(e: PointerEvent): void {
		e.preventDefault();
		e.stopPropagation();

		this.dragging = true;

		this.shape.addPoint({x: e.offsetX, y: e.offsetY})

		this.ctx.setLineDash([5, 5]);

		this.updateLoop();
	}

	private onPointerMove(e: PointerEvent): void {
		if (this.dragging && 'drag' in this.shape) {
			(this.shape as IDraggable).drag({x: e.offsetX, y: e.offsetY});
			this.updateShapeInfo();
		}
    	this.cursorInfo.innerText = `Pointer X: ${e.offsetX} Y: ${e.offsetY}`;
	}

	private onPointerUp(e: PointerEvent): void {
		if (!this.dragging) return;
		this.dragging = false;
		this.ctx.setLineDash([]);
		if('release' in this.shape) {
			(this.shape as IDraggable).release({x: e.offsetX, y: e.offsetY});
		}
		this.updateCanvas();
		this.updateShapeInfo();
	}

	private onShapeSelected(e: Event): void {
		const btn = e.target as HTMLElement;
		this.shapeType = btn.dataset.type;
		(<HTMLElement>btn.closest('.shapes-list')).dataset.active = this.shapeType;
		this.setShapeType();
	}

	private updateCanvas(): void {
    	this.clearCanvas();
    	this.shape.draw(this.ctx);
	}

	private updateShapeInfo(): void {
    	this.shapeInfo.innerText = `Shape <${this.shape.name}> \
 			area: ${this.shape.getArea().toFixed(2)}, \
 			perimeter: ${this.shape.getPerimeter().toFixed(2)}`;
	}

	private setShapeType(): void {
		this.shape = shapesFactory(this.shapeType);
		this.updateShapeInfo();
	}

	private setShapeColor(e?: Event): void {
		this.ctx.strokeStyle = this.inpColor.value;
	}

	private resizeCanvas(): void {
		this.canvas.width = this.container.clientWidth;
		this.canvas.height = this.container.clientHeight;
	}

	private clearCanvas(): void {
    	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private reset(): void {
		this.clearCanvas();
		this.setShapeType();
	}
}
