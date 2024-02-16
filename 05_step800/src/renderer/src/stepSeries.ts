import Motor from "./motor";

export default class StepSeries {
	readonly port: number = 50000;
	readonly id: number;
	readonly motors: Motor[] = [];
	sendOsc: (
		host: string,
		port: number,
		address: string,
		args: (string | number | boolean | null | Blob)[],
	) => void;

	#_reportError: boolean = true;

	/**
	 * constructor
	 * @param numMotors
	 * @param sendOsc
	 * @param config JSON object from ponor's repository https://github.com/ponoor/step-series-support
	 * @param id
	 * @param stepAngle
	 */
	constructor(
		numMotors: number,
		sendOsc: (
			host: string,
			port: number,
			address: string,
			args: (string | number | boolean | null | Blob)[],
		) => void,
		config?: any,
		id: number = 1,
		stepAngle: number = 1.8,
	) {
		this.id = Math.floor(id);
		if (this.id < 1 || this.id > 8) {
			throw new Error("Step Series Board ID must be 1 to 8");
		}
		this.sendOsc = sendOsc;
		for (let i = 0; i < numMotors; i++) {
			this.motors.push(new Motor(i+1, sendOsc, config, stepAngle));
		}
		this.setDestIp();
	}

	/**
	 * get ip address
	 */
	get host(): string {
		return `10.0.0.10${this.id}`;
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

	get reportError(): boolean {
		return this.#_reportError;
	}

	set reportError(value: boolean) {
		this.#_reportError = value;
		this.sendOsc(this.host, this.port, "/reportError", [this.#_reportError ? 1 : 0]);
	}


	/**
	 * oscReceived
	 * @param address
	 * @param message
	 */
	oscReceived = (address: string, args: (string | number | boolean | null | Blob)[]): void => {
		console.log(address, args);
		this.motors.forEach((motor) => motor.oscReceived(address, args));
	};
}
