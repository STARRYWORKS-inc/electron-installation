import p5 from "p5";
import { sketch } from "./sketch";
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
