import { BoardGui } from "./boardGui";
import { Osc } from "./osc";
import StepSeries from "./stepSeries";
import * as config from "./STEP800_SM-42BYG011-25_24V.json";

class App {
	osc: Osc;
	gui: BoardGui;
	board: StepSeries;


	constructor() {
		this.osc = new Osc();
		this.board = new StepSeries(2, this.#sendOsc, config);
		this.gui = new BoardGui(this.board);
		this.osc.on(this.osc.MESSAGE, this.#onOscReceived);
	}

	#sendOsc: (
		host: string,
		port: number,
		address: string,
		args: (string | number | boolean | null | Blob)[],
	) => void = (host, port, address, args) => {
		this.osc.send(host, port, address, args);
	};

	#onOscReceived = (address: string, args: (number | string | Blob | null)[]): void => {
		this.board.oscReceived(address, args);
		this.gui.refresh();
	};
}

function init(): void {
	window.addEventListener("DOMContentLoaded", () => new App());
}

init();
