export class Dmx {
	set(channel: number, values: number[]): void {
		window.electron.ipcRenderer.invoke("DmxSend", channel, values);
	}
}
