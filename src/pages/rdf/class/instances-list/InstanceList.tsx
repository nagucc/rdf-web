import {
  ProFormText,
  ModalForm,
  ProFormInstance,
} from '@ant-design/pro-components';
import { PlusOutlined, ExclamationCircleFilled, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { Card, List, Typography, Button, Modal, message } from 'antd';
import { useEffect, useRef, useState, type FC } from 'react';
import { history, useRequest } from '@umijs/max';
import { Class, Resource, ResourceInstance } from '@/api';
import useStyles from './style.style';
import { RDF, replacePrefixWithIRI } from '@/utils';
import { ITriple } from 'nagu-triples-types';
const { Paragraph } = Typography;
const { confirm } = Modal;

type InstanceListProps = {
  classIRI: string,
  prefixTriples: ITriple[],
}
const InstanceList: FC<InstanceListProps> = (props) => {
  const { classIRI, prefixTriples } = props;
  const { styles } = useStyles();
  const  [ open, setOpen] = useState(false);
  const [ edittingClass, setEdittingClass] = useState<ResourceInstance>({} as ResourceInstance);
  const [, setTextIRI] = useState('');
  const [, setTextIsDefinedBy] = useState('');
  const modalForm = useRef<ProFormInstance>()
  const { data, run, mutate } = useRequest(() => {
    return Class.instancesOf(classIRI);
  }, {
    manual: true,
  });
  useEffect(() => {
    run();
  }, [classIRI]);
  const list = [{}, ...(data || [])] ;
  return (
    <>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={list}
        rowKey="iri"
        renderItem={(item) => {
          if (item?.iri) {
            return (
              <List.Item key={item.iri}>
                <Card
                  // hoverable
                  className={styles.card}
                  actions={[
                    <Button key="button1" type="link" size='small'
                      onClick={() => {
                        setOpen(true);
                        setEdittingClass(item);
                      }}
                    >
                      <EditOutlined />编辑
                    </Button>,
                    <Button key="button2" type="link" danger size='small'
                      onClick={() => {
                        confirm({
                          title: `确认删除`,
                          content: `确定要删除 ${item.label || item.iri}(${ item.iri}) 的类型${classIRI}吗?`,
                          icon: <ExclamationCircleFilled />,
                          async onOk() {
                            mutate(list.filter(i => i.iri && i.iri !== item.iri));
                            await Resource.removeType(item.iri, classIRI);
                            message.success('删除成功');
                          },
                        })
                      }}
                    >
                      <DeleteOutlined />删除
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <a
                      onClick={() => {
                        history.push(`/rdf/class/${encodeURIComponent(item.iri)}/instances`);
                      }}
                      >
                          {item.label || item.iri}
                      </a>
                    }
                    description={
                      <Paragraph
                        className={styles.item}
                        ellipsis={{
                          rows: 3,
                        }}
                      >
                        {item.comment}
                        <Button size='small' type='link'
                          onClick={()=>history.push(`/rdf/resource/${encodeURIComponent(item.iri)}`)}
                        >
                          <ExportOutlined />
                        </Button>
                      </Paragraph>
                    }
                  />
                </Card>
              </List.Item>
            )
          }
          return (
            <List.Item>
              <Button type="dashed" className={styles.newButton}
                onClick={() => {
                  // 打开Modal以创建资源
                  setEdittingClass({} as ResourceInstance);
                  setOpen(true);
                }}
              >
                <PlusOutlined /> 新增实例
              </Button>
            </List.Item>
          )
        }}
      />
      <ModalForm
        formRef={modalForm}
        title='修改instance'
        open={open}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setOpen(false),
        }}
        onFinish={async values => {
          // 编辑当前Class
          if (edittingClass.iri) {
            await Resource.update(edittingClass.iri, values);
            mutate(data.map((r: { iri: any}) => {
              if (r.iri.toString() !== edittingClass.iri) return r;
              return values;
            }));
          } else {
            // 创建实例
            await Resource.add(values.iri, values); // 创建Resource
            await Resource.setPropertyValue(values.iri, RDF.type, props.classIRI); // 设置type为当前Class
            mutate([
              ...data,
              values,
            ]);
          }
          setOpen(false);
        }}
      > 
        <ProFormText
          width="lg"
          label="IRI"
          name="iri"
          placeholder="请输入IRI"
          initialValue={edittingClass.iri}
          disabled={!!edittingClass.iri}
          tooltip={edittingClass.iri}
          onChange={(e: { target: { value: string; }; }) => {
            const value = replacePrefixWithIRI(e.target.value, prefixTriples as ITriple[]);
            setTextIRI(value);
            modalForm.current?.setFieldValue('iri', value);
          }}
        />
        <ProFormText
          width="lg"
          label="label"
          name="label"
          placeholder="请输入label"
          initialValue={edittingClass.label}
        />
        <ProFormText
          width="lg"
          label="comment"
          name="comment"
          placeholder="请输入comment"
          initialValue={edittingClass.comment}
        />
        <ProFormText
          width="lg"
          label="isDefinedBy"
          name="isDefinedBy"
          placeholder="请输入isDefinedBy"
          initialValue={edittingClass.isDefinedBy}
          onChange={(e: { target: { value: string; }; }) => {
            const value = replacePrefixWithIRI(e.target.value, prefixTriples as ITriple[]);
            setTextIsDefinedBy(value);
            modalForm.current?.setFieldValue('isDefinedBy', value);
          }}
        />
        <ProFormText
          width="lg"
          label="seeAlso"
          name="seeAlso"
          placeholder=""
          initialValue={edittingClass.seeAlso}
        />
      </ModalForm>        
    </>
  );
};
export default InstanceList;
