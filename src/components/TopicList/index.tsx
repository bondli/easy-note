import React, { useContext } from 'react';
import { Spin } from 'antd';
import { DataContext } from '@/common/context';
import TopicListHeader from './Header';
import style from './index.module.less';

const TopicList: React.FC = () => {
  const { currentNote } = useContext(DataContext);

  return (
    <div className={style.container}>
      <TopicListHeader notebook={currentNote} />
    </div>
  );

};

export default TopicList;
