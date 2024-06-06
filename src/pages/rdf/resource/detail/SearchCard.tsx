import { Card,
  Input,
  Button, message,
} from 'antd';
import {
  useState, type FC } from 'react';
import { history,
} from '@umijs/max';
import {
  replacePrefixWithIRI } from '@/utils';
import { ITriple } from 'nagu-triples-types';
import {
  PlusOutlined } from '@ant-design/icons';

export type SearchCardProps = {
  iri: string, // 当前Resource的IRI
  onCreateBtnClick():void,
  prefixTriples: ITriple[],
}
const SearchCard: FC<SearchCardProps> = (props: SearchCardProps) => {
  const [inputIRI, setInputIRI] = useState(props.iri); // 搜索框
  const [inputStatus, setInputStatus] = useState(''); // 搜索框

  return (
    <Card title="检索" bordered={false}
      extra={
        <Button type="primary" onClick={props.onCreateBtnClick}><PlusOutlined />新建资源</Button>
      }
    >
      <Input.Search placeholder="输入资源IRI" enterButton defaultValue={inputIRI} value={inputIRI}
        //@ts-ignore
        status={inputStatus}
        onChange={(e: { target: { value: string; }; }) => {
          // 当IRI未验证通过时，对每次输入的IRI进行验证
          if (inputStatus === 'error'
            && !!/^https?:\/\/.+/.test(e.target.value)) {
              setInputStatus('');
          }

          const value = replacePrefixWithIRI(e.target.value, props.prefixTriples as ITriple[]);
          setInputIRI(value);
        }}
        onSearch={iri => {
          if (!!/^https?:\/\/.+/.test(iri)) {
            history.push(`/rdf/resource/${encodeURIComponent(iri)}`);
          } else {
            setInputStatus('error');
            message.error('IRI格式不正确');
          }
        }}
      />
    </Card>
  );
};
export default SearchCard;
