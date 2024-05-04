import React from 'react';
import {
  InboxOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  RestOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import MenuItem from '@components/MenuItem';
import { SPLIT_LINE } from '@/common/constant';
import style from './index.module.less';

type MenuItem = Required<MenuProps>['items'][number];

const Category: React.FC = () => {
  const items: MenuItem[] = [
    {
      key: '1',
      icon: <InboxOutlined />,
      label: <MenuItem label="所有事项" count={0} />,
    },
    {
      key: '2',
      icon: <FileTextOutlined />,
      label: <MenuItem label="今天到期" count={0} />,
    },
    {
      key: '3',
      icon: <FileDoneOutlined />,
      label: <MenuItem label="已完成" count={0} />,
    },
    {
      key: '4',
      icon: <RestOutlined />,
      label: <MenuItem label="垃圾箱" count={0} />,
    },
  ];

  return (
    <div className={style.container} style={{ borderBottom: SPLIT_LINE }}>
      <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
        items={items}
        style={{ borderRight: 0 }}
      />
    </div>
  );

};

export default Category;
