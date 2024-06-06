import { LexcialTriple, Prefix, Triple } from '@/api';
import { replacePrefixWithIRI } from '@/utils';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormInstance,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { ITriple } from 'nagu-triples-types';
import { FC, useState, useRef } from 'react';
import { useRequest } from 'umi';
const BasicForm: FC<Record<string, any>> = () => {
  const qs = new URLSearchParams(window.location.search);
  const formRef = useRef<ProFormInstance>();
  const [ subject, setSubject] = useState(qs.get('subject'));
  const [ predicate, setPredicate] = useState(qs.get('predicate'));
  const [ obj] = useState(qs.get('object'));
  const { data: prefixTriples } = useRequest(Prefix.list);

  const onFinish = async (values: Record<string, any>) => {
    await Triple.create(values as LexcialTriple);
    if (qs.get('back')) history.back()
    else message.success('提交成功');
  };
  return (
    <PageContainer content="添加 Triple">
      <Card bordered={false}>
        <ProForm
          style={{
            margin: 'auto',
            marginTop: 8,
            maxWidth: 600,
          }}
          formRef={formRef}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
        >
          <ProFormText
            width="lg"
            label="主体"
            name="subject"
            rules={[
              {
                required: true,
                message: '请输入主体',
              },
            ]}
            initialValue={subject}
            placeholder="请输入IRI"
            onChange={(e) => {
              const value = replacePrefixWithIRI(e.target.value, prefixTriples as ITriple[]);
              setSubject(value);
              formRef.current?.setFieldValue('subject', value);
            }}
          />
          <ProFormText
            width="lg"
            label="谓词"
            name="predicate"
            rules={[
              {
                required: true,
                message: '请输入谓词',
              },
            ]}
            initialValue={predicate}
            placeholder="请输入IRI"
            onChange={(e) => {
              const value = replacePrefixWithIRI(e.target.value, prefixTriples as ITriple[]);
              setPredicate(value);
              formRef.current?.setFieldValue('predicate', value);
            }}
          />
          <ProFormText
            width="lg"
            label="客体"
            name="object"
            rules={[
              {
                required: true,
                message: '请输入客体',
              },
            ]}
            initialValue={obj}
            placeholder="请输入IRI或值"
          />
        </ProForm>
      </Card>
    </PageContainer>
  );
};
export default BasicForm;

