import React, { useState, useEffect } from 'react';
import ElectronBridge, { userLog } from '@common/electron';
import UserPage from '@/modules/UserPage';
import MainPage from '@modules/MainPage';

type LoginData = {
  id: number;
  name: string;
  avatar: string;
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // 判断是否初始化了用户
    const loginData = ElectronBridge.getLoginData() || {};
    userLog('app startup:', loginData);
    const { id, name, avatar } = loginData;
    if (id && name && avatar) {
      setUserInfo(loginData);
    }
    setLoading(false);
  }, []);

  const handleLogin = (data: LoginData) => {
    ElectronBridge.saveLoginData(data);
    setUserInfo(data);
  };

  // 避免一进来还在获取本地缓存数据的时候显示了登录的问题
  if (loading) {
    return null;
    // return <div style={{ color: '#eee', fontSize: '24px' }}>loading...</div>;
  }

  if (!userInfo || !userInfo.id) {
    return <UserPage callback={handleLogin} />;
  }

  return <MainPage userInfo={userInfo} />;
};

export default App;
