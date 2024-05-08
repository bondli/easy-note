import React, { memo, useState } from 'react';
import { Layout, Space, Input, Button, message } from 'antd';
import request from '@common/request';

const { Header, Content, Footer } = Layout;

type LoginData = {
  id: number;
  name: string;
  avatar: string;
};

type UserLoginProps = {
  callback: (d: LoginData) => void;
};

const UserLogin: React.FC<UserLoginProps> = (props) => {
  const [name, setName] = useState('');
  const { callback } = props;
  const headerStyles: React.CSSProperties = {
    background: '#fff',
    padding: 0,
  };

  const footerStyles: React.CSSProperties = {
    background: '#fff',
    padding: 0,
  };

  const contentStyles: React.CSSProperties = {
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
  };

  const handleNameInput =(e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // 处理提交
  const handleSubmit = () => {
    if (!name || !name.length) {
      message.error('请输入一个名称');
      return;
    }
    request.post('/user/init', {
      name,
      avatar: name.substring(0,1),
    }).then((data: any) => {
      callback({
        name: data.name || '',
        avatar: data.avatar || '',
        id: data?.id || 0,
      });
    });
  };

  return (
    <Layout>
      <Header style={headerStyles} />
      <Content style={contentStyles}>
        <Space.Compact style={{ width: '40%' }}>
          <Input placeholder="请设置一个用户名" onChange={handleNameInput} />
          <Button type="primary" onClick={handleSubmit}>进入</Button>
        </Space.Compact>
      </Content>
      <Footer style={footerStyles} />
    </Layout>
  );

};

export default memo(UserLogin);
