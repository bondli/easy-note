import React, { memo, useContext, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { format as timeAgoFormat } from 'timeago.js';
import { HEADER_HEIGHT, SPLIT_LINE } from '@/common/constant';
import { DataContext } from '@/common/context';
import request from '@common/request';
import style from './index.module.less';

type TitleProps = {
  onUpdated: (t: string) => void;
};

const Title: React.FC<TitleProps> = (props) => {
  const { onUpdated } = props;
  const { selectedTopic } = useContext(DataContext);
  const [messageApi, msgContextHolder] = message.useMessage();

  const [showEditTitle, setShowEditTitle] = useState(false);

  // 设标题输入框出现
  const handleEditTitle = () => {
    setShowEditTitle(true);
  };

  // 提交服务端修改标题
  const saveTitleChange = (e) => {
    const tempTitle = e.target.value;
    if (!tempTitle || !tempTitle.length) {
      messageApi.open({
        type: 'error',
        content: '请输入代办事项标题',
      });
      return;
    }
    request.post(`/topic/update?id=${selectedTopic.id}`, {
      ...selectedTopic,
      title: tempTitle,
    }).then(() => {
      setShowEditTitle(false);
      onUpdated(tempTitle);
    }).catch((err) => {
      messageApi.open({
        type: 'error',
        content: `修改失败：${err.message}`,
      });
    });
  };

  return (
    <div className={style.titleContainer} style={{ height: HEADER_HEIGHT, borderBottom: SPLIT_LINE}}>
      {
        showEditTitle ? (
          <div className={style.left}>
            <Input
              placeholder="请输入标题"
              defaultValue={selectedTopic.title}
              onPressEnter={saveTitleChange}
              onBlur={() => {
                setShowEditTitle(false);
              }}
              style={{ width: '90%' }}
            />
          </div>
        ) : (
          <div className={style.left}>
            <span onClick={handleEditTitle}>{selectedTopic.title}</span>
            <div className={style.titleTips}>update at: {timeAgoFormat(selectedTopic.updatedAt)}</div>
          </div>
        )
      }
      
      <div className={style.right}>
        <span>{dayjs(selectedTopic.createAt).format('YY/MM/DD HH:mm')}</span>
      </div>
      <div>{msgContextHolder}</div>
    </div>
  );
};

export default memo(Title);