import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import { useRef, useState, type FC } from 'react';
import { history } from '@umijs/max';
import {  Resource, Triple } from '@/api';
import { replacePrefixWithIRI } from '@/utils';
import { ITriple } from 'nagu-triples-types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

type PropertyValueItem = {
  subject: string,
  object: string,
}

type PropertyValuesProps = {
  iri: string,
  prefixTriples: ITriple[],
}
const PropertyValues: FC<PropertyValuesProps> = (props) => {
  const [open, setOpen] = useState(false); // 编辑Modal
  const [modalLoading, setModalLoading] = useState(false); // Modal的loading状态
  const modalForm = useRef<ProFormInstance>()

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: 'Subject',
      render: (_, triple) => {
        return (
        <Button type='link' onClick={() => {
          history.push(`/rdf/resource/${encodeURIComponent}`);
        }}>
          {triple.subject.label || triple.subject.name}
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
      <ProTable<ITriple>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(filter)
          const { data } = await Triple.listByP(props.iri);
          const getRes = async (t: ITriple) => {
            const res = await Resource.get(t.subject.name);
            t.subject = {
              ...t.subject,
              ...res.data,
            }
          }
          await Promise.all(data.map(t => {
            return getRes(t);
          }));
          return {
            data,
            success: true,
          }
        }}
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
