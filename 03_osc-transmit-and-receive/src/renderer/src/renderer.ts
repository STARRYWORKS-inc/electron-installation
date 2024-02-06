
class App {
  constructor() {
    const code = document.getElementById('OscMessage');
    // OSC受信イベントを受け取る
    window.electron.ipcRenderer.on('OscReceived', (_, message) => {
      console.log('OSC Received Message ', {message});
      if (code)code.textContent = JSON.stringify(message, null, 2);
    });

    // キーボードイベント
    window.addEventListener("keydown", (e) => {
      console.log('keydown', e.key);
      // ElectronのIPCでメインプロセスにOSCメッセージを送信する
      window.electron.ipcRenderer.invoke('OscSend', {
        address: '/keydown',
        arg: e.key
      });
    });
  }
}

function init(): void {
  window.addEventListener('DOMContentLoaded', () => new App());
}

init()
