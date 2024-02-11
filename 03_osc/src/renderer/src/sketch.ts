import p5 from "p5";
import OSC from "osc-js";

export const sketch = (p: p5): void => {
	let oscText: string = "";



	/**
	 * OSCメッセージ受信時の処理
	 * @param _
	 * @param message
	 */
	const onOscReceived = (_, message: OSC.Message): void => {
		console.log("OSC Received Message ", { message });
		oscText = JSON.stringify(message, null, 2);
	};

	/**
	 * キーボードイベント発生時の処理
	 * @param e
	 */
	const onKeyDown = (e: KeyboardEvent): void => {
		console.log("keydown", e.key);
		// ElectronのIPCでメインプロセスにOSCメッセージを送信する
		window.electron.ipcRenderer.invoke("OscSend", "/keydown", [e.key]);
	};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		// OSC受信イベント
		window.electron.ipcRenderer.on("OscReceived", onOscReceived);
		// キーボードイベント
		window.addEventListener("keydown", onKeyDown);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		p.background(250);
		p.noStroke();
		p.fill(0, 0, 200);
		p.textAlign(p.LEFT, p.CENTER);
		p.text(oscText, 10, 10, p.width - 20, p.height - 20);
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
