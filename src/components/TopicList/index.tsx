import React, { memo, useEffect, useContext } from 'react';
import { Empty } from 'antd';
import { DataContext } from '@/common/context';
import Header from './Header';
import TopicCard from './TopicCard';
import style from './index.module.less';

const TopicList: React.FC = () => {
  const { currentNote, getNoteList, topicList, getTopicList, setSelectedTopic } = useContext(DataContext);

  // 当currentNote变化的时候，根据currentNote去获取该笔记本下的所有topic
  useEffect(() => {
    getTopicList();
  }, [currentNote]);

  // 当前选中的笔记本发现变化的时候，去掉原已选择的代办事项
  useEffect(() => {
    setSelectedTopic(null);
  }, [currentNote]);

  const handleNewTopicSuccess = (topic) => {
    // 重新拉取note列表
    getNoteList();
    // 重新获取topic列表
    getTopicList();
    // 选中新创建的代办事项
    setSelectedTopic(topic);
  };

  return (
    <div className={style.container}>
      <Header onCreated={handleNewTopicSuccess} />
      {
        // 无数据
        topicList.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有任何代办事项" style={{ marginTop: '100px' }} />
        ) : null
      }
      {
        // 有数据
        topicList.length > 0 ? (
          <div className={style.listContainer}>
            {
              topicList.map((item, index) => {
                return (
                  <TopicCard data={item} key={index} />
                );
              })
            }
          </div>
        ) : null
      }
    </div>
  );

};

export default memo(TopicList);
