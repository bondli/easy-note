/**
 * Eletron.js
 * 封装了 web 与 electron 的通信
 */

const win: any = window;

const isInElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
const ipcRenderer = win.electron?.ipcRenderer || {};

const _setStore = (key, value) => {
  if (!isInElectron) {
    win.localStorage.setItem(key, value);
    return;
  }
  ipcRenderer.setStoreValue(key, value);
}

const _getStore = (key) => {
  if (!isInElectron) {
    return win.localStorage.getItem(key);
  }
  return ipcRenderer.getStoreValue(key);
}

const _deleteStore = (key) => {
  if (!isInElectron) {
    win.localStorage.removeItem(key);
    return;
  }
  ipcRenderer.deleteStore(key);
}

// 保存登录的用户信息
export const saveLoginData = (data) => {
  _setStore('loginData', data);
}

// 获取用户的登录信息
export const getLoginData = () => {
  return _getStore('loginData');
}

// 删除登录的用户信息
export const deleteLoginData = () => {
  _deleteStore('loginData');
}

// 打日志
export const userLog = (msg: any, msgData?: any) => {
  msgData ? console.log(msg, msgData) : console.log(msg);
  
  let outMsg = typeof msg === 'string' ? msg : JSON.stringify(msg);
  if (msgData) {
    outMsg += ` ${JSON.stringify(msgData)}`;
  }
  ipcRenderer.userLog(outMsg);
}

// 导出数据
export const exportData = () => {
  if (!isInElectron) {
    return;
  }
  ipcRenderer.exportData();
}

// 导入数据
export const importData = () => {
  if (!isInElectron) {
    return;
  }
  ipcRenderer.importData();
}

const ElectronBridge = {
  saveLoginData,
  getLoginData,
  deleteLoginData,
  userLog,
  exportData,
  importData,
};

export default ElectronBridge;
