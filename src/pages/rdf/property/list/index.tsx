import {
  PageContainer,
} from '@ant-design/pro-components';
import { Card, Space } from 'antd';
import { useEffect, type FC } from 'react';
import { useParams, useRequest } from '@umijs/max';
// import ClassDetailCard from './ClassDetail';
import PropertyList from './PropertyList';
import { Prefix } from '@/api';


const BasicForm: FC<Record<string, any>> = () => {
  const qs = useParams();
  const { run: getPrefixTriples, data: prefixTriples} = useRequest(Prefix.list, { manual: true });
  useEffect(() => {
    getPrefixTriples();
  }, []);
  return (
    <PageContainer>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {/* <ClassDetailCard iri={qs.iri} /> */}
        <Card bordered={false}>
          <PropertyList classIRI={qs.iri} prefixTriples={prefixTriples} />
        </Card>
        
      </Space>
    </PageContainer>
  );
};
export default BasicForm;
