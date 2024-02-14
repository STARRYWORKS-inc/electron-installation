
export default class Motor {
	readonly port: number = 50000;
	boardId: number = 1;
	id: number;
	stepAngle: number = 1.8;

	sendOsc: (
		host: string,
		port: number,
		address: string,
		args: (string | number | boolean | null | Blob)[],
	) => void;

	#_microStepMode: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 = 7;
	#_reportError: boolean = true;
	#_reportBusy: boolean = false;
	#_busy: boolean = false;
	#_homingDirection: 0 | 1 = 0;
	#_homeSw: boolean = false;
	#_homeSwReport: boolean = false;
	#_homingSpeed: number = 100;
	#_homeSwMode: 0 | 1 = 0; // 0: hard stop, 1: no stopping
	#_servoMode: boolean = false;

	/**
	 * constructor
	 * @param id
	 * @param osc
	 * @param config JSON object from ponor's repository https://github.com/ponoor/step-series-support
	 */
	constructor(
		id: number,
		sendOsc: (
			host: string,
			port: number,
			address: string,
			args: (string | number | boolean | null | Blob)[],
		) => void,
		config?: any,
		stepAngle: number = 1.8,
	) {
		this.id = Math.floor(id);
		this.sendOsc = sendOsc;
		this.stepAngle = stepAngle;
		if (this.id < 1 || this.id > 4) {
			throw new Error("Motor ID must be 1 to 4");
		}
		this.setDestIp();
		if (config) this.applySettingsFromConfig(config);
		this.getMicroStepMode();
		this.getHomeSw();
		this.getHomeSwMode();
		this.getHomingDirection();
		this.getHomingSpeed();
	}

	/**
	 *
	 * @param address
	 * @param message
	 */
	oscReceived = (address: string, args: (string | number | boolean | null | Blob)[]): void => {
		console.log(address, args);
		switch (address) {
			case "/busy":
				if (args[0] == this.id) this.#_busy = args[1] == 1;
				break;
			case "/microStepMode":
				if (args[0] == this.id) this.#_microStepMode = args[1] as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
				break;
			case "/homeSw":
				if (args[0] == this.id) this.#_homeSw = args[1] == 1;
				break;
			case "/homeSwMode":
				if (args[0] == this.id) this.#_homeSwMode = args[1] as 0 | 1;
				break;
			case "/homingDirection":
				if (args[0] == this.id) this.#_homingDirection = args[1] as 0 | 1;
				break;
			case "/homingSpeed":
				if (args[0] == this.id) this.#_homingSpeed = args[1] as number;
				break;
			default:
				break;
		}
	};

	/**
	 * apply settings from config file
	 * @param config JSON object from ponor's repository
	 */
	applySettingsFromConfig(config: any): void {
		console.log(config["voltageMode"]);
		const voltageMode = config["voltageMode"];
		this.sendOsc(this.host, this.port, "/setKval", [
			this.id,
			voltageMode["KVAL_HOLD"][0],
			voltageMode["KVAL_RUN"][0],
			voltageMode["KVAL_ACC"][0],
			voltageMode["KVAL_DEC"][0],
		]);
		const speedProfile = config["speedProfile"];
		this.sendOsc(this.host, this.port, "/setSpeedProfile", [
			this.id,
			speedProfile["acc"][0],
			speedProfile["dec"][0],
			speedProfile["maxSpeed"][0],
		]);
		console.log(config["speedProfile"]);
		console.log(config["servoMode"]);
		const servoMode = config["servoMode"];
		this.sendOsc(this.host, this.port, "/setServoParam", [
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
		this.sendOsc(this.host, this.port, "/setDestIp", []);
	};

	getVersion = (): void => {
		this.sendOsc(this.host, this.port, "/getVersion", []);
	};

	getMicroStepMode = (): void => {
		this.sendOsc(this.host, this.port, "/getMicroStepMode", [this.id]);
	};

	get microStepMode(): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 {
		return this.#_microStepMode;
	}

	set microStepMode(value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) {
		this.#_microStepMode = value;
		this.sendOsc(this.host, this.port, "/setMicroStepMode", [this.id, this.#_microStepMode]);
	}

	getKval = (): void => {
		this.sendOsc(this.host, this.port, "/getKval", [this.id]);
	};

	getSpeedProfile = (): void => {
		this.sendOsc(this.host, this.port, "/getSpeedProfile", [this.id]);
	};

	getServoParam = (): void => {
		this.sendOsc(this.host, this.port, "/getServoParam", [this.id]);
	};

	getBusy = (): void => {
		this.sendOsc(this.host, this.port, "/getBusy", [this.id]);
	};

	get reportBusy(): boolean {
		return this.#_reportBusy;
	}

	set reportBusy(value: boolean) {
		this.#_reportBusy = value;
		this.sendOsc(this.host, this.port, "/reportBusy", [this.id, this.#_reportBusy ? 1 : 0]);
	}

	get busy(): boolean {
		return this.#_busy;
	}

	get reportError(): boolean {
		return this.#_reportError;
	}

	set reportError(value: boolean) {
		this.#_reportError = value;
		this.sendOsc(this.host, this.port, "/reportError", [this.#_reportError ? 1 : 0]);
	}

	/**
	 * homing
	 */

	homing = (): void => {
		this.sendOsc(this.host, this.port, "/homing", [this.id]);
	};

	getHomeSw = (): void => {
		this.sendOsc(this.host, this.port, "/getHomeSw", [this.id]);
	};

	get homeSw(): boolean {
		return this.#_homeSw;
	}

	set homeSw(value: boolean) {
		this.#_homeSw = value;
		this.sendOsc(this.host, this.port, "/setHomeSw", [this.id, this.#_homeSw ? 1 : 0]);
	}

	get homeSwReport(): boolean {
		return this.#_homeSwReport;
	}

	set homeSwReport(value: boolean) {
		this.#_homeSwReport = value;
		this.sendOsc(this.host, this.port, "/enableHomeSwReport", [
			this.id,
			this.#_homeSwReport ? 1 : 0,
		]);
	}

	getHomingStatus = (): void => {
		this.sendOsc(this.host, this.port, "/getHomingStatus", [this.id]);
	};

	setHomingDirection = (direction: 0 | 1): void => {
		this.sendOsc(this.host, this.port, "/setHomingDirection", [this.id, direction]);
	};

	get homingDirection(): 0 | 1 {
		return this.#_homingDirection;
	}
	set homingDirection(value: 0 | 1) {
		this.#_homingDirection = value;
		this.sendOsc(this.host, this.port, "/setHomingDirection", [this.id, this.#_homingDirection]);
	}

	getHomingDirection = (): void => {
		this.sendOsc(this.host, this.port, "/getHomingDirection", [this.id]);
	};

	get homingSpeed(): number {
		return this.#_homingSpeed;
	}

	set homingSpeed(value: number) {
		this.#_homingSpeed = value;
		this.sendOsc(this.host, this.port, "/setHomingSpeed", [this.id, this.#_homingSpeed]);
	}

	getHomingSpeed = (): void => {
		this.sendOsc(this.host, this.port, "/getHomingSpeed", [this.id]);
	};

	get homeSwMode(): 0 | 1 {
		return this.#_homeSwMode;
	}

	set homeSwMode(value: 0 | 1) {
		this.#_homeSwMode = value;
		this.sendOsc(this.host, this.port, "/setHomeSwMode", [this.id, this.#_homeSwMode]);
	}

	getHomeSwMode = (): void => {
		this.sendOsc(this.host, this.port, "/getHomeSwMode", [this.id]);
	};

	/**
	 * run and stop
	 */

	run = (speed: number): void => {
		this.sendOsc(this.host, this.port, "/run", [this.id, speed]);
	};

	move = (steps: number): void => {
		this.sendOsc(this.host, this.port, "/move", [this.id, steps]);
	};

	moveByAngle = (angle: number): void => {
		const steps = Math.round(angle / (this.stepAngle / Math.pow(2, this.#_microStepMode)));
		this.sendOsc(this.host, this.port, "/move", [this.id, steps]);
	};

	goTo = (steps: number): void => {
		this.sendOsc(this.host, this.port, "/goTo", [this.id, steps]);
	};

	goToByAngle = (angle: number): void => {
		const steps = Math.round(angle / (this.stepAngle / Math.pow(2, this.#_microStepMode)));
		this.sendOsc(this.host, this.port, "/goTo", [this.id, steps]);
	};

	softStop = (): void => {
		this.sendOsc(this.host, this.port, "/softStop", [this.id]);
	};

	hardStop = (): void => {
		this.sendOsc(this.host, this.port, "/hardStop", [this.id]);
	};

	/**
	 * servo mode
	 */
	get servoMode(): boolean {
		return this.#_servoMode;
	}

	set servoMode(value: boolean) {
		this.#_servoMode = value;
		this.sendOsc(this.host, this.port, "/enableServoMode", [this.id, this.#_servoMode ? 1 : 0]);
	}

	setTargetPosition = (position: number): void => {
		this.sendOsc(this.host, this.port, "/setTargetPosition", [this.id, position]);
	};

	setTargetPositionByAngle = (angle: number): void => {
		const position = Math.round(angle / (this.stepAngle / Math.pow(2, this.#_microStepMode)));
		this.sendOsc(this.host, this.port, "/setTargetPosition", [this.id, position]);
	};
}
