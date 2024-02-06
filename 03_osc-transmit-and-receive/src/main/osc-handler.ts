import OSC from "osc-js";
import { getLocalAddress } from "./utils";
import { BrowserWindow, IpcMainInvokeEvent, ipcMain } from "electron";

interface Props {
  mainWindow: BrowserWindow;
}
/**
 * 自身のIPアドレスとポート番号
 */
const local = { host : getLocalAddress(), port: '9000', }

/**
 * 送信先のIPアドレスとポート番号
 */
const remote = { host: 'localhost', port: '3333', }

/**
 * OSC通信の設定
 */
const option = { type: 'udp4', open: local, send: remote, };

/**
 * OSC通信をハンドリングする
 */
export const oscHandler = ({mainWindow}: Props) => {
  console.log('oscHandler', {option});
  const osc = new OSC({ plugin: new OSC.DatagramPlugin(option) });
  osc.on('open', () => console.info(`OSC Opened`));
  osc.on('close', () => console.info(`OSC Closed`));
  osc.on('*', (message)=> {
    mainWindow.webContents.send('OscReceived', message);
  })
  osc.open();

  /**
   * OSC送信
   * Rendererから送信するOSCメッセージを受け取り、OSC送信を実施
   */
  ipcMain.handle('OscSend', (_: IpcMainInvokeEvent, message:any) => {
    console.log('OSC Send Message',{message});
    osc.send(new OSC.Message(message.address, message.arg));
  });
}

