import React, { memo, useContext, useState, useCallback } from 'react';
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

const Article: React.FC<ArticleProps> = (props) => {
  const { onUpdated } = props;
  const { selectedTopic } = useContext(DataContext);

  // 内容输入，直接更新
  const handleChange = debounce((value: string) => {
    saveArticleChange(value);
  }, 1500);

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

  return (
    <div className={style.articleContainer}>
      <ReactQuill
        theme="snow"
        value={selectedTopic.desc}
        onChange={handleChange}
        placeholder="请输入内容"
      />
    </div>
  );
};

export default memo(Article);