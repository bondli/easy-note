import * as path from 'path';
import { app, ipcMain, BrowserWindow, globalShortcut } from 'electron';
import Store from 'electron-store';
import startServer from './server/index';

// 数据持久化
const store = new Store();

const initIpcRenderer = () => {
  ipcMain.on('setStore', (_, key, value) => {
    store.set(key, value);
  });

  ipcMain.on('getStore', (_, key) => {
    const value = store.get(key);
    _.returnValue = value || '';
  });

  ipcMain.on('deleteStore', (_, key) => {
    store.delete(key);
    _.returnValue = '';
  });
};

// 定义ipcRenderer监听事件
initIpcRenderer();

let mainWindow: any = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    center: true,
    autoHideMenuBar: true,
    resizable: true,
    width: 1024,
    height: 576,
    webPreferences: {
      webSecurity: false,
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true, // 解决无法使用 require 加载的 bug
    },
  });
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile('dist/index.html').catch(() => null);
  }

  // 关闭 window 时触发下列事件
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
};

app.setAppUserModelId('com.easynote.react.electron');

// 绑定 ready 方法，当 electron 应用创建成功时，创建一个窗口。
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Alt+D', () => {
    mainWindow.webContents.isDevToolsOpened()
      ? mainWindow.webContents.closeDevTools()
      : mainWindow.webContents.openDevTools();
  });
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    console.log('CLOSE DEV TOOLS 关闭默认控制台打开事件1');
  });

  createWindow();

  if (!mainWindow.isFocused()) {
    mainWindow.focus();
  }

  mainWindow.setMenuBarVisibility(false); // 设置菜单栏不可见
  mainWindow.menuBarVisible = false;
  mainWindow.setAutoHideMenuBar(false);

  // eslint-disable-next-line no-undef
  if (process.platform != 'darwin') {
    mainWindow.setIcon('dist/electron/icons/icon.ico');
  }

  // 绑定 activate 方法，当 electron 应用激活时，创建一个窗口。这是为了点击关闭按钮之后从 dock 栏打开。
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
    // macOS 中点击 Dock 图标时没有已打开的其余应用窗口时，则通常在应用中重建一个窗口。
    if (mainWindow === null) {
      createWindow();
    }
  });
});

// 绑定关闭方法，当 electron 应用关闭时，退出 electron 。 macos 系统因为具有 dock 栏机制，可选择不退出。
app.on('window-all-closed', function () {
  // macOS 中除非用户按下 `Cmd + Q` 显式退出，否则应用与菜单栏始终处于活动状态。
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时，将会聚焦到 mainWindow 这个窗口。
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      mainWindow.show();
    }
  });
}

startServer();
