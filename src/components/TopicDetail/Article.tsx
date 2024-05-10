import React, { memo, useContext, useState } from 'react';
import { debounce } from 'lodash-es';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';
import { DataContext } from '@/common/context';
import request from '@common/request';
import style from './index.module.less';

type ArticleProps = {
  onUpdated: (t: string) => void;
};

// 定义一个变量，用于控制切换topic时带来的误更新topic内容，必须点击了编辑器才能执行更新
let canUpdateId = 0;

const Article: React.FC<ArticleProps> = (props) => {
  const { onUpdated } = props;
  const { selectedTopic } = useContext(DataContext);

  // 内容输入，直接更新
  const handleChange = debounce((value: string) => {
    // console.log('change:', value);
    if (canUpdateId !== selectedTopic.id) {
      return;
    }
    saveArticleChange(value);
  }, 1000);

  // 提交服务端修改内容
  const saveArticleChange = (value) => {
    if (value === '<p><br></p>') {
      return;
    }
    request.post(`/topic/update?id=${selectedTopic.id}`, {
      ...selectedTopic,
      desc: value,
    }).then(() => {
      onUpdated(value);
    });
  };

  // 聚焦编辑器
  const handleFocus = () => {
    canUpdateId = selectedTopic.id;
  };

  return (
    <div className={style.articleContainer}>
      <ReactQuill
        theme="snow"
        value={selectedTopic.desc}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="请输入内容"
      />
    </div>
  );
};

export default memo(Article);