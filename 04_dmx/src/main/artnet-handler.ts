import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";
import Artnet from "artnet";

// 送信先のIPアドレス
const host = "10.0.0.105";

/**
 * DMX(Artnet)通信をハンドリングするクラス
 */
export class ArtnetHandler {
	artnet: Artnet;
	mainWindow: BrowserWindow;

	/**
	 * コンストラクタ
	 * @param mainWindow
	 */
	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
		this.artnet = new Artnet({ host });
		ipcMain.handle("DmxSend", this.#onSend);
	}

	dispose(): void {
		ipcMain.removeHandler("DmxSend");
	}


	/**
	 * フロント側からのDMX送信を処理する
	 * @param _
	 * @param address
	 * @param args
	 */
	#onSend = (_: IpcMainInvokeEvent, channel: number, values: number | number[]): void => {
		console.log("Dmx Send Message ", { channel, values });
		this.artnet.set(channel, values);
	};
}
