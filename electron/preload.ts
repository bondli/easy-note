import { contextBridge, ipcRenderer } from 'electron';
import pkg from '../package.json';

window.addEventListener('DOMContentLoaded', () => {
  console.log('HTML DOMContentLoaded');
});

contextBridge.exposeInMainWorld('myIpc', {
  send: (channel, args) => {
    return ipcRenderer.send(channel, args);
  },
  on: (channel, listener) => {
    ipcRenderer.on(channel, (event, args) => listener(args));
  },
  exit: () => {
    console.log('destroy');
    ipcRenderer.send('destroy');
  },
  getVersion: () => pkg['version'],
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    setStoreValue: (key, value) => {
      ipcRenderer.send('setStore', key, value);
    },

    getStoreValue(key) {
      const resp = ipcRenderer.sendSync('getStore', key);
      return resp;
    },

    deleteStore(key) {
      ipcRenderer.send('deleteStore', key);
    },
  },
});
