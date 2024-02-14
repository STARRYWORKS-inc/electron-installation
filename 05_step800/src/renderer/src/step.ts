import { Pane } from "tweakpane";
import { Osc } from "./osc";
import { BindingApi } from "@tweakpane/core";
import * as config from "./STEP800_SM-42BYG011-25_24V.json";
import Motor from "./motor";
import OSC from "osc-js";

export class Step {
	osc: Osc;
	motor: Motor;
	gui: Pane;

	runSpeed: number = 100;
	goToSteps: number = 0;
	goToRotation: number = 0;
	moveSteps: number = 1000;
	moveRotation: number = 1;
	servoTargetPosition: number = 0;
	servoTargetRotation: number = 0;

	constructor() {
		this.osc = new Osc();
		this.motor = new Motor(1, this.#sendOsc, config);
		this.gui = new Pane({ title: "STEP 400/800" });
		// this.gui.addBinding(params, "radius", { min: 10, max: 200, step: 1 });
		const messageFolder = this.gui.addFolder({ title: "Message" });
		messageFolder.addBinding(this.osc, "lastMessage", {
			readonly: true,
			multiline: true,
			rows: 8,
		}) as BindingApi<string>;
		// basic
		const basicFolder = this.gui.addFolder({ title: "Basic Settings", expanded: false });
		basicFolder.addButton({ title: "Set Dest IP" }).on("click", this.motor.setDestIp);
		basicFolder.addButton({ title: "Get Version" }).on("click", this.motor.getVersion);
		basicFolder.addButton({ title: "Get Micro Step Mode" }).on("click", this.motor.getMicroStepMode);
		basicFolder.addButton({ title: "Get KVal" }).on("click", this.motor.getKval);
		basicFolder.addButton({ title: "Get Speed Profile" }).on("click", this.motor.getSpeedProfile);
		basicFolder.addButton({ title: "Get Servo Param" }).on("click", this.motor.getServoParam);
		basicFolder.addBinding(this.motor, "microStepMode", {
			min: 0,
			max: 7,
			step: 1,
			label: "Micro Step Mode",
			format: (v) => {
				return Math.pow(2, v);
			},
		});
		basicFolder.addBinding(this.motor, "reportError");
		basicFolder.addBinding(this.motor, "reportBusy");
		basicFolder.addBinding(this.motor, "busy", { readonly: true });
		// homing
		const homingFolder = this.gui.addFolder({ title: "Homing", expanded: false });
		homingFolder.addBinding(this.motor, "homeSwReport");
		homingFolder.addBinding(this.motor, "homeSw", { readonly: true });
		homingFolder.addButton({ title: "Homing" }).on("click", this.motor.homing);
		homingFolder.addButton({ title: "Get Homing Status" }).on("click", this.motor.getHomingStatus);
		homingFolder.addButton({ title: "Get Homing Direction" }).on("click", this.motor.getHomingDirection);
		homingFolder.addButton({ title: "Get Homing Speed" }).on("click", this.motor.getHomingSpeed);
		homingFolder.addButton({ title: "Get Home Switch Mode" }).on("click", this.motor.getHomeSwMode);
		homingFolder.addBinding(this.motor, "homingDirection", { min: 0, max: 1, step: 1, label: "Direction" });
		homingFolder.addBinding(this.motor, "homingSpeed", { min: 0, max: 15625, step: 0.1, label: "Speed"});
		homingFolder.addBinding(this.motor, "homeSwMode", { min: 0, max: 1, step: 1, label: "Switch Mode" });
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
		runAndStopFolder.addBinding(this, "goToRotation", { min: -100, max: 100, step: 0.25, label: "rotation"});
		runAndStopFolder.addButton({ title: "goTo" }).on("click", () => {
			this.motor.goToByAngle(this.goToRotation * 360);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "moveSteps", { min: -100000, max: 100000, step: 1, label: "steps"});
		runAndStopFolder.addButton({ title: "Move" }).on("click", () => {
			this.motor.move(this.moveSteps);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "moveRotation", { min: -1, max: 1, step: 0.01, label: "rotation" });
		runAndStopFolder.addButton({ title: "Move" }).on("click", () => {
			this.motor.moveByAngle(this.moveRotation * 360);
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
		servoModeFolder.addBinding(this, "servoTargetRotation", { min: -100, max: 100, step: 0.25, label: "rotation" });
		servoModeFolder.addButton({ title: "Set Target Position" }).on("click", () => {
			this.motor.setTargetPositionByAngle(this.servoTargetRotation * 360);
		});

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

	#onOscReceived = (message: OSC.Message): void => {
		this.motor.oscReceived(message.address, message.args);
		this.gui.refresh();
	};
}
