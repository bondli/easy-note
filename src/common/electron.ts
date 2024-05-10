/**
 * Eletron.js
 * 封装了 web 与 electron 的通信
 */

const win: any = window;
export default class Electron {
  static isInElectron() {
    return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
  }

  static setStore(key, value) {
    if (!this.isInElectron()) {
      win.localStorage.setItem(key, value);
      return;
    }
    win.electron?.ipcRenderer?.setStoreValue(key, value);
  }

  static getStore(key) {
    if (!this.isInElectron()) {
      return win.localStorage.getItem(key);
    }
    return win.electron?.ipcRenderer?.getStoreValue(key);
  }

  static deleteStore(key) {
    if (!this.isInElectron()) {
      win.localStorage.removeItem(key);
      return;
    }
    win.electron?.ipcRenderer?.deleteStore(key);
  }

  // 保存登录的用户信息
  static saveLoginData(data) {
    this.setStore('loginData', data);
  }

  // 获取用户的登录信息
  static getLoginData() {
    return this.getStore('loginData');
  }

  // 删除登录的用户信息
  static deleteLoginData() {
    this.deleteStore('loginData');
  }

  // 导出数据
  static exportData() {
    if (!this.isInElectron()) {
      return;
    }
    win.electron?.ipcRenderer?.exportData();
  }

  // 导入数据
  static importData () {
    if (!this.isInElectron()) {
      return;
    }
    win.electron?.ipcRenderer?.importData();
  }

}
