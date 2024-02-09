import { sketch } from "./sketch";
import p5 from "p5";

class App {
	p5: p5;
	constructor() {
		this.p5 = new p5(sketch);
	}
}

function init(): void {
	window.addEventListener("DOMContentLoaded", () => new App());
}

init();
