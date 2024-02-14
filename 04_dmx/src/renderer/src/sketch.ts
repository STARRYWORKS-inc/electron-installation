import p5 from "p5";
import { Pane } from "tweakpane";
import { BindingApi } from "@tweakpane/core";

export const sketch = (p: p5): void => {
	const gui = new Pane({ title: "Config" });
	const params = {
		lightColor: { r: 255, g: 255, b: 255 },
	};
	let lightColorApi: BindingApi;

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		lightColorApi = gui.addBinding(params, "lightColor", { min: 10, max: 200, step: 1 });

		// マウスイベント
		window.addEventListener("mousemove", (e: MouseEvent) => {
			console.log("mousemove", e.clientX, e.clientY);
			// マウス座標を元に色を決定
			params.lightColor.r = Math.floor((e.clientX / window.innerWidth) * 255);
			params.lightColor.g = Math.floor((e.clientY / window.innerHeight) * 255);
			params.lightColor.b = 255;
			const w = 0;
			lightColorApi.refresh();
			// ElectronのIPCでメインプロセスにDMXデータを送信する
			// 0 - 255 の値を送信してください
			// 1: pan
			// 2: pan fine
			// 3: tilt
			// 4: tilt fine
			// 7: red
			// 8: green
			// 9: blue
			// 10: white
			// 11 : dimmer
			window.electron.ipcRenderer.invoke("DmxSend", 1, [params.lightColor.r]);
			window.electron.ipcRenderer.invoke("DmxSend", 3, [params.lightColor.g]);
			window.electron.ipcRenderer.invoke("DmxSend", 7, [params.lightColor.r]);
			window.electron.ipcRenderer.invoke("DmxSend", 8, [params.lightColor.g]);
			window.electron.ipcRenderer.invoke("DmxSend", 9, [params.lightColor.b]);
			window.electron.ipcRenderer.invoke("DmxSend", 11, [255]);
		});
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
