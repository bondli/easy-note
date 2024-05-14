import React, { memo, useContext } from 'react';
import { GithubFilled, DownOutlined, CloudDownloadOutlined, CloudUploadOutlined, CloudSyncOutlined, UserSwitchOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Button, Space, message, Modal } from 'antd';
import ElectronBridge from '@common/electron';
import { DataContext } from '@/common/context';
import { HEADER_HEIGHT, SPLIT_LINE } from '@/common/constant';
import style from './index.module.less';

type UserProps = {
  info: {
    name: string;
    avatar: string;
  };
};

const User: React.FC<UserProps> = (props) => {
  const { getTopicList, getTopicCounts, getNoteList } = useContext(DataContext);
  const [messageApi, msgContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();

  const { info } = props;
  const { name, avatar } = info;

  const items: MenuProps['items'] = [
    {
      label: '导出数据',
      key: '1',
      icon: <CloudDownloadOutlined style={{ fontSize: '16px' }} />,
    }, {
      label: '恢复数据',
      key: '2',
      icon: <CloudUploadOutlined style={{ fontSize: '16px' }} />,
    }, {
      label: '刷新数据',
      key: '3',
      icon: <CloudSyncOutlined style={{ fontSize: '16px' }} />,
    }, {
      label: '退出登录',
      key: '4',
      icon: <UserSwitchOutlined style={{ fontSize: '16px' }} />,
    },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const { key } = e;
    ElectronBridge.userLog('Click MainMenu: ', key);
    // 导出数据
    if (key === '1') {
      ElectronBridge.exportData();
      messageApi.open({
        type: 'success',
        content: '数据导出成功，请在下载目录下检查是否存在文件：easynote-database.db',
      });
    }
    // 本地恢复数据
    else if (key === '2') {
      modalApi.confirm({
        title: '确认恢复数据？',
        content: '请确认已将数据文件命名成：easynote-database.db，并放在Downloads目录下。',
        onOk() {
          ElectronBridge.importData();
          getTopicCounts();
          getNoteList();
          getTopicList();
          messageApi.open({
            type: 'warning',
            content: '本地数据已导入，请检查是否正确',
          });
        }
      });
    }
    // 刷新下数据，首次进入存在一定概率的调研接口失败
    else if (key === '3') {
      getTopicCounts();
      getNoteList();
      getTopicList();
      messageApi.open({
        type: 'success',
        content: '同步成功',
      });
      return;
    }
    // 退出登录
    else if (key === '4') {
      ElectronBridge.deleteLoginData();
      window.location.reload();
      return;
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className={style.container} style={{ height: HEADER_HEIGHT, borderBottom: SPLIT_LINE}}>
      <Dropdown menu={menuProps} trigger={['click']}>
        <Button style={{ width: '90%' }}>
          <Space className={style.userInfoContainer}>
            <div className={style.userInfo}>
              {
                avatar.length > 2 ? (
                  <Avatar style={{ backgroundColor: '#18181b', verticalAlign: 'middle' }} size="small">
                    {avatar}
                  </Avatar>
                ) : (
                  <GithubFilled style={{ fontSize: '22px' }} />
                )
              }
              <span className={style.name}>{name}</span>
            </div>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <div>{modalContextHolder}</div>
      <div>{msgContextHolder}</div>
    </div>
  );
};

export default memo(User);
