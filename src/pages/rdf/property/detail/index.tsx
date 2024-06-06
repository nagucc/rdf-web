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
import PropertyValues from './PropertyValues';
// const { Title } = Typography;

const BasicForm: FC<Record<string, any>> = () => {
  const qs = useParams();
  const [isResourceClass, setIsResourceClass] = useState(false); // 当前资源是否是rdfs:Class
  const [open, setOpen] = useState(false); // 编辑Modal
  const [createMode, setCreateMode] = useState(true); // Modal是否是创建新资源模式
  // const [textIRI, setTextIRI] = useState('');
  // const [textIsDefinedBy, setTextIsDefinedBy] = useState('');
  const [pvss, setPvss] = useState({});
  // const modalForm = useRef<ProFormInstance>()


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
        <PropertyValues iri={qs.iri || ''} prefixTriples={prefixTriples || []}/>
      </Space>
    </PageContainer>
  );
};
export default BasicForm;
