import { Pane } from "tweakpane";
import { CircleData, LineData, RectData } from "./shape";

export class Ilda {
	gui: Pane;
	rect: RectData = {
		type: "rect",
		x: 0.5,
		y: 0.5,
		width: 0.1,
		height: 0.1,
		color: [0, 1, 0],
	};
	circle: CircleData = {
		type: "circle",
		x: 0.5,
		y: 0.5,
		radius: 0.1,
		color: [1, 0, 0],
	};
	line: LineData = {
		type: "line",
		from: { x: 0.5, y: 0.45 },
		to: { x: 0.5, y: 0.55 },
		color: [0, 0, 1],
		blankBefore: true,
		blankAfter: true,
	};
	constructor() {
		this.gui = new Pane({ title: "ILDA" });
		this.gui
			.addBinding(this.rect, "x", { min: 0, max: 1, step: 0.01 })
			.on("change", this.#onChange);
		this.gui
			.addBinding(this.rect, "y", { min: 0, max: 1, step: 0.01 })
			.on("change", this.#onChange);
		this.gui
			.addBinding(this.rect, "width", { min: 0, max: 1, step: 0.01 })
			.on("change", this.#onChange);
		this.gui
			.addBinding(this.rect, "height", { min: 0, max: 1, step: 0.001 })
			.on("change", this.#onChange);

		this.#onChange();
		this.#update();
	}

	#update = (): void => {
		console.log('update');
		window.requestAnimationFrame(this.#update);
		const t = Date.now() / 1000;
		const s = Math.sin(t * 6) * 0.5 + 0.5;
		this.rect.height = 0.1 + s * 0.2;
		this.gui.refresh();
	};

	#onChange = (): void => {
		window.electron.ipcRenderer.invoke("IldaSend", [this.rect]);
		// window.electron.ipcRenderer.invoke("IldaSend", [this.rect, this.circle, this.line]);
	};
}
