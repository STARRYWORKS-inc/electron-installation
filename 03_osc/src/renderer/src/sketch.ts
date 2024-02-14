import p5 from "p5";
import { Osc } from "./osc";

export const sketch = (p: p5): void => {
	let oscText: string = "";
	const osc: Osc = new Osc();

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		// OSC受信イベント
		osc.on(osc.MESSAGE, (address: string, args: []) => {
			oscText = `address: ${address}\nargs:\n${JSON.stringify(args)}\n`;
		});
	};

	p.keyPressed = (): void => {
		osc.send("localhost", 10000, "/keypress", [p.key]);
	};

	p.mouseMoved = (): void => {
		osc.send("localhost", 10000, "/mouse/position", [p.mouseX, p.mouseY])
	};

	p.mousePressed = (): void => {
		osc.send("localhost", 10000, "/mouse/button", [1]);
	};

	p.mouseReleased = (): void => {
		osc.send("localhost", 10000, "/mouse/button", [0]);
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
