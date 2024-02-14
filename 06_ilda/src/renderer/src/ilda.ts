import { Pane } from "tweakpane";
import { RectData } from "./shape";

export class Ilda {
	gui: Pane;
	rect: RectData = {
		type: "rect",
		x: 0,
		y: 0,
		width: 0.5,
		height: 0.1,
		color: [0, 1, 0],
	};
	constructor() {
		this.gui = new Pane({ title: "ILDA" });
		this.gui
			.addBinding(this.rect, "x", { min: -1, max: 1, step: 0.05 })
			.on("change", this.#onChange);
		this.gui
			.addBinding(this.rect, "y", { min: -1, max: 1, step: 0.05 })
			.on("change", this.#onChange);
		this.gui
			.addBinding(this.rect, "width", { min: 0, max: 1, step: 0.05 })
			.on("change", this.#onChange);
		this.gui
			.addBinding(this.rect, "height", { min: 0, max: 1, step: 0.05 })
			.on("change", this.#onChange);
		this.gui.addBinding(this.rect, "color", { min: 0, max: 1, step: 0.05 });

		this.#onChange();
	}

	#onChange = (): void => {
		window.electron.ipcRenderer.invoke("IldaSend", [this.rect]);
	};
}
