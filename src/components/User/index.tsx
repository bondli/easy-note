import React, { memo, useContext } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Button, Space, message } from 'antd';
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

  const { info } = props;
  const { name, avatar } = info;

  const items: MenuProps['items'] = [
    {
      label: '设置',
      key: '1',
    },
    {
      label: '同步',
      key: '2',
    },   {
      label: '退出',
      key: '3',
    },
  ];
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // message.info('Click on menu item.');
    const { key } = e;
    if (key === '2') {
      getTopicCounts();
      getNoteList();
      getTopicList();
      messageApi.open({
        type: 'success',
        content: '同步成功',
      });
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
              <Avatar style={{ backgroundColor: '#18181b', verticalAlign: 'middle' }} size="small">
                {avatar}
              </Avatar>
              <span className={style.name}>{name}</span>
            </div>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <div>{msgContextHolder}</div>
    </div>
  );
};

export default memo(User);
