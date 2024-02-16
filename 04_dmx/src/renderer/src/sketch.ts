import p5 from "p5";
import { Pane } from "tweakpane";
import { BindingApi } from "@tweakpane/core";
import { Dmx } from "./dmx";

export const sketch = (p: p5): void => {
	const gui = new Pane({ title: "Config" });
	const dmx = new Dmx();
	const params = {
		power: 0,
		lightColor: { r: 255, g: 255, b: 255 },
	};
	let powerApi: BindingApi;
	let lightColorApi: BindingApi;

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		powerApi = gui.addBinding(params, "power", { min: 0, max: 255, step: 1 });
		lightColorApi = gui.addBinding(params, "lightColor", { min: 10, max: 200, step: 1 });
	};

	/**
	 * マウス移動
	 */
	p.mouseMoved = (): void => {
		// マウス座標を元にpowerを変更
		params.power = Math.floor((p.mouseX / window.innerWidth) * 255);
		powerApi.refresh();
		dmx.set(1, [params.power]);

		// マウス座標を元に色を決定
		params.lightColor.r = Math.floor((p.mouseX / window.innerWidth) * 255);
		params.lightColor.g = Math.floor((p.mouseY / window.innerHeight) * 255);
		params.lightColor.b = 255;
		lightColorApi.refresh();
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		p.background(params.lightColor.r, params.lightColor.g, params.lightColor.b);
	};

	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};

// ムービングライト SILVERSTAR GEMINI 100XE のチャンネル設定
// https://e-spec.jp/manual/silverstar/ss_gemini100xe_mnl.pdf
