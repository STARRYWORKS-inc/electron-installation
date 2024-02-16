import { TabPageApi } from "tweakpane";
import Motor from "./motor";

export class MotorGui {
	motor: Motor;
	parent: TabPageApi;
	id: number;

	runSpeed: number = 100;
	goToRotation: number = 0;
	moveRotation: number = 1;
	servoTargetRotation: number = 0;

	constructor(parent: TabPageApi, motor: Motor, id: number) {
		this.parent = parent;
		this.motor = motor;
		this.id = id;
		// basic
		const basicFolder = this.parent.addFolder({ title: "Basic Settings", expanded: false });
		basicFolder
			.addButton({ title: "Get Micro Step Mode" })
			.on("click", this.motor.getMicroStepMode);
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
		basicFolder.addBinding(this.motor, "reportBusy");
		basicFolder.addBinding(this.motor, "busy", { readonly: true });
		// homing
		const homingFolder = this.parent.addFolder({ title: "Homing", expanded: false });
		homingFolder.addBinding(this.motor, "homeSwReport");
		homingFolder.addBinding(this.motor, "homeSw", { readonly: true });
		homingFolder.addButton({ title: "Homing" }).on("click", this.motor.homing);
		homingFolder.addButton({ title: "Get Homing Status" }).on("click", this.motor.getHomingStatus);
		homingFolder
			.addButton({ title: "Get Homing Direction" })
			.on("click", this.motor.getHomingDirection);
		homingFolder.addButton({ title: "Get Homing Speed" }).on("click", this.motor.getHomingSpeed);
		homingFolder.addButton({ title: "Get Home Switch Mode" }).on("click", this.motor.getHomeSwMode);
		homingFolder.addBinding(this.motor, "homingDirection", {
			min: 0,
			max: 1,
			step: 1,
			label: "Direction",
		});
		homingFolder.addBinding(this.motor, "homingSpeed", {
			min: 0,
			max: 15625,
			step: 0.1,
			label: "Speed",
		});
		homingFolder.addBinding(this.motor, "homeSwMode", {
			min: 0,
			max: 1,
			step: 1,
			label: "Switch Mode",
		});
		// run and stop
		const runAndStopFolder = this.parent.addFolder({ title: "Run and Stop", expanded: false });
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "runSpeed", {
			min: -1000,
			max: 1000,
			step: 1,
			label: "speed",
		});
		runAndStopFolder.addButton({ title: "Run" }).on("click", () => {
			this.motor.run(this.runSpeed);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "goToRotation", {
			min: -100,
			max: 100,
			step: 0.25,
			label: "rotation",
		});
		runAndStopFolder.addButton({ title: "goTo" }).on("click", () => {
			this.motor.goToByAngle(this.goToRotation * 360);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addBinding(this, "moveRotation", {
			min: -1,
			max: 1,
			step: 0.01,
			label: "rotation",
		});
		runAndStopFolder.addButton({ title: "Move" }).on("click", () => {
			this.motor.moveByAngle(this.moveRotation * 360);
		});
		runAndStopFolder.addBlade({ view: "separator" });
		runAndStopFolder.addButton({ title: "Soft stop" }).on("click", this.motor.softStop);
		runAndStopFolder.addButton({ title: "Hard stop" }).on("click", this.motor.hardStop);

		// servo mode
		const servoModeFolder = this.parent.addFolder({ title: "Servo Mode", expanded: false });
		servoModeFolder.addBinding(this.motor, "servoMode", { label: "Enabled" });
		servoModeFolder.addBlade({ view: "separator" });
		servoModeFolder.addBinding(this, "servoTargetRotation", {
			min: -100,
			max: 100,
			step: 0.25,
			label: "rotation",
		});
		servoModeFolder.addButton({ title: "Set Target Position" }).on("click", () => {
			this.motor.setTargetPositionByAngle(this.servoTargetRotation * 360);
		});
	}
}
