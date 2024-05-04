import React from 'react';
// import { Skeleton, Row, Col } from 'antd';
import { Spin } from 'antd';
import style from './index.module.less';

const MainLoading: React.FC = () => {
  return (
    <div className={style.container}>
      <Spin />
    </div>
  );

  // return (
  //   <Row>
  //     <Col flex="208px">
  //       <Skeleton active />
  //     </Col>
  //     <Col flex="auto">
  //       <Row>
  //         <Col span={12}>
  //           <Skeleton active />
  //         </Col>
  //         <Col span={12}>
  //           <Skeleton active />
  //         </Col>
  //       </Row>
  //     </Col>
  //   </Row>
  // );
};

export default MainLoading;
