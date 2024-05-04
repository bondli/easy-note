/**
 * Eletron.js
 * 封装了 web 与 electron 的通信
 */
export default class Electron {
  static isInElectron() {
    return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
  }

  static setStore(key, value) {
    if (!this.isInElectron()) {
      window.localStorage.setItem(key, value);
      return;
    }
    window.electron?.ipcRenderer?.setStoreValue(key, value);
  }

  static getStore(key) {
    if (!this.isInElectron()) {
      return window.localStorage.getItem(key);
    }
    return window.electron?.ipcRenderer?.getStoreValue(key);
  }

  static deleteStore(key) {
    if (!this.isInElectron()) {
      window.localStorage.removeItem(key);
      return;
    }
    window.electron?.ipcRenderer?.deleteStore(key);
  }

  // 保存登录的用户信息
  static saveLoginData(data) {
    this.setStore('loginData', data);
  }

  static getLoginData() {
    return this.getStore('loginData');
  }

  // 删除登录的用户信息
  static deleteLoginData() {
    this.deleteStore('loginData');
  }

}
