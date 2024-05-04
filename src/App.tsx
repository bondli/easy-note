import React, { useState, useEffect } from 'react';
import Electron from '@common/electron';
import UserLogin from '@modules/UserLogin';
import MainPage from '@modules/MainPage';

type LoginData = {
  id: number;
  name: string;
  avatar: string;
};

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // 判断是否初始化了用户
    const loginData = Electron.getLoginData() || {};
    // console.log(loginData);
    const { id, name, avatar } = loginData;
    if (id && name && avatar) {
      setUserInfo(loginData);
    }
  }, []);

  const handleLogin = (data: LoginData) => {
    Electron.saveLoginData(data);
    setUserInfo(data);
  };

  if (!userInfo || !userInfo.id) {
    return <UserLogin callback={handleLogin} />;
  }

  return <MainPage userInfo={userInfo} />;
};

export default App;
