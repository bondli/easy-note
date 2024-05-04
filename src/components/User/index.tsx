import React from 'react';
import { Avatar, Select } from 'antd';
import { HEADER_HEIGHT, SPLIT_LINE } from '@/common/constant';
import style from './index.module.less';

type UserProps = {
  info: {
    name: string;
    avatar: string;
  };
};

const User: React.FC<UserProps> = (props) => {
  const { info } = props;
  const { name, avatar } = info;

  return (
    <div className={style.container} style={{ height: HEADER_HEIGHT, borderBottom: SPLIT_LINE}}>
      <Select style={{ width: '90%' }} defaultValue={name}>
        <Select.Option value={name}>
          <div className={style.userInfo}>
            <Avatar style={{ backgroundColor: '#18181b', verticalAlign: 'middle' }} size="small">
              {avatar}
            </Avatar>
            <span className={style.name}>{name}</span>
          </div>
        </Select.Option>
      </Select>
    </div>
  );
};

export default User;
