import { Layout, Row, Typography } from 'antd';
import React from 'react';
import styles from './Guide.less';

interface Props {
  name: string;
}

// Scaffold example component
const Guide: React.FC<Props> = (props) => {
  const { name } = props;
  return (
    <Layout>
      <Row>
        <Typography.Title level={3} className={styles.title}>
          Welcome to use <strong>{name}</strong> !
        </Typography.Title>
      </Row>
    </Layout>
  );
};

export default Guide;
