import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Empty } from 'antd';
import request from '@common/request';
import { DataContext } from '@/common/context';
import { SPLIT_LINE } from '@common/constant';
import MainLoading from '@components/MainLoading';
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
  const [loading, setLoading] = useState(true);
  const [topicList, setTopicList] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);

  const getAllTopicList = useCallback(
    () => {
      request
        .get('/topic/getListByStatus', {
          params: {
            status: 'undo',
          },
        })
        .then((res) => {
          setTopicList(res.data);
        })
        .catch(() => {
          setTopicList([]);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setTopicList, setLoading]
  );

  useEffect(() => {
    getAllTopicList();
  }, [getAllTopicList]);

  if (loading) {
    return <MainLoading />;
  }

  if (!topicList) {
    return <Empty />;
  }

  return (
    <DataContext.Provider
      value={{
        currentNote,
        setCurrentNote,
      }}
    >
      <Row style={{ width: '100%' }}>
        <Col flex="208px" style={{ height: '100vh', borderRight: SPLIT_LINE }}>
          <User info={userInfo} />
          <Category />
          <NoteBook />
        </Col>
        <Col flex="auto">
          <Row style={{ width: '100%' }}>
            <Col span={12} style={{ height: '100vh', borderRight: SPLIT_LINE }}>
              <TopicList />
            </Col>
            <Col span={12} style={{ height: '100vh' }}>
              <TopicDetail />
            </Col>
          </Row>
        </Col>
      </Row>
    </DataContext.Provider>
  );
};

export default MainPage;