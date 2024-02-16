import { Pane } from "tweakpane";
import { Osc } from "./osc";
import { BindingApi } from "@tweakpane/core";
import StepSeries from "./stepSeries";
import { MotorGui } from "./motorGui";

export class BoardGui {
	osc: Osc;
	board: StepSeries;
	gui: Pane;
	motorGuis: MotorGui[] = [];

	runSpeed: number = 100;
	goToSteps: number = 0;
	goToRotation: number = 0;
	moveSteps: number = 1000;
	moveRotation: number = 1;
	servoTargetPosition: number = 0;
	servoTargetRotation: number = 0;

	constructor(board: StepSeries) {
		this.osc = new Osc();
		this.board = board;
		this.gui = new Pane({ title: "STEP 800" });
		const messageFolder = this.gui.addFolder({ title: "Message" });
		messageFolder.addBinding(this.osc, "lastMessage", {
			readonly: true,
			multiline: true,
			rows: 8,
		}) as BindingApi<string>;
		// basic
		const basicFolder = this.gui.addFolder({ title: "Basic Settings", expanded: false });
		basicFolder.addButton({ title: "Set Dest IP" }).on("click", this.board.setDestIp);
		basicFolder.addButton({ title: "Get Version" }).on("click", this.board.getVersion);
		basicFolder.addBinding(this.board, "reportError");
		// motors
		const motorFolder = this.gui.addFolder({ title: "Motors" });
		this.gui.addBlade({ view: 'separator', });
		const pages: { title: string }[] = [];
		this.board.motors.forEach((_, i) => {
			pages.push({ title: `${i + 1}` });
		});
		const tabPage = motorFolder.addTab({ pages });
		this.board.motors.forEach((motor, i) => {
			this.motorGuis.push(new MotorGui(tabPage.pages[i], motor, i));
		});
	}

	refresh(): void {
		this.gui.refresh();
	}
}
