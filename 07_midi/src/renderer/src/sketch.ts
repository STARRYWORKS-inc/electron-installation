import p5 from "p5";
import { ListBladeApi, Pane } from "tweakpane";
import { BindingApi } from "@tweakpane/core";
import { Midi } from "./midi";

export const sketch = (p: p5): void => {
	const gui = new Pane({ title: "Config" });
	const midi = new Midi();
	const params = {
		lastMessage: "",
	};

	/**
	 * Setup
	 */
	p.setup = (): void => {
		p.createCanvas(p.windowWidth, p.windowHeight);
		// radiusBiding = gui.addBinding(params, "radius", { min: 10, max: 200, step: 1 });
		// gui.addButton({ title: "Animate" }).on("click", animate);
		midi.on(midi.READY, () => {
			const list = gui.addBlade({
				view: "list",
				label: "MIDI Input",
				options: midi.deviceNameList.map((name, index) => {
					return { text: name, value: index };
				}),
				value: midi.deviceIndex,
			}) as ListBladeApi<number>;

			list.on("change", () => {
				console.log(list.value);
				midi.deviceIndex = list.value;
			});
			gui.addBinding(params, "lastMessage", {
				readonly: true,
				multiline: true,
				rows: 8,
			}) as BindingApi<string>;

		});

		midi.on(
			midi.RECEIVED,
			(message: {
				message: WebMidi.MIDIMessageEvent;
				cmd: number;
				channel: number;
				type: number;
				note: number;
				velocity: number;
			}) => {
				console.log(message);
				params.lastMessage = `cmd:${message.cmd}\nchannel:${message.channel}\ntype:${message.type}\nnote:${message.note}\nvelocity:${message.velocity}`;
				gui.refresh();
			},
		);
	};

	/**
	 * Draw
	 */
	p.draw = (): void => {
		p.background(250);
		p.noStroke();
		p.fill(255, 0, 0, 128);
	};

	/**
	 * Window Resized
	 */
	p.windowResized = (): void => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};
};
