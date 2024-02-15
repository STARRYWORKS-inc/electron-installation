import osc from "osc";
import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";
import { getPreferredLocalAddress } from "./utils";

// 10.0.0で始まるIPアドレスを優先してローカルのIPアドレスを取得 (なければ最初のIPアドレスを使用)
const localIP = getPreferredLocalAddress("10.0.0");

/**
 * OSC通信をハンドリングするクラス
 */
export class OscHandler {
	mainWindow: BrowserWindow;
	udpPort: osc.UDPPort;
	ready: boolean = false;
	destroyed: boolean = false;

	/**
	 * コンストラクタ
	 * @param mainWindow
	 */
	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;

		this.udpPort = new osc.UDPPort({
			localPort: 10000,
			metadata: true,
			broadcast: true,
		});
		this.udpPort.options.localAddress = undefined; // osc.jsのバグ回避。これにより全てのアドレス宛のメッセージを受信する
		this.udpPort.on("message", this.#onReceive);
		this.udpPort.open();
		this.udpPort.on("ready", () => {
			this.ready = true;
		});
		ipcMain.handle("OscSend", this.#onSend);
	}

	/**
	 * 破棄処理
	 */
	dispose(): void {
		this.ready = false;
		this.destroyed = true;
		this.udpPort.off("message", this.#onReceive);
		ipcMain.removeHandler("OscSend");
		this.udpPort.close();
	}

	/**
	 * 受信したOSCメッセージをフロント側に受け渡す
	 * @param message
	 */
	#onReceive = (oscMsg, timeTag, info): void => {
		if (this.destroyed) return;
		const address = oscMsg.address;
		const values: (number | string | Blob | null)[] = [];
		oscMsg.args.map((arg) => {
			values.push(arg.value);
		});
		console.log("OSC Received Message ", { address, values, info });
		this.mainWindow.webContents.send("OscReceived", address, values, info);
	};

	/**
	 * フロント側からのOSCメッセージ送信を処理する
	 * @param _
	 * @param host
	 * @param port
	 * @param address
	 * @param values
	 */
	#onSend = (
		_: IpcMainInvokeEvent,
		host: string,
		port: number,
		address: string,
		values: string[] | number[],
	): void => {
		if (this.destroyed || !this.ready) return;

		const args = values.map((value) => {
			if (typeof value === "string") {
				return {
					type: "s",
					value,
				};
			}
			if (typeof value === "number") {
				if (value % 1 === 0) {
					return {
						type: "i",
						value,
					};
				}
				return {
					type: "f",
					value,
				};
			}
			if (value instanceof Blob) {
				return {
					type: "b",
					value,
				};
			}
			return {
				type: "s",
				value: value.toString(),
			};
		});
		console.log("OSC Send Message ", { host: host, port, address, args });
		this.udpPort.send({ address, args }, host, port);
	};
}
