import { PageContainer } from '@ant-design/pro-components';
import { PropsWithChildren } from 'react';

const AccessPage: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <PageContainer>
      {children},
    </PageContainer>
  );
};

export default AccessPage;
