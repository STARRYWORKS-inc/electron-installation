import p5 from "p5";
import { Osc } from "./osc";
import { Person } from "./person";

export const sketch = (p: p5): void => {
	let oscText: string = "";
	let persons: Person[] = [];
	const osc: Osc = new Osc();

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		// OSC受信イベント
		persons = [];
		osc.on(osc.MESSAGE, (address: string, args: []) => {
			oscText = `address: ${address}\nargs:\n${JSON.stringify(args)}\n`;
			for (let i = 2; i < args.length; i += 96) {
				console.log(args);
				const p = new Person(args.splice(i, 96));
				if (p.id != "0") {
					persons.push(p);
				}
			}
		});
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
		persons.forEach((person) => {
			console.log("circle");
			p.circle(person.head.tx, person.head.ty, 100);
		});
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
