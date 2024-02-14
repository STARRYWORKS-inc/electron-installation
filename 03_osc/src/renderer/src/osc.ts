import EventEmitter from "events";

export class Osc extends EventEmitter {
	MESSAGE: string = "message";
	lastMessage: string = "";

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
		this.lastMessage = `address: ${address}\nargs:\n${args.join("\n")}\n`;
		this.emit(this.MESSAGE, address, args);
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
