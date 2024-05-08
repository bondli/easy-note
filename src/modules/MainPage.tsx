import React, { memo, useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { throttle } from 'lodash-es';
import { DataContext } from '@/common/context';
import { SPLIT_LINE, DEFAULT_NOTE } from '@common/constant';
import request from '@common/request';
import User from '@components/User';
import Category from '@components/Category';
import NoteBook from '@/components/Note';
import TopicList from '@components/TopicList';
import TopicDetail from '@components/TopicDetail';

type MainPageProps = {
  userInfo: {
    id: number;
    name: string;
    avatar: string;
  };
};

const MainPage: React.FC<MainPageProps> = (props) => {
  const { userInfo } = props;
  const [noteList, setNoteList] = useState([]);
  const [topicList, setTopicList] = useState([]);
  const [currentNote, setCurrentNote] = useState(DEFAULT_NOTE);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicCounts, setTopicCpunts] = useState({});

  const [showLeftPanel, setShowLeftPanel] = useState(true);

  // 获取笔记本列表
  const getNoteList = () => {
    request
      .get('/note/list')
      .then((res) => {
        setNoteList(res.data);
      });
  };

  // 获取代办事项列表
  const getTopicList = () => {
    request.get(`/topic/getList?noteId=${currentNote.id}`).then((res) => {
      setTopicList(res.data);
    }).catch((err) => {
      setTopicList([]);
    });
  };

  // 获取各种笔记本下代办的数量
  const getTopicCounts = () => {
    request.get(`/topic/counts`).then((data) => {
      setTopicCpunts(data);
    });
  };

  // 控制显隐
  const toggleShowLeftPanel = () => {
    if (window.innerWidth < 1200) {
      setShowLeftPanel(false);
    } else {
      setShowLeftPanel(true);
    }
  };

  useEffect(() => {
    getNoteList();
    getTopicCounts();

    // 监听窗口的变化
    window.onresize = throttle(() => {
      toggleShowLeftPanel();
    }, 500);

    toggleShowLeftPanel();
  }, []);

  return (
    <DataContext.Provider
      value={{
        currentNote,
        setCurrentNote,
        noteList,
        setNoteList,
        getNoteList,
        topicList,
        setTopicList,
        getTopicList,
        selectedTopic,
        setSelectedTopic,
        topicCounts,
        getTopicCounts,
      }}
    >
      <Row style={{ width: '100%' }}>
        <Col flex="208px" style={{ height: '100vh', borderRight: SPLIT_LINE, display: showLeftPanel ? '' : 'none'}}>
          <User info={userInfo} />
          <Category />
          <NoteBook />
        </Col>
        <Col flex="auto">
          <Row style={{ width: '100%' }}>
            <Col span={selectedTopic && selectedTopic.id ? 12 : 24} style={{ height: '100vh', borderRight: SPLIT_LINE }}>
              <TopicList />
            </Col>
            {
              selectedTopic && selectedTopic.id ? (
                <Col span={12} style={{ height: '100vh' }}>
                  <TopicDetail />
                </Col>
              ) : null
            }
          </Row>
        </Col>
      </Row>
    </DataContext.Provider>
  );
};

export default memo(MainPage);