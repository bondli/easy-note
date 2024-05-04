import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, notification } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';

import 'antd/dist/reset.css';

notification.config({
  placement: 'topRight',
  top: 30,
  duration: 3,
  rtl: false,
});

const root = createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider
    locale={zhCN}
    input={{ autoComplete: 'off' }}
    theme={{
      token: {
        colorPrimary: '#18181b',
        colorPrimaryActive: 'rgb(24 24 27 / 80%)',
        colorPrimaryHover: 'rgb(24 24 27 / 80%)',
        borderRadius: 6,
      },
      components: {
        Menu: {
          itemHeight: 36,
          itemSelectedColor: 'white',
          itemSelectedBg: '#18181b',
        },
        Button: {
          contentFontSizeSM: 12,
          primaryShadow: '0',
        }
      },
    }}
  >
    <App />
  </ConfigProvider>,
);
