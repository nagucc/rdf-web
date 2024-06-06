import { Prefix } from '@/api';
import {
  PageContainer,
  ProForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Card, message } from 'antd';
import { useRef, type FC } from 'react';

const BasicForm: FC<Record<string, any>> = () => {
  const formRef = useRef<ProFormInstance>();
  const { run } = useRequest(Prefix.add, {
    manual: true,
    onSuccess: () => {
      message.success('添加成功');
      formRef.current?.setFieldsValue({
        prefix: '',
        iri: '',
      });
    }
  });
  const onFinish = async (values: Record<string, any>) => {
    run(values.prefix, values.iri);
  };
  return (
    <PageContainer content="添加新的前缀缩写">
      <Card bordered={false}>
        <ProForm
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          formRef={formRef}
        >
          <ProFormText
            width="md"
            label="前缀"
            name="prefix"
            rules={[
              {
                required: true,
                message: '请输入前缀',
              },
            ]}
            placeholder="请输入前缀"
          />
          <ProFormText
            width="md"
            label="IRI"
            name="iri"
            rules={[
              {
                required: true,
                message: '请输入IRI',
              },
            ]}
            placeholder="请输入IRI"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
