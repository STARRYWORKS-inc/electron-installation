import p5 from "p5";
import { Pane } from "tweakpane";
import gsap from "gsap";
import { BindingApi } from "@tweakpane/core";

export const sketch = (p: p5): void => {
	const gui = new Pane({ title: "Config" });
	const params = {
		radius: 50,
	};
	let isLarge = false;
	let radiusBiding: BindingApi;

	/**
	 * Animate
	 */
	const animate = (): void => {
		const p = isLarge ? 20 : 200;
		isLarge = !isLarge;
		gsap.to(params, {
			radius: p,
			duration: 1,
			overwrite: true,
			ease: "back.inOut",
			onUpdate: () => {
				radiusBiding.refresh();
			},
		});
	};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		radiusBiding = gui.addBinding(params, "radius", { min: 10, max: 200, step: 1 });
		gui.addButton({ title: "Animate" }).on("click", animate);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		p.background(250);
		p.noStroke();
		p.fill(255, 200, 200);
		const r = params.radius;
		p.ellipse(p.width / 2, p.height / 2, r, r);
	};

	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
