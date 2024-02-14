import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";
import { DAC } from "@laser-dac/core";
import { EtherDream } from "@laser-dac/ether-dream";
import { Scene, Rect, Circle } from "@laser-dac/draw";
import { ShapeData } from "./shape";

/**
 * ILDA通信をハンドリングするクラス
 */
export class IldaHandler {
	mainWindow: BrowserWindow;
	dac: DAC;
	scene: Scene;
	shapeData: ShapeData = [];

	/**
	 * コンストラクタ
	 * @param mainWindow
	 */
	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
		ipcMain.handle("IldaSend", this.#onSend);
		//
		this.dac = new DAC();
		// this.dac.use(new Simulator());
		this.dac.use(new EtherDream());
		this.scene = new Scene({ resolution: 100 });
		this.init();
	}

	async init(): Promise<void> {
		await this.dac.start();
		this.scene.start(this.#render);
		this.dac.stream(this.scene, 30000, 30);
	}

	#render = (): void => {
		this.shapeData.map((shape) => {
			if (shape.type == "circle") {
				const circle = new Circle({ ...shape });
				this.scene.add(circle);
			} else if (shape.type == "rect") {
				const rect = new Rect({ ...shape });
				this.scene.add(rect);
			}
		});
	};

	dispose(): void {
		ipcMain.removeHandler("IldaSend");
	}

	/**
	 * フロント側からのILDA送信を処理する
	 * @param _
	 */
	#onSend = (_: IpcMainInvokeEvent, shapeData: ShapeData): void => {
		this.shapeData = shapeData;
	};
}
