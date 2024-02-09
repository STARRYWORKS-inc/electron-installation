import p5 from "p5";
import { sketch } from "./sketch";

class App {
	constructor() {
		new p5(sketch);
	}
}

function init(): void {
	window.addEventListener("DOMContentLoaded", () => new App());
}

init();
