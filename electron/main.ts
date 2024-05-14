import * as fs from 'fs';
import * as path from 'path';
import { app, ipcMain, BrowserWindow, globalShortcut } from 'electron';
import { fork } from 'child_process';
import Store from 'electron-store';
import logger from 'electron-log';

// file position on macOS: ~/Library/Logs/{app name}/main.log
logger.transports.file.fileName = 'main.log';
logger.transports.file.level = 'info';
logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';

// 数据持久化
const store = new Store();

// 通过bridge的方式开放给渲染进程的功能
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

  // 打日志
  ipcMain.on('userLog', (_, message) => {
    logger.info(message);
  });

  // 导出数据库
  ipcMain.on('export-data', () => {
    const filePath = path.join(app.getPath('downloads'), './easynote-database.db');
    const fileToDownload = path.join(app.getPath('userData'), './sqlite3/database.db');

    // 从用户数据目录拷贝文件到下载路径
    try {
      fs.copyFileSync(fileToDownload, filePath);
      logger.info('database copyed to downloads directory');
    } catch(err) {
      logger.error(err);
    }
  });

  // 导入数据库
  ipcMain.on('import-data', () => {
    const filePath = path.join(app.getPath('downloads'), './easynote-database.db');
    const fileToUploadload = path.join(app.getPath('userData'), './sqlite3/database.db');

    // 从用户数据目录拷贝文件到下载路径
    try {
      fs.copyFileSync(filePath, fileToUploadload);
      logger.info('database copyed to application data directory');
    } catch(err) {
      logger.error(err);
    }
  });
};

// 定义ipcRenderer监听事件
initIpcRenderer();

let nodeServerStatus = false;

// 启动服务器
const startNodeServer = () => {
  const child = fork(path.join(__dirname,'./server/index'), [], {
    env: {
      ...process.env,
      DBPATH: path.join(app.getPath('userData'), './sqlite3/database.db'),
    },
  });

  nodeServerStatus = true;

  child.on('error', (err) => {
    logger.info("server error: spawn failed! (" + err + ")");
  });

  child.on('data', (data) => {
    logger.info('server stdout: ' , data);
  });

  child.on('exit', (code, signal) => {
    nodeServerStatus = false;
    logger.info('server exit code: ', code);
    logger.info('server exit signal: ', signal);
  });

  child.unref();
  //on parent process exit, terminate child process too.
  process.on('exit', () => {
    child.kill();
  });
};

let mainWindow: any = null;

const createWindow = () => {
  // 不重复启动server
  if (!nodeServerStatus) {
    startNodeServer();
  }
  mainWindow = new BrowserWindow({
    title: 'EasyNote',
    center: true,
    autoHideMenuBar: true,
    resizable: true,
    width: 1200,
    height: 720,
    minWidth: 800,
    minHeight: 600,
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
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// 绑定 ready 方法，当 electron 应用创建成功时，创建一个窗口。
app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Alt+D', () => {
    mainWindow.webContents.isDevToolsOpened()
      ? mainWindow.webContents.closeDevTools()
      : mainWindow.webContents.openDevTools();
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
    mainWindow.setIcon('dist/electron/icons/Icon.ico');
  }

  // 绑定 activate 方法，当 electron 应用激活时，创建一个窗口。这是为了点击关闭按钮之后从 dock 栏打开。
  app.on('activate', () => {
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
app.on('window-all-closed', () => {
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
