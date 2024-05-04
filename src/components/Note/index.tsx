import React, { useState, useEffect, useCallback, useContext } from 'react';
import { FolderOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Empty, Popover, Input, message } from 'antd';
import request from '@common/request';
import { DataContext } from '@/common/context';
import MenuItem from '@components/MenuItem';
import styles from './index.module.less';

type MenuItem = Required<MenuProps>['items'][number];

const NoteBook: React.FC = () => {
  const { setCurrentNote } = useContext(DataContext);
  
  const [noteList, setNoteList] = useState([]);
  const [menus, setMenus] = useState([]);
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [newNoteName, setNewNoteName] = useState('');

  // 获取笔记本列表
  const getNoteList = useCallback(
    () => {
      request
        .get('/note/list')
        .then((res) => {
          setNoteList(res.data);
        });
    },
    [setNoteList]
  );

  useEffect(() => {
    getNoteList();
  }, [getNoteList]);

  useEffect(() => {
    const menusTemp: MenuItem[] = [];
    noteList.forEach((item) => {
      menusTemp.push({
        label: <MenuItem label={item.name} count={item.count} />,
        key: item.id,
        icon: <FolderOutlined />,
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
      message.error('请输入笔记本名称');
      return;
    }
    // 如果当前的笔记本已经达到10个了，不给创建了
    if (noteList.length >= 10) {
      message.error('最多创建10个笔记本');
      return;
    }
    request
      .post('/note/create', {
        name: newNoteName,
      }).then((data) => {
        setNewNoteName('');
        setShowNewModal(false);
        getNoteList();
        message.success('创建成功');
      });
  };

  const handleOpenChange = (open: boolean) => {
    setShowNewModal(open);
  };

  // 创建笔记本表单
  const createNoteForm = (
    <div>
      <Input placeholder="最多8个字符" value={newNoteName} maxLength={8} allowClear onChange={handleNameInput} onPressEnter={handleCreateNote} />
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
        <span>笔记本</span>
        <Popover
          content={createNoteForm}
          title="新建笔记本"
          trigger="click"
          open={showNewModal}
          onOpenChange={handleOpenChange}
          placement="rightTop"
        >
          <PlusCircleOutlined className={styles.add} />
        </Popover>
      </div>
      {
        !noteList || !noteList.length ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有任何笔记本" />
        ) : null
      }
      {
        noteList.length ? (
          <Menu
            mode="inline"
            items={menus}
            style={{ borderRight: 0 }}
            onSelect={handleSelect}
          >
          </Menu>
        ) : null
      }
    </div>
  );
};

export default NoteBook;
