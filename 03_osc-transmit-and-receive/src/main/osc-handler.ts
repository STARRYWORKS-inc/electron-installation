import OSC from "osc-js";
import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";

// 自身のIPアドレスとポート番号
// const local = { host: getLocalAddress()[0], port: "9000" };
const local = { port: "9000" };
// 送信先のIPアドレスとポート番号
const remote = { host: "localhost", port: "3333" };
// OSC通信の設定
const option = { type: "udp4", open: local, send: remote };

/**
 * OSC通信をハンドリングするクラス
 */
export class OscHandler {
	osc: OSC;
	mainWindow: BrowserWindow;
	receiveHandler: number;

	/**
	 * コンストラクタ
	 * @param mainWindow
	 */
	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
		this.osc = new OSC({ plugin: new OSC.DatagramPlugin(option) });
		this.osc.on("open", () => console.info(`OSC Opened`));
		this.osc.on("close", () => console.info(`OSC Closed`));
		this.receiveHandler = this.osc.on("*", this.#onReceive);
		ipcMain.handle("OscSend", this.#onSend);
		//
		this.osc.open();
	}

	dispose(): void {
		this.osc.off("*", this.receiveHandler);
		ipcMain.removeHandler("OscSend");
		this.osc.close();
	}

	/**
	 * 受信したOSCメッセージをフロント側に受け渡す
	 * @param message
	 */
	#onReceive = (message: OSC.Message): void => {
		this.mainWindow.webContents.send("OscReceived", message);
	};

	/**
	 * フロント側からのOSCメッセージ送信を処理する
	 * @param _
	 * @param address
	 * @param args
	 */
	#onSend = (_: IpcMainInvokeEvent, address: string, args: string[] | number[]): void => {
		console.log("OSC Send Message ", { address, args });
		this.osc.send(new OSC.Message(address, ...args));
	};
}
