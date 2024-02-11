import { Osc } from "./osc";

export default class Motor {
	readonly port: number = 50000;
	boardId: number = 1;
	id: number;
	osc: Osc;
	stepAngle: number = 1.8;

	#_reportError = true;
	#_homingDirection: 0 | 1 = 0;
	#_homingSpeed: number = 100;
	#_servoMode: boolean = false;

	/**
	 * constructor
	 * @param id
	 * @param osc
	 * @param config JSON object from ponor's repository https://github.com/ponoor/step-series-support
	 */
	constructor(id: number, osc: Osc, config?: any, stepAngle: number = 1.8) {
		this.id = Math.floor(id);
		this.stepAngle = stepAngle / 128;
		if (this.id < 1 || this.id > 4) {
			throw new Error("Motor ID must be 1 to 4");
		}
		this.osc = osc;
		this.setDestIp();
		if (config) this.applySettingsFromConfig(config);
		this.homingDirection = this.#_homingDirection;
		this.homingSpeed = this.#_homingSpeed;
	}


	/**
	 * apply settings from config file
	 * @param config JSON object from ponor's repository
	 */
	applySettingsFromConfig(config: any): void {
		console.log(config["voltageMode"]);
		const voltageMode = config["voltageMode"];
		this.osc.send(this.host, this.port, "/setKval", [
			this.id,
			voltageMode["KVAL_HOLD"][0],
			voltageMode["KVAL_RUN"][0],
			voltageMode["KVAL_ACC"][0],
			voltageMode["KVAL_DEC"][0],
		]);
		const speedProfile = config["speedProfile"];
		this.osc.send(this.host, this.port, "/setSpeedProfile", [
			this.id,
			speedProfile["acc"][0],
			speedProfile["dec"][0],
			speedProfile["maxSpeed"][0],
		]);
		console.log(config["speedProfile"]);
		console.log(config["servoMode"]);
		const servoMode = config["servoMode"];
		this.osc.send(this.host, this.port, "/setServoParam", [
			this.id,
			servoMode["kP"][0],
			servoMode["kI"][0],
			servoMode["kD"][0],
		]);
	}

	/**
	 * get ip address
	 */
	get host(): string {
		return `10.0.0.10${this.boardId}`;
	}

	/**
	 * basic settings and commands
	 */

	setDestIp = (): void => {
		this.osc.send(this.host, this.port, "/setDestIp", []);
	};

	getVersion = (): void => {
		this.osc.send(this.host, this.port, "/getVersion", []);
	};

	getKval = (): void => {
		this.osc.send(this.host, this.port, "/getKval", [this.id]);
	};

	getSpeedProfile = (): void => {
		this.osc.send(this.host, this.port, "/getSpeedProfile", [this.id]);
	};

	getServoParam = (): void => {
		this.osc.send(this.host, this.port, "/getServoParam", [this.id]);
	};

	get reportError(): boolean {
		return this.#_reportError;
	}

	set reportError(value: boolean) {
		this.#_reportError = value;
		this.osc.send(this.host, this.port, "/reportError", [this.#_reportError ? 1 : 0]);
	}

	/**
	 * homing
	 */

	homing = (): void => {
		this.osc.send(this.host, this.port, "/homing", [this.id]);
	};

	getHomingStatus = (): void => {
		this.osc.send(this.host, this.port, "/getHomingStatus", [this.id]);
	};

	setHomingDirection = (direction: 0 | 1): void => {
		this.osc.send(this.host, this.port, "/setHomingDirection", [this.id, direction]);
	};

	get homingDirection(): 0 | 1 {
		return this.#_homingDirection;
	}
	set homingDirection(value: 0 | 1) {
		this.#_homingDirection = value;
		this.osc.send(this.host, this.port, "/setHomingDirection", [this.id, this.#_homingDirection]);
	}

	getHomingDirection = (): void => {
		this.osc.send(this.host, this.port, "/getHomingDirection", [this.id]);
	};

	get homingSpeed(): number {
		return this.#_homingSpeed;
	}

	set homingSpeed(value: number) {
		this.#_homingSpeed = value;
		this.osc.send(this.host, this.port, "/setHomingSpeed", [this.id, this.#_homingSpeed]);
	}

	getHomingSpeed = (): void => {
		this.osc.send(this.host, this.port, "/getHomingSpeed", [this.id]);
	};

	/**
	 * run and stop
	 */

	run = (speed: number): void => {
		this.osc.send(this.host, this.port, "/run", [this.id, speed]);
	};

	move = (steps: number): void => {
		this.osc.send(this.host, this.port, "/move", [this.id, steps]);
	};

	moveByAngle = (angle: number): void => {
		const steps = Math.round(angle / this.stepAngle);
		this.osc.send(this.host, this.port, "/move", [this.id, steps]);
	};

	goTo = (steps: number): void => {
		this.osc.send(this.host, this.port, "/goTo", [this.id, steps]);
	};

	goToByAngle = (angle: number): void => {
		const steps = Math.round(angle / this.stepAngle);
		this.osc.send(this.host, this.port, "/goTo", [this.id, steps]);
	};

	softStop = (): void => {
		this.osc.send(this.host, this.port, "/softStop", [this.id]);
	};

	hardStop = (): void => {
		this.osc.send(this.host, this.port, "/hardStop", [this.id]);
	};

	/**
	 * servo mode
	 */
	get servoMode(): boolean {
		return this.#_servoMode;
	}

	set servoMode(value: boolean) {
		this.#_servoMode = value;
		this.osc.send(this.host, this.port, "/enableServoMode", [this.id, this.#_servoMode ? 1 : 0]);
	}

	setTargetPosition = (position: number): void => {
		this.osc.send(this.host, this.port, "/setTargetPosition", [this.id, position]);
	};

	setTargetPositionByAngle = (angle: number): void => {
		const position = Math.round(angle / this.stepAngle);
		this.osc.send(this.host, this.port, "/setTargetPosition", [this.id, position]);
	};
}
