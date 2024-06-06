import {
  ActionType,
  ModalForm,
  // PageContainer,
  ProColumns,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Card, Space, Input, Typography, Button, message, Flex, Modal } from 'antd';
import { useEffect, useRef, useState, type FC } from 'react';
import { history, useParams, useRequest } from '@umijs/max';
import { Prefix, Resource, Triple } from '@/api';
import { RDFS, replacePrefixWithIRI } from '@/utils';
import { ITriple } from 'nagu-triples-types';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
// const { Title } = Typography;

type PropertyValueItem = {
  subject: string,
  object: string,
}

type PropertyValuesProps = {
  iri: string,
  prefixTriples: ITriple[],
}
const PropertyValues: FC<PropertyValuesProps> = (props) => {
  // const qs = useParams();
  // const [isResourceClass, setIsResourceClass] = useState(false); // 当前资源是否是rdfs:Class
  const [open, setOpen] = useState(false); // 编辑Modal
  const [modalLoading, setModalLoading] = useState(false); // Modal的loading状态
  // const [createMode, setCreateMode] = useState(true); // Modal是否是创建新资源模式
  // const [textIRI, setTextIRI] = useState('');
  // const [textIsDefinedBy, setTextIsDefinedBy] = useState('');
  const modalForm = useRef<ProFormInstance>()

  // const createTriple = 
  // const removePropertyValue = 
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<ITriple>[] = [
    {
      title: 'Subject',
      render:(_, triple) => {
        return (
        <Button type='link' onClick={() => {
          history.push(`/rdf/resource/${encodeURIComponent}`);
        }}>
          {triple.subject.name}
        </Button>
      )}
    },
    {
      title: 'Object',
      dataIndex: ['object', 'name'],
      copyable: true,
    },
    {
      render: (_, triple) => {
        return (
          <>
            <Button title='删除描述' type='link' danger onClick={() => {
              Modal.confirm({
                title: `确认删除`,
                content: `确定要删除关于 ${triple.subject.name}的描述吗?`,
                icon: <DeleteOutlined />,
                async onOk() {
                  await Triple.delete(triple.id);
                  actionRef.current?.reload();
                  message.success('删除成功');
                },
              })
            }}>
              <DeleteOutlined />
            </Button>
          </>
      )},
      search: false,
    }
  ];
  return (
    <>
      <ProTable<PropertyValueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(filter)
          const { data } = await Triple.listByP(props.iri);
          return {
            data,
            success: true,
          }
        }}
        // columnsState={{
        //   persistenceKey: 'pro-table-singe-demos',
        //   persistenceType: 'localStorage',
        //   defaultValue: {
        //     option: { fixed: 'right', disable: true },
        //   },
        // }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        pagination={{
          pageSize: 5,
          // onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="属性描述的资源及值"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpen(true);
            }}
            type="primary"
          >
            添加资源描述
          </Button>
        ]}
      />
        <ModalForm
        loading={modalLoading}
        layout='horizontal'
        formRef={modalForm}
        title='添加资源描述'
        open={open}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpen(false);
            setModalLoading(false);
          }
        }}
        onFinish={async values => {
          setModalLoading(true);
          await Triple.create({
            subject: values.subject,
            predicate: props.iri,
            object: values.object,
          });
          message.info('添加成功');
          modalForm.current?.resetFields();
          actionRef.current?.reload();
          setModalLoading(false);
          setOpen(false);
        }}
      > 
        <ProFormText
          width="lg"
          label="Subject"
          name="subject"
          placeholder="请输入Subject IRI"
          onChange={(e: { target: { value: string; }; }) => {
            const value = replacePrefixWithIRI(e.target.value, props.prefixTriples as ITriple[]);
            modalForm.current?.setFieldValue('subject', value);
          }}
        />
        <ProFormText
          width="lg"
          label="Object"
          name="object"
          placeholder="请输入Object IRI"
          onChange={(e: { target: { value: string; }; }) => {
            const value = replacePrefixWithIRI(e.target.value, props.prefixTriples as ITriple[]);
            modalForm.current?.setFieldValue('object', value);
          }}
        />
      </ModalForm>
    </>
  );
};
export default PropertyValues;
