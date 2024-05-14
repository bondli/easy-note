import axios from 'axios';
import ElectronBridge from '@common/electron';

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:5432/', // api的base_url
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加请求头部，例如token
    config.headers['X-From'] = 'Easy-Note-Client';
    const loginData = ElectronBridge.getLoginData() || {};
    config.headers['X-User-Id'] = loginData.id || 0;
    return config;
  },
  error => {
    // 请求错误处理
    console.log(error);
    ElectronBridge.userLog(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做处理，例如只返回data部分
    const res = response.data;
    return res;
  },
  error => {
    ElectronBridge.userLog('err:', error);
    return Promise.reject(error);
  }
);

export default service;
