import React from 'react';
import { Button } from 'antd';
import { HEADER_HEIGHT, SPLIT_LINE } from '@/common/constant';
import style from './index.module.less';

type TopicListHeaderProps = {
  notebook: any;
};

const TopicListHeader: React.FC<TopicListHeaderProps> = (props) => {
  const { notebook } = props;
  const { id, name } = notebook || {};

  return (
    <div className={style.header} style={{ height: HEADER_HEIGHT, borderBottom: SPLIT_LINE}}>
      <div className={style.title}>{name}</div>
      <div>
        <Button type="primary" size="small">创建笔记</Button>
      </div>
    </div>
  );

};

export default TopicListHeader;
