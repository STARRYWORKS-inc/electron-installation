import EventEmitter from "events";

export class Midi extends EventEmitter {
	readonly READY: string = "ready";
	readonly RECEIVED: string = "received";
	#deviceIndex = 0;
	#device?: WebMidi.MIDIInput;
	#deviceList: WebMidi.MIDIInput[] = [];
	debug = "";

	constructor() {
		super();
		this.#setup();
	}

	async #setup(): Promise<void> {
		await this.#getMidiInputs();
		// 保存してた情報がありリストの中に存在していれば設定
		if (this.#deviceList.length > 0) {
			this.deviceIndex = this.#deviceIndex;
		}
		this.emit(this.READY);
	}

	get deviceIndex(): number {
		return this.#deviceIndex;
	}

	set deviceIndex(index: number) {
		this.#deviceIndex = index;
		this.#device = this.#deviceList[this.#deviceIndex];
		this.#startListener();
	}

	get deviceNameList(): (string | undefined)[] {
		return this.#deviceList.map((device) => device.name) ?? [];
	}

	/**
	 * MIDIデバイスのリストを取得する
	 */
	#getMidiInputs = async (): Promise<void> => {
		this.#deviceList = [];
		try {
			const midiAccess = await window.navigator.requestMIDIAccess();
			const midi = midiAccess;
			const inputs = midi.inputs;
			inputs.forEach((input: WebMidi.MIDIInput) => {
				this.#deviceList.push(input);
			});
		} catch (e) {
			console.error(e);
		}
	};

	/**
	 * MIDIイベントリスナーを開始する
	 */
	#startListener = (): void => {
		if (this.#device === undefined) return;
		this.#device.onmidimessage = this.#onMidiMessage;
	};

	/**
	 * データ送信
	 */
	#onMidiMessage = (message: WebMidi.MIDIMessageEvent): void => {
		console.log(message, message.data);
		const data = message.data;
		const cmd = data[0] >> 4;
		const channel = data[0] & 0xf;
		const type = data[0] & 0xf0;
		const note = data[1];
		const velocity = data[2];
		this.emit(this.RECEIVED, {
			message: message,
			cmd: cmd,
			channel: channel,
			type: type,
			note: note,
			velocity: velocity,
		});
	};
}
