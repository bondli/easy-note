import React, { memo, useState } from 'react';
import type { FormProps } from 'antd';
import { Layout, Row, Col, Form, Input, Button, message } from 'antd';
import request from '@common/request';
import style from './UserPage.module.less';

const { Header, Content } = Layout;

type LoginData = {
  id: number;
  name: string;
  avatar: string;
};

type FieldType = {
  username?: string;
  password?: string;
};

type RegFieldType = {
  regname?: string;
  regpwd?: string;
  repregpwd?: string;
};

type UserPageProps = {
  callback: (d: LoginData) => void;
};

const UserPage: React.FC<UserPageProps> = (props) => {
  const { callback } = props;

  const [messageApi, msgContextHolder] = message.useMessage();
  const [showLogin, setShowLogin] = useState(true);

  // 登录和注册切换
  const handleSwitch = (type: string) => {
    if (type === 'login') {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  };

  // 执行登录
  const onLogin: FormProps<FieldType>['onFinish'] = (values) => {
    // console.log('Success:', values);
    request.post('/user/login', {
      name: values.username,
      password: values.password,
    }).then((data: any) => {
      // console.log('data', data);
      if (!data || !data.id) {
        messageApi.open({
          type: 'error',
          content: `登录失败：${data.error}`,
        });
        return;
      }
      messageApi.open({
        type: 'success',
        content: `登录成功`,
      });
      callback({
        name: data.name || '',
        avatar: data.avatar || '',
        id: data?.id || 0,
      });
    });
  };
  
  const onLoginFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    // console.log('Failed:', errorInfo);
    // messageApi.open({
    //   type: 'error',
    //   content: `登录失败：${errorInfo}`,
    // });
  };

  // 执行注册
  const onRegister: FormProps<RegFieldType>['onFinish'] = (values) => {
    // console.log('Success:', values);
    request.post('/user/register', {
      name: values.regname,
      password: values.regpwd,
      mail: '',
      avatar: values.regname.substring(0,1),
    }).then((data: any) => {
      if (data && data.error) {
        messageApi.open({
          type: 'error',
          content: `注册失败：${data.error}`,
        });
        return;
      }
      messageApi.open({
        type: 'success',
        content: `注册成功，已自动为你登录`,
      });
      callback({
        name: data.name || '',
        avatar: data.avatar || '',
        id: data?.id || 0,
      });
    });
  };
  
  const onRegisterFailed: FormProps<RegFieldType>['onFinishFailed'] = (errorInfo) => {
    // console.log('Failed:', errorInfo);
    // messageApi.open({
    //   type: 'error',
    //   content: `注册失败：${errorInfo}`,
    // });
  };

  return (
    <Layout className={style.layout}>
      <Header className={style.header}>
        <div className={style.logo}>Easy Note</div>
        <div className={style.sologon}>简单的代办事项应用，随时随地记录自己的代办</div>
      </Header>
      <Content className={style.content}>
        <Row style={{ width: '100%' }}>
          <Col span={12} className={style.left}>
            <img src="https://todoist.b-cdn.net/assets/images/44245fc51c3e2ab05ee6d92c13e2e08a.png" style={{ width: '450px', height: '232px' }} />
          </Col>
          <Col span={12} className={style.right}>
            {
              showLogin ? (
                <div className={style.loginForm}>
                  <div className={style.title}>登录</div>
                  <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ minWidth: 400, maxWidth: 600 }}
                    onFinish={onLogin}
                    onFinishFailed={onLoginFailed}
                    autoComplete="off"
                  >
                    <Form.Item<FieldType>
                      label="用户名"
                      name="username"
                      rules={[{ required: true, message: '用户名不能为空' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                      label="密码"
                      name="password"
                      rules={[{ required: true, message: '密码不能为空' }]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                      <Button type="primary" htmlType="submit">
                        进入
                      </Button>
                      <span className={style.userTips} onClick={() => handleSwitch('register') }>还没有账号，先注册一个</span>
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                <div className={style.loginForm}>
                  <div className={style.title}>注册</div>
                  <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ minWidth: 400, maxWidth: 600 }}
                    onFinish={onRegister}
                    onFinishFailed={onRegisterFailed}
                    autoComplete="off"
                  >
                    <Form.Item<RegFieldType>
                      label="用户名"
                      name="regname"
                      rules={[{ required: true, message: '用户名不能为空' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item<RegFieldType>
                      label="密码"
                      name="regpwd"
                      hasFeedback
                      rules={[{ required: true, message: '密码不能为空' }]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item<RegFieldType>
                      label="重复密码"
                      name="repregpwd"
                      dependencies={['regpwd']}
                      hasFeedback
                      rules={[
                        { required: true, message: '请输入重复密码' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('regpwd') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次密码不一致'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                      <Button type="primary" htmlType="submit">
                        注册
                      </Button>
                      <span className={style.userTips} onClick={() => handleSwitch('login') }>已有账号，返回直接登录</span>
                    </Form.Item>
                  </Form>
                </div>
              )
            }
          </Col>
        </Row>
        <div>{msgContextHolder}</div>
      </Content>
    </Layout>
  );

};

export default memo(UserPage);
