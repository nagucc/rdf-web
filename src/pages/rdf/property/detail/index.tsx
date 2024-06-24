import {
  PageContainer,
} from '@ant-design/pro-components';
import { Space } from 'antd';
import { useEffect, useState, type FC } from 'react';
import { useParams, useRequest } from '@umijs/max';
import { Prefix, Resource } from '@/api';
import { RDFS } from '@/utils';
import { ITriple } from 'nagu-triples-types';
import SearchCard from './SearchCard';
import PropertyValues from './PropertyValues';

const BasicForm: FC<Record<string, any>> = () => {
  const qs = useParams();
  const [, setIsResourceClass] = useState(false); // 当前资源是否是rdfs:Class
  const [, setOpen] = useState(false); // 编辑Modal
  const [, setCreateMode] = useState(true); // Modal是否是创建新资源模式
  const [pvss, setPvss] = useState({});


  // 获取资源属性值
  const { data: pvs, run: getPvs, loading: loadingPvs } = useRequest((piri:string) => {
    return Resource.getPropertyValues(qs.iri || '', piri);
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
