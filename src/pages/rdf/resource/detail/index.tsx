import {
  ModalForm,
  PageContainer,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, Space, Input, Typography, Button, message, Flex } from 'antd';
import { useEffect, useRef, useState, type FC } from 'react';
import { history, useParams, useRequest } from '@umijs/max';
import { Prefix, Resource } from '@/api';
import { RDFS, replacePrefixWithIRI } from '@/utils';
import { ITriple } from 'nagu-triples-types';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import SearchCard from './SearchCard';
const { Title } = Typography;

const BasicForm: FC<Record<string, any>> = () => {
  const qs = useParams();
  const [isResourceClass, setIsResourceClass] = useState(false); // 当前资源是否是rdfs:Class
  const [open, setOpen] = useState(false); // 编辑Modal
  const [createMode, setCreateMode] = useState(true); // Modal是否是创建新资源模式
  const [textIRI, setTextIRI] = useState('');
  const [textIsDefinedBy, setTextIsDefinedBy] = useState('');
  const [pvss, setPvss] = useState({});
  const modalForm = useRef<ProFormInstance>()


  // 获取资源属性值
  const { data: pvs, run: getPvs, loading: loadingPvs } = useRequest((piri:string) => {
    return Resource.getPropertyValues(qs.iri, piri);
  }, {
    manual: true,
  });

  // 获取资源详情
  const { data: resource, run: getResourceInfo, loading: loadingResource, mutate: mutateResource } = useRequest(async () => {
    const pvs = await getPvs(RDFS.type);
    const newPvs = {};
    newPvs[RDFS.type] = pvs;

    // 判断当前Resource是不是rdfs:Class
    if (pvs.find(v => v.iri === RDFS.class)) setIsResourceClass(true);

    setPvss({ ...pvss, ...newPvs });
    return Resource.get(qs.iri);
  }, { manual: true });
  useEffect(() => {
    if (qs.iri) getResourceInfo();
    setPvss({});
  }, [qs.iri]);

  // 获取前缀描述
  const { run: getPrefixTriples, data: prefixTriples} = useRequest(Prefix.list, { manual: true });
  useEffect(() => { getPrefixTriples(); }, []);

  return (
    <PageContainer content="资源详情">
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <SearchCard iri={qs.iri || ''} prefixTriples={prefixTriples as ITriple[]}  onCreateBtnClick={() => {
          setOpen(true);
          setCreateMode(true);
        } } />
        <Card bordered={false} loading={loadingResource} title={resource?.label || resource?.iri}
          extra={
            <Flex gap="small" wrap>
              <Button type="primary" onClick={() => {
                setOpen(true);
                setCreateMode(false);
              }}><EditOutlined /> 编辑资源</Button>
              {
                isResourceClass ? (
                  <Button type="primary" onClick={() => {
                    history.push(`/rdf/class/${encodeURIComponent(resource?.iri)}/instances`)
                  }}>查看实例</Button>
                )
                : <></>
              }
              
              {/* <Button type="primary" onClick={() => {
              }}>属性详情</Button> */}
            </Flex>
            
          }
        >
          <p>{resource?.comment}</p>
          {
            resource?.isDefinedBy ?
              <>
                <Title level={5}>isDefinedBy</Title>
                <p>{resource.isDefinedBy.label || resource.isDefinedBy.iri}</p>
              </>
            : <></>
          }
          {
            pvss[RDFS.type] ?
            <>
              <Title level={5}>Types</Title>
              {
                pvss[RDFS.type].map(value => {
                  return (
                    <Button key={value.iri} type='link'
                      onClick={() => {
                        if ([RDFS.class].includes(value.iri)) {
                          history.push(`/rdf/class/${encodeURIComponent(value.iri)}/instances`)
                        } else {
                          history.push(`/rdf/resource/${encodeURIComponent(value.iri)}`);
                        }
                      }}
                    >
                      { value.label || value.iri }
                    </Button>
                  )
                })
              }
            </>
          : <></>
          }
          <Title level={5}>Property Values</Title>
        </Card>
      </Space>
      <ModalForm
        formRef={modalForm}
        title='新建资源'
        open={open}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setOpen(false),
        }}
        onFinish={async values => {
          // 新建Resource
          if (createMode) {
            await Resource.add(values.iri, values);
            history.push(`/rdf/rdf/resource/${encodeURIComponent(values.iri)}`);
          } else { // 更新当前Resource
            await Resource.update(values.iri, values);
            await getResourceInfo();
          }
          setOpen(false);
        }}
      > 
        <ProFormText
          width="lg"
          label="IRI"
          name="iri"
          placeholder="请输入IRI"
          initialValue={resource?.iri}
          disabled={!createMode}
          tooltip={resource?.iri}
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
          initialValue={resource?.label}
        />
        <ProFormText
          width="lg"
          label="comment"
          name="comment"
          placeholder="请输入comment"
          initialValue={resource?.comment}
        />
        <ProFormText
          width="lg"
          label="isDefinedBy"
          name="isDefinedBy"
          placeholder="请输入isDefinedBy"
          initialValue={resource?.isDefinedBy?.iri}
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
          initialValue={resource?.seeAlso}
        />
      </ModalForm>
    </PageContainer>
  );
};
export default BasicForm;
