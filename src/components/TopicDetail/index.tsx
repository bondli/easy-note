import React from 'react';
import { Spin } from 'antd';
import style from './index.module.less';

const TopicDetail: React.FC = () => {
  return (
    <div className={style.container}>
      <Spin />
    </div>
  );

};

export default TopicDetail;
