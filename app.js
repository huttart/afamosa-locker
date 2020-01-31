const {
  app,
  BrowserWindow
} = require('electron')
const url = require("url");
const path = require("path");
const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let appWindow, rfidWorkerWindow

process.on('uncaughtException', function (err) {
  console.log(err);
})

function initWindow() {
  appWindow = new BrowserWindow({
    width: 800,
    height: 1024,
    webPreferences: {
      nodeIntegration: true
    }
  })

  appWindow.setMenu(null);

  appWindow.webContents.on('crashed', (e) => {
    app.relaunch();
    app.quit();
    console.log(e);
  });

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // Initialize the DevTools.
  appWindow.webContents.openDevTools()

  appWindow.on('closed', function () {
    appWindow = null
  })

  appWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  creatRfidWokerWindow();
}

function creatRfidWokerWindow() {
  rfidWorkerWindow = new BrowserWindow({
    show: false,
    // width: 800,
    // height: 600,
    webPreferences: { nodeIntegration: true }
  })
  rfidWorkerWindow.webContents.on('crashed', (e) => {
    rfidWorkerWindow.destroy();
    creatWokerWindow();
  });
  rfidWorkerWindow.loadFile('./worker-service/rfid-service/rfid-worker.html');
  // rfidWorkerWindow.webContents.openDevTools()
  rfidWorkerWindow.on('closed', function () {
    rfidWorkerWindow = null
  })
}

function sendWindowMessage(targetWindow, message, payload) {
  if (typeof targetWindow === 'undefined') {
    console.log('Target window does not exist');
    return;
  }
  targetWindow.webContents.send(message, payload);
}

app.on('ready', async () => {
  initWindow();

  ipcMain.on('message-from-worker', (event, arg) => {
    sendWindowMessage(appWindow, 'message-from-worker', arg);
  });

  ipcMain.on('message-from-main-renderer', (event, arg) => {
    sendWindowMessage(rfidWorkerWindow, 'message-from-main-renderer', arg);
  });

  ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
  });

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

})

app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (win === null) {
    initWindow()
  }
})


autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
