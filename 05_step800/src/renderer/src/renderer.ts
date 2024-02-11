import { Step } from "./step";

class App {
	step: Step;
	constructor() {
		this.step = new Step();
	}
}

function init(): void {
	window.addEventListener("DOMContentLoaded", () => new App());
}

init();
