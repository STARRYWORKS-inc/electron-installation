import { Ilda } from "./ilda";

class App {
	ilda: Ilda
	constructor() {
		this.ilda = new Ilda();
	}
}

function init(): void {
	window.addEventListener("DOMContentLoaded", () => new App());
}

init();
