import EventEmitter from "events";
import OSC from "osc-js";

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
	#onOscReceived = (_, message: OSC.Message): void => {
		console.log("OSC Received Message ", { message });
		this.lastMessage = `address: ${message.address}\nargs:\n${message.args.join("\n")}\n`;
		this.emit(this.MESSAGE, message);
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
		values: Array<number | string | boolean>,
	): void {
		// ElectronのIPCでメインプロセスにOSCメッセージを送信する
		window.electron.ipcRenderer.invoke("OscSend", host, port, address, values);
	}
}
