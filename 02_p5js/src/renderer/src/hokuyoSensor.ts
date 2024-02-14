import EventEmitter from "events";

export class HokuyoSensor extends EventEmitter {
	UPDATE: string = "update";


	constructor() {
		super();
		window.electron.ipcRenderer.on("OscReceived", this.#onOscReceived);
	}

	/**
	 * OSCメッセージ受信時の処理
	 * @param _
	 * @param message
	 */
	#onOscReceived = (_, address: string, args: (number | string | Blob | null)[]): void => {
		const touches: { x: number; y: number; id: number }[] = [];
		for (let i = 1; i < args.length; i += 3) {
			touches.push({
				x: args[i] as number,
				y: args[i + 1] as number,
				id: args[i + 2] as number,
			});
		}
		this.emit(this.UPDATE, touches);
	};

	/**
	 * OSCメッセージを送信する
	 * @param address
	 * @param values
	 */
	send(
		host: string,
		port: number,
		address: string,
		values: (number | string | boolean | null | Blob)[],
	): void {
		// ElectronのIPCでメインプロセスにOSCメッセージを送信する
		window.electron.ipcRenderer.invoke("OscSend", host, port, address, values);
	}
}
