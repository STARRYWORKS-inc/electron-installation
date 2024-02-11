import OSC from "osc-js";
import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";
import { getLocalAddress } from "./utils";

// ローカルマシンのIPアドレスを全て取得
const ipAddresses = getLocalAddress().ipv4;
// 10.0.0で始まるIPアドレスを優先して取得
const localIP =
	ipAddresses.length < 1
		? "localhost"
		: ipAddresses.find((ip) => ip.address.startsWith("10.0.0"))?.address ?? ipAddresses[0].address;
// 自身のIPアドレスとポート番号
const local = { host: localIP, port: "10000" };
// 送信先の設定
const remote = { host: "localhost", port: "10000" };
// const remote = { host: "224.0.0.1", port: "10000" }; // マルチキャストアドレス（ローカルネットワーク内の全てのデバイスに送信）

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
		console.log("OSC Settings", { local, remote });
		this.mainWindow = mainWindow;
		this.osc = new OSC({ plugin: new OSC.DatagramPlugin(option) });
		this.osc.on("open", () => console.info(`OSC Opened`));
		this.osc.on("close", () => console.info(`OSC Closed`));
		this.receiveHandler = this.osc.on("*", this.#onReceive);
		ipcMain.handle("OscSend", this.#onSend);
		//
		this.osc.open();
	}

	open(port?: string, host?: string ): void {
		this.osc.close();
		this.osc.open({ open: { host, port } });
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
