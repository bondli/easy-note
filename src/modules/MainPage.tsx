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

import style from './MainPage.module.less';

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
    if (window.innerWidth < 1000) {
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
      <Row className={style.container}>
        <Col flex="208px" className={style.left} style={{ borderRight: SPLIT_LINE, display: showLeftPanel ? '' : 'none'}}>
          <User info={userInfo} />
          <Category />
          <NoteBook />
        </Col>
        <Col flex="auto">
          <table className={style.right} style={{ width: showLeftPanel ? '' : '100%' }}>
            <tbody>
              <tr>
                <td style={{ width: selectedTopic && selectedTopic.id ? '50%' : '100%', height: '100vh' }}>
                  <TopicList />
                </td>
                {
                  selectedTopic && selectedTopic.id ? (
                    <td style={{ width: '50%', height: '100vh', borderLeft: SPLIT_LINE }}>
                      <TopicDetail />
                    </td>
                  ) : null
                }
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </DataContext.Provider>
  );
};

export default memo(MainPage);