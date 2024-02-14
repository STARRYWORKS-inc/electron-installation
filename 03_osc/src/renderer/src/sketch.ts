import p5 from "p5";
import { Osc } from "./osc";

export const sketch = (p: p5): void => {
	let oscText: string = "";
	const osc: Osc = new Osc();

	/**
	 * キーボードイベント発生時の処理
	 * @param e
	 */
	const onKeyDown = (e: KeyboardEvent): void => {
		console.log("keydown", e.key);
		// OSCメッセージの送信
		osc.send("10.0.0.11", 10000, "/keydown", [e.key]);
	};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		// OSC受信イベント
		osc.on(osc.MESSAGE, (message: any) => {
			console.log("osc message", message);
			oscText = `address: ${message.address}\nargs:\n${message.args.join("\n")}\n`;
		});
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
