import OSC from "osc-js";

class App {
	codeElement: HTMLElement;
	constructor() {
		this.codeElement = document.getElementById("OscMessage") as HTMLElement;

		// OSC受信イベント
		window.electron.ipcRenderer.on("OscReceived", this.#onOscReceived);

		// キーボードイベント
		window.addEventListener("keydown", this.#onKeyDown);
	}

	/**
	 * OSCメッセージ受信時の処理
	 * @param _
	 * @param message
	 */
	#onOscReceived = (_, message: OSC.Message): void => {
		console.log("OSC Received Message ", { message });
		if (this.codeElement) this.codeElement.textContent = JSON.stringify(message, null, 2);
	};

	/**
	 * キーボードイベント発生時の処理
	 * @param e
	 */
	#onKeyDown = (e: KeyboardEvent): void => {
		console.log("keydown", e.key);
		// ElectronのIPCでメインプロセスにOSCメッセージを送信する
		window.electron.ipcRenderer.invoke("OscSend", "/keydown", [e.key]);
	}
}

function init(): void {
	window.addEventListener("DOMContentLoaded", () => new App());
}

init();
