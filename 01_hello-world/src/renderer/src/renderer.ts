class App {
	constructor() {
		console.log("App started");
	}
}

function init(): void {
	window.addEventListener("DOMContentLoaded", () => new App());
}

init();
