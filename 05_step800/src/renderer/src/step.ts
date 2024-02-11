import { Pane } from "tweakpane";
import { Osc } from "./osc";
import { BindingApi } from "@tweakpane/core";
import * as config from "./STEP800_SM-42BYG011-25_24V.json";
import Motor from "./motor";

export class Step {
	osc: Osc;
	motor: Motor;
	gui: Pane;

	runSpeed: number = 100;
	goToSteps: number = 0;
	goToAngle: number = 0;
	moveSteps: number = 1000;
	moveAngle: number = 1;
	servoTargetPosition: number = 0;
	servoTargetAngle: number = 0;
	lastMessage: BindingApi<string>;

	constructor() {
		this.osc = new Osc();
		this.motor = new Motor(1, this.osc, config);
		this.gui = new Pane({ title: "STEP 400/800" });
		// this.gui.addBinding(params, "radius", { min: 10, max: 200, step: 1 });
		const messageFolder = this.gui.addFolder({ title: "Message" });
		this.lastMessage = messageFolder.addBinding(this.osc, "lastMessage", {
			readonly: true,
			multiline: true,
			rows: 8,
		}) as BindingApi<string>;
		// basic
		const basicFolder = this.gui.addFolder({ title: "Basic Settings", expanded: false });
		basicFolder.addButton({ title: "Set Dest IP" }).on("click", this.motor.setDestIp);
		basicFolder.addButton({ title: "Get Version" }).on("click", this.motor.getVersion);
		basicFolder.addButton({ title: "Get KVal" }).on("click", this.motor.getKval);
		basicFolder.addButton({ title: "Get Speed Profile" }).on("click", this.motor.getSpeedProfile);
		basicFolder.addButton({ title: "Get Servo Param" }).on("click", this.motor.getServoParam);
		basicFolder.addBinding(this.motor, "reportError");
		// homing
		const homingFolder = this.gui.addFolder({ title: "Homing", expanded: false });
		homingFolder.addButton({ title: "Homing" }).on("click", this.motor.homing);
		homingFolder.addButton({ title: "Get Homing Status" }).on("click", this.motor.getHomingStatus);
		homingFolder.addButton({ title: "Get Homing Direction" }).on("click", this.motor.getHomingDirection);
		homingFolder.addButton({ title: "Get Homing Speed" }).on("click", this.motor.getHomingSpeed);
		homingFolder.addBinding(this.motor, "homingDirection", { min: 0, max: 1, step: 1, label: "Direction" });
		homingFolder.addBinding(this.motor, "homingSpeed", { min: 0, max: 15625, step: 0.1, label: "Speed"});
		// run and stop
		const runAndStopFolder = this.gui.addFolder({ title: "Run and Stop", expanded: false });
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "runSpeed", { min: -15625, max: 15625, step: 1, label: "speed"});
		runAndStopFolder.addButton({ title: "Run" }).on("click", () => {
			this.motor.run(this.runSpeed);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "goToSteps", { min: -2097152, max: 2097152, step: 1, label: "steps"});
		runAndStopFolder.addButton({ title: "goTo" }).on("click", () => {
			this.motor.goTo(this.goToSteps);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "goToAngle", { min: -100, max: 100, step: 0.25, label: "angle"});
		runAndStopFolder.addButton({ title: "goTo" }).on("click", () => {
			this.motor.goToByAngle(this.goToAngle * 360);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "moveSteps", { min: -100000, max: 100000, step: 1, label: "steps"});
		runAndStopFolder.addButton({ title: "Move" }).on("click", () => {
			this.motor.move(this.moveSteps);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "moveAngle", { min: -1, max: 1, step: 0.01, label: "angle" });
		runAndStopFolder.addButton({ title: "Move" }).on("click", () => {
			this.motor.moveByAngle(this.moveAngle * 360);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addButton({ title: "Soft stop" }).on("click", this.motor.softStop);
		runAndStopFolder.addButton({ title: "Hard stop" }).on("click", this.motor.hardStop);

		// servo mode
		const servoModeFolder = this.gui.addFolder({ title: "Servo Mode", expanded: false });
		servoModeFolder.addBinding(this.motor, "servoMode", { label: "Enabled" });
		servoModeFolder.addBlade({ view: "separator" });
		servoModeFolder.addBinding(this, "servoTargetPosition", {
			min: -2097152,
			max: 2097152,
			step: 1,
			label: "steps",
		});
		servoModeFolder.addButton({ title: "Set Target Position" }).on("click", () => {
			this.motor.setTargetPosition(this.servoTargetPosition);
		});
		servoModeFolder.addBlade({ view: "separator" });
		servoModeFolder.addBinding(this, "servoTargetAngle", { min: -100, max: 100, step: 0.25, label: "angle" });
		servoModeFolder.addButton({ title: "Set Target Position" }).on("click", () => {
			this.motor.setTargetPositionByAngle(this.servoTargetAngle * 360);
		});

		this.osc.on(this.osc.MESSAGE, (_) => {
			this.lastMessage.refresh();
		});
	}
}
