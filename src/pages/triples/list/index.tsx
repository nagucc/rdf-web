import {
  PageContainer,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, Modal, Space, Table, TableProps, message } from 'antd';
import type { FC } from 'react';
import { useRequest } from '@umijs/max';
import { Triple } from '@/api';


const BasicForm: FC<Record<string, any>> = () => {
  const { run, data, mutate } = useRequest(Triple.list, {
    manual: true,
  })
  const onFinish = async (values: Record<string, any>) => {
    run(values);
  };
  const { run: deleteTriple } = useRequest(Triple.delete, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
    }
  });
  const list = data || [];
  const columns: TableProps['columns'] = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => subject.name,
    },
    {
      title: 'Predicate',
      dataIndex: 'predicate',
      key: 'predicate',
      render: (predicate) => predicate.name,
    },
    {
      title: 'Object',
      dataIndex: 'object',
      key: 'object',
      render: (object) => object.name,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, triple) => {
        return (
          <Space size="middle"
            onClick={(e) => {
              e.preventDefault();
              Modal.confirm({
                title: '删除Triple',
                content: '确定删除Triple吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                  mutate(list.filter(t => t.id !== triple.id));
                  deleteTriple(triple.id);
                },
              });
            }}
          >
            <a>Delete</a>
          </Space>
      )},
    },
  ];
  return (
    <PageContainer content="添加 Triple">
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
        >
          <ProFormText
            width="md"
            label="主体"
            name="subject"
            placeholder="请输入IRI"
          />
          <ProFormText
            width="md"
            label="谓词"
            name="predicate"
            placeholder="请输入IRI"
          />
          <ProFormText
            width="md"
            label="客体"
            name="object"
            placeholder="请输入IRI或值"
          />
        </ProForm>
        <Table columns={columns} dataSource={list} />
      </Card>
    </PageContainer>
  );
};
export default BasicForm;
