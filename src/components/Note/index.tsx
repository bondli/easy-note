import React, { memo, useState, useEffect, useContext, useRef } from 'react';
import { FolderOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Empty, Popover, Input, message } from 'antd';
import { DataContext } from '@/common/context';
import request from '@common/request';
import MenuItem from '@components/MenuItem';
import styles from './index.module.less';

type MenuItemType = Required<MenuProps>['items'][number];

const NoteBook: React.FC = () => {
  const [messageApi, msgContextHolder] = message.useMessage();
  const { currentNote, setCurrentNote, noteList, getNoteList } = useContext(DataContext);
  
  const [menus, setMenus] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newNoteName, setNewNoteName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const menusTemp: MenuItemType[] = [];
    noteList.forEach((item) => {
      menusTemp.push({
        label: <MenuItem label={item.name} count={item.counts} />,
        key: item.id,
        icon: <FolderOutlined style={{ fontSize: '16px' }} />,
      });
    });
    setMenus(menusTemp);
  }, [noteList]);

  // 笔记本名称输入
  const handleNameInput = (e) => {
    // console.log(e.target.value);
    setNewNoteName(e.target.value);
  };

  // 提交创建笔记本
  const handleCreateNote = ()=> {
    if (!newNoteName || !newNoteName.length) {
      messageApi.open({
        type: 'error',
        content: '请输入笔记本名称',
      });
      return;
    }
    // 如果当前的笔记本已经达到20个了，不给创建了
    if (noteList.length >= 20) {
      messageApi.open({
        type: 'error',
        content: '最多创建20个笔记本',
      });
      return;
    }
    request
      .post('/note/create', {
        name: newNoteName,
      }).then(() => {
        setNewNoteName('');
        setShowNewModal(false);
        getNoteList();
        messageApi.open({
          type: 'success',
          content: `创建成功`,
        });
      }).catch((err) => {
        messageApi.open({
          type: 'error',
          content: `创建失败：${err.message}`,
        });
      });
  };

  const handleModalOpenChange = (open: boolean) => {
    setShowNewModal(open);
    if (open) {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 200);
    }
  };

  // 创建笔记本表单
  const createNoteForm = (
    <div>
      <Input placeholder="最多8个字符" value={newNoteName} maxLength={8} allowClear onChange={handleNameInput} onPressEnter={handleCreateNote} ref={inputRef} />
      <div className={styles.tips}>输入完后按下回车提交</div>
    </div>
  );

  // 选中一个笔记本
  const handleSelect = (e) => {
    const { key } = e;
    noteList.forEach((item) => {
      if (item.id == key) {
        setCurrentNote(item);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>笔记本<em className={styles.titleTips}>[{noteList.length}/20]</em></span>
        <Popover
          content={createNoteForm}
          title="新建笔记本"
          trigger="click"
          open={showNewModal}
          onOpenChange={handleModalOpenChange}
          placement="rightTop"
        >
          <PlusCircleOutlined className={styles.add} />
        </Popover>
      </div>
      {
        !noteList || !noteList.length ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有任何笔记本" />
        ) : (
          <Menu
            defaultSelectedKeys={[]}
            selectedKeys={[currentNote?.id+'']}
            mode="inline"
            items={menus}
            className={styles.menuContainer}
            style={{ borderRight: 0 }}
            onSelect={handleSelect}
          >
          </Menu>
        )
      }
      <div>{msgContextHolder}</div>
    </div>
  );
};

export default memo(NoteBook);
