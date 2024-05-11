import React, { memo, useContext } from 'react';
import { ProductOutlined, FileDoneOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import MenuItem from '@components/MenuItem';
import { DataContext } from '@/common/context';
import { SPLIT_LINE } from '@/common/constant';
import style from './index.module.less';

type MenuItemType = Required<MenuProps>['items'][number];
type noteType = {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  isVirtual?: boolean;
};

const Category: React.FC = () => {
  const { currentNote, setCurrentNote, topicCounts = {} } = useContext(DataContext);

  const noteList: noteType[] = [{
    id: 'all',
    name: '所有待办',
    count: topicCounts.all || 0,
    icon: <ProductOutlined style={{ fontSize: '16px' }} />,
  }, {
    id: 'today',
    name: '今天到期',
    count: topicCounts.today || 0,
    icon: <FileTextOutlined style={{ fontSize: '16px' }} />,
  }, {
    id: 'done',
    name: '已完成',
    count: topicCounts.done || 0,
    icon: <FileDoneOutlined style={{ fontSize: '16px' }} />,
  }, {
    id: 'trash',
    name: '垃圾箱',
    count: topicCounts.deleted || 0,
    icon: <DeleteOutlined style={{ fontSize: '16px' }} />,
  }];

  const items: MenuItemType[] = [];
  noteList.forEach((item) => {
    items.push({
      key: item.id,
      icon: item.icon,
      label: <MenuItem label={item.name} count={item.count} />,
    });
  });

  // 选中一个笔记本
  const handleSelect = (e) => {
    const { key } = e;
    noteList.forEach((item) => {
      if (item.id == key) {
        item.isVirtual = true;
        setCurrentNote(item);
      }
    });
  };

  return (
    <div className={style.container} style={{ borderBottom: SPLIT_LINE }}>
      <Menu
        defaultSelectedKeys={['all']}
        selectedKeys={[currentNote?.id]}
        mode="inline"
        items={items}
        style={{ borderRight: 0 }}
        onSelect={handleSelect}
      />
    </div>
  );

};

export default memo(Category);
